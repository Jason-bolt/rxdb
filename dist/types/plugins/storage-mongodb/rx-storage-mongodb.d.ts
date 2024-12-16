import type { RxStorage, RxStorageInstanceCreationParams } from '../../types/index.d.ts';
import type { MongoDBDatabaseSettings, MongoDBSettings, MongoDBStorageInternals } from './mongodb-types.ts';
import { RxStorageInstanceMongoDB } from './rx-storage-instance-mongodb.ts';
export declare class RxStorageMongoDB implements RxStorage<MongoDBStorageInternals, MongoDBSettings> {
    databaseSettings: MongoDBDatabaseSettings;
    name: string;
    readonly rxdbVersion = "16.0.0-beta.10";
    constructor(databaseSettings: MongoDBDatabaseSettings);
    createStorageInstance<RxDocType>(params: RxStorageInstanceCreationParams<RxDocType, MongoDBSettings>): Promise<RxStorageInstanceMongoDB<RxDocType>>;
}
export declare function getRxStorageMongoDB(databaseSettings: MongoDBDatabaseSettings): RxStorageMongoDB;
