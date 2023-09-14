import {
    Observable,
    Subject
} from 'rxjs';
import { getPrimaryFieldOfPrimaryKey } from '../../rx-schema-helper';
import type {
    BulkWriteRow,
    ById,
    EventBulk,
    RxConflictResultionTask,
    RxConflictResultionTaskSolution,
    RxDocumentData,
    RxDocumentDataById,
    RxJsonSchema,
    RxStorageBulkWriteResponse,
    RxStorageChangeEvent,
    RxStorageCountResult,
    RxStorageDefaultCheckpoint,
    RxStorageInstance,
    RxStorageInstanceCreationParams,
    RxStorageQueryResult,
    RxStorageWriteErrorConflict,
    StringKeys
} from '../../types';
import {
    ensureNotFalsy,
    getFromObjectOrThrow,
    isMaybeReadonlyArray,
    lastOfArray,
    now,
    RX_META_LWT_MINIMUM
} from '../../plugins/utils';
import {
    MongoDBPreparedQuery,
    MongoDBStorageInternals,
    MongoQuerySelector,
    RxStorageMongoDBInstanceCreationOptions,
    RxStorageMongoDBSettings
} from './mongodb-types';
import { RxStorageMongoDB } from './rx-storage-mongodb';
import {
    Db as MongoDatabase,
    Collection as MongoCollection,
    MongoClient,
    ObjectId,
    ClientSession
} from 'mongodb';
import { categorizeBulkWriteRows } from '../../rx-storage-helper';
import {
    MONGO_ID_SUBSTITUTE_FIELDNAME,
    getMongoDBIndexName,
    swapMongoToRxDoc,
    swapRxDocToMongo
} from './mongodb-helper';

export class RxStorageInstanceMongoDB<RxDocType> implements RxStorageInstance<
    RxDocType,
    MongoDBStorageInternals,
    RxStorageMongoDBInstanceCreationOptions,
    RxStorageDefaultCheckpoint
> {

    public readonly primaryPath: StringKeys<RxDocumentData<RxDocType>>;
    public readonly inMongoPrimaryPath: string;
    public closed = false;
    public readonly mongoClient: MongoClient;
    public readonly mongoDatabase: MongoDatabase;
    public readonly mongoCollectionPromise: Promise<MongoCollection<RxDocumentData<RxDocType> | any>>;


    /**
     * We use this to be able to still fetch
     * the objectId after transforming the document from mongo-style (with _id)
     * to RxDB
     */
    public readonly mongoObjectIdCache = new WeakMap<RxDocumentData<RxDocType>, ObjectId>();

    constructor(
        public readonly storage: RxStorageMongoDB,
        public readonly databaseName: string,
        public readonly collectionName: string,
        public readonly schema: Readonly<RxJsonSchema<RxDocumentData<RxDocType>>>,
        public readonly internals: MongoDBStorageInternals,
        public readonly options: Readonly<RxStorageMongoDBInstanceCreationOptions>,
        public readonly settings: RxStorageMongoDBSettings
    ) {
        if (this.schema.attachments) {
            throw new Error('attachments not supported in mongodb storage, make a PR if you need that');
        }
        this.primaryPath = getPrimaryFieldOfPrimaryKey(this.schema.primaryKey);
        this.inMongoPrimaryPath = this.primaryPath === '_id' ? MONGO_ID_SUBSTITUTE_FIELDNAME : this.primaryPath;
        this.mongoClient = new MongoClient(storage.databaseSettings.connection);
        this.mongoDatabase = this.mongoClient.db(databaseName);

        const indexes = (this.schema.indexes ? this.schema.indexes.slice() : []).map(index => {
            const arIndex = isMaybeReadonlyArray(index) ? index.slice(0) : [index];
            return arIndex;
        });
        indexes.push([this.inMongoPrimaryPath]);

        this.mongoCollectionPromise = this.mongoDatabase.createCollection(collectionName)
            .then(async (mongoCollection) => {
                await mongoCollection.createIndexes(
                    indexes.map(index => {
                        const mongoIndex: any = {};
                        index.forEach(field => mongoIndex[field] = 1);
                        return { name: getMongoDBIndexName(index), key: mongoIndex };
                    })
                );
                return mongoCollection;
            });

        // this.mongoCollection.watch().on('change', change => {
        //     change.
        // });

    }

    /**
     * Bulk writes on the mongodb storage.
     * Notice that MongoDB does not support cross-document transactions
     * so we have to do a update-if-previous-is-correct like operations.
     * (Similar to what RxDB does with the revision system)
     */
    async bulkWrite(
        documentWrites: BulkWriteRow<RxDocType>[],
        context: string
    ): Promise<RxStorageBulkWriteResponse<RxDocType>> {
        const mongoCollection = await this.mongoCollectionPromise;
        const primaryPath = this.primaryPath;
        const ret: RxStorageBulkWriteResponse<RxDocType> = {
            success: {},
            error: {}
        };

        const docIds = documentWrites.map(d => (d.document as any)[primaryPath]);
        const documentStates = await this.findDocumentsById(
            docIds,
            true
        );
        const categorized = categorizeBulkWriteRows<RxDocType>(
            this,
            primaryPath as any,
            documentStates,
            documentWrites,
            context
        );
        ret.error = categorized.errors;

        await Promise.all([
            /**
             * Inserts
             * @link https://sparkbyexamples.com/mongodb/mongodb-insert-if-not-exists/
             */
            Promise.all(
                categorized.bulkInsertDocs.map(async (writeRow) => {
                    const docId: string = writeRow.document[primaryPath] as any;
                    const writeResult = await mongoCollection.findOneAndUpdate(
                        {
                            [this.inMongoPrimaryPath]: docId
                        },
                        {
                            $setOnInsert: swapRxDocToMongo(writeRow.document)
                        },
                        {
                            upsert: true,
                            includeResultMetadata: true
                        }
                    );
                    if (writeResult.value) {
                        // had insert conflict
                        const conflictError: RxStorageWriteErrorConflict<RxDocType> = {
                            status: 409,
                            documentId: docId,
                            writeRow,
                            documentInDb: swapMongoToRxDoc(writeResult.value),
                            isError: true
                        };
                        ret.error[docId] = conflictError;
                    } else {
                        ret.success[docId as any] = writeRow.document;
                    }
                })
            ),
            /**
             * Updates
             */
            Promise.all(
                categorized.bulkUpdateDocs.map(async (writeRow) => {
                    const docId = writeRow.document[primaryPath] as string;
                    const writeResult = await mongoCollection.findOneAndReplace(
                        {
                            [this.inMongoPrimaryPath]: docId,
                            _rev: ensureNotFalsy(writeRow.previous)._rev
                        },
                        swapRxDocToMongo(writeRow.document),
                        {
                            includeResultMetadata: true,
                            upsert: false
                        }
                    );
                    if (!writeResult.value) {
                        const currentDocState = await this.findDocumentsById([docId], true);
                        const currentDoc = getFromObjectOrThrow(currentDocState, docId);
                        // had insert conflict
                        const conflictError: RxStorageWriteErrorConflict<RxDocType> = {
                            status: 409,
                            documentId: docId,
                            writeRow,
                            documentInDb: currentDoc,
                            isError: true
                        };
                        ret.error[docId] = conflictError;
                    } else {
                        ret.success[docId as any] = writeRow.document;
                    }

                })
            )
        ]);
        return ret;
    }

    async findDocumentsById(
        docIds: string[],
        withDeleted: boolean,
        session?: ClientSession
    ): Promise<RxDocumentDataById<RxDocType>> {
        console.log('findDocumentsById(' + docIds.join(', ') + ') START');
        const mongoCollection = await this.mongoCollectionPromise;
        const primaryPath = this.primaryPath;

        const plainQuery: MongoQuerySelector<any> = {
            [primaryPath]: {
                $in: docIds
            }
        };
        if (!withDeleted) {
            plainQuery._deleted = false;
        }
        const result: ById<RxDocumentData<RxDocType>> = {};
        const queryResult = await mongoCollection.find(
            plainQuery,
            {
                session
            }
        ).toArray();
        queryResult.forEach(row => {
            result[(row as any)[primaryPath]] = swapMongoToRxDoc(
                row as any
            );
        });
        console.log('findDocumentsById(' + docIds.join(', ') + ') DONE');
        console.dir(result);
        return result;
    }

    async query(
        preparedQuery: MongoDBPreparedQuery<RxDocType>
    ): Promise<RxStorageQueryResult<RxDocType>> {
        const mongoCollection = await this.mongoCollectionPromise;

        console.log('QUERY():');
        console.dir(preparedQuery);

        let query = mongoCollection.find(preparedQuery.mongoSelector);
        if (preparedQuery.query.skip) {
            query = query.skip(preparedQuery.query.skip);
        }
        if (preparedQuery.query.limit) {
            query = query.limit(preparedQuery.query.limit);
        }
        if (preparedQuery.query.sort) {
            console.log('add sort!');
            query = query.sort(preparedQuery.mongoSort);
        }
        const resultDocs = await query.toArray();
        return {
            documents: resultDocs.map(d => swapMongoToRxDoc(d))
        };
    }

    async count(
        preparedQuery: MongoDBPreparedQuery<RxDocType>
    ): Promise<RxStorageCountResult> {
        const mongoCollection = await this.mongoCollectionPromise;

        console.log('::COUNT:');
        console.dir(preparedQuery);

        const count = await mongoCollection.countDocuments(preparedQuery.mongoSelector);
        console.log('count: ' + count);
        return {
            count,
            mode: 'fast'
        };
    }

    async getChangedDocumentsSince(
        limit: number,
        checkpoint?: RxStorageDefaultCheckpoint
    ): Promise<{
        documents: RxDocumentData<RxDocType>[];
        checkpoint: RxStorageDefaultCheckpoint;
    }> {
        const mongoCollection = await this.mongoCollectionPromise;

        console.log('getChangedDocumentsSince():');
        console.dir(checkpoint);

        const sinceLwt = checkpoint ? checkpoint.lwt : RX_META_LWT_MINIMUM;
        const plainQuery = {
            $or: [
                {
                    '_meta.lwt': {
                        $gt: sinceLwt
                    }
                },
                {
                    '_meta.lwt': {
                        $eq: sinceLwt
                    },
                    [this.inMongoPrimaryPath]: {
                        $gt: checkpoint ? checkpoint.id : ''
                    }
                }
            ]
        };
        console.dir(plainQuery);
        const query = mongoCollection.find(plainQuery)
            .sort({
                '_meta.lwt': 1,
                [this.inMongoPrimaryPath]: 1
            })
            .limit(limit);
        const documents = await query.toArray();
        console.log('documents:');
        console.dir(documents);
        const lastDoc = lastOfArray(documents);
        return {
            documents: documents as any,
            checkpoint: lastDoc ? {
                id: lastDoc[this.primaryPath],
                lwt: lastDoc._meta.lwt
            } : checkpoint ? checkpoint : {
                id: '',
                lwt: 0
            }
        };
    }

    async cleanup(minimumDeletedTime: number): Promise<boolean> {
        const mongoCollection = await this.mongoCollectionPromise;
        const maxDeletionTime = now() - minimumDeletedTime;
        await mongoCollection.deleteMany({
            _deleted: true,
            '_meta.lwt': {
                $lt: maxDeletionTime
            }
        });
        return true;
    }

    async getAttachmentData(
        _documentId: string,
        _attachmentId: string,
        _digest: string
    ): Promise<string> {
        await this.mongoCollectionPromise;
        throw new Error('attachments not implemented, make a PR');
    }

    changeStream(): Observable<EventBulk<RxStorageChangeEvent<RxDocumentData<RxDocType>>, RxStorageDefaultCheckpoint>> {
        return {} as any;
    }

    async remove(): Promise<void> {
        const mongoCollection = await this.mongoCollectionPromise;
        await mongoCollection.drop();
    }

    async close(): Promise<void> {
        await this.mongoCollectionPromise;
        await this.mongoClient.close();
    }

    conflictResultionTasks(): Observable<RxConflictResultionTask<RxDocType>> {
        return new Subject();
    }
    async resolveConflictResultionTask(_taskSolution: RxConflictResultionTaskSolution<RxDocType>): Promise<void> { }
}

export function createMongoDBStorageInstance<RxDocType>(
    storage: RxStorageMongoDB,
    params: RxStorageInstanceCreationParams<RxDocType, RxStorageMongoDBInstanceCreationOptions>,
    settings: RxStorageMongoDBSettings
): Promise<RxStorageInstanceMongoDB<RxDocType>> {
    const instance = new RxStorageInstanceMongoDB(
        storage,
        params.databaseName,
        params.collectionName,
        params.schema,
        {
            changes$: new Subject()
        },
        params.options,
        settings
    );
    return Promise.resolve(instance);
}
