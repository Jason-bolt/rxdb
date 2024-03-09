import assert from 'assert';
import { randomBoolean, randomNumber, wait, waitUntil } from 'async-test-util';
import { Observable } from 'rxjs';

import config from './config.ts';

import {
    createRxDatabase,
    randomCouchString,
    addRxPlugin,
    lastOfArray,
    RxReactivityFactory,
    RxState
} from '../../plugins/core/index.mjs';

import {
    nextRxStateId,
    RxDBStatePlugin
} from '../../plugins/state/index.mjs';
addRxPlugin(RxDBStatePlugin);

import { RxDBAttachmentsPlugin } from '../../plugins/attachments/index.mjs';
addRxPlugin(RxDBAttachmentsPlugin);
import { RxDBJsonDumpPlugin } from '../../plugins/json-dump/index.mjs';
addRxPlugin(RxDBJsonDumpPlugin);

describe('rx-state.test.ts', () => {
    type TestState = {
        foo?: string;
        a?: number;
        b?: number;
        nes?: {
            ted?: string;
        };
    };
    type ReactivityType = {
        obs: Observable<any>;
        init: any;
    };
    const reactivity: RxReactivityFactory<ReactivityType> = {
        fromObservable(obs, init) {
            return {
                obs,
                init
            };
        }
    };
    async function getDatabase(databaseName: string = randomCouchString(10)) {
        const database = await createRxDatabase<{}, {}, {}, ReactivityType>({
            name: databaseName,
            storage: config.storage.getStorage(),
            reactivity,
            ignoreDuplicate: true,
        });
        return database;
    }
    async function getState(
        databaseName: string = randomCouchString(10),
        prefix?: string,
    ) {
        const database = await getDatabase(databaseName);
        const state: RxState<TestState, ReactivityType> = await database.addState<TestState>(prefix);
        return state;
    }
    function plusOne(v: number): number {
        return v + 1;
    }

    describe('helper', () => {
        describe('.nextRxStateId()', () => {
            it('should increment in sort order', () => {
                const ids: string[] = [];
                let t = 1000;
                let current = nextRxStateId();
                ids.push(current);
                while (t > 0) {
                    t--;
                    current = nextRxStateId(current);
                    ids.push(current);
                }

                const sorted = ids.slice(0).sort();
                assert.deepStrictEqual(ids, sorted);
            });
        });
    });
    describe('creation', () => {
        it('calling addState twice should give the same instance', async () => {
            const database = await getDatabase();

            const state1 = await database.addState();
            const state2 = await database.addState();
            const state3 = await database.addState('foobar');

            assert.ok(state1 === state2);
            assert.ok(state1 !== state3);
            assert.ok(state1 === database.states['']);
            assert.ok(state3 === database.states.foobar);

            database.destroy();
        });
    });
    describe('write state data', () => {
        it('should write without error', async () => {
            const state = await getState();
            await state.set('foo', () => 'bar');
            assert.strictEqual(state.foo, 'bar');
            state.collection.database.destroy();
        });
        it('write multiple times at once', async () => {
            const state = await getState();
            await state.set('a', () => 0);
            await Promise.all(
                new Array(10).fill(0).map(() => state.set('a', plusOne))
            );
            assert.strictEqual(state.get('a'), 10);
            state.collection.database.destroy();
        });
        it('update nested', async () => {
            const state = await getState();
            await state.set('nes', () => {
                return {};
            });
            await state.set('nes.ted', () => 'foo');
            await state.set('nes.ted', () => 'foo2');
            state.collection.database.destroy();
        });
        it('doing many writes should end up in a single persistence write to the storage', async () => {
            const state = await getState();
            await state.set('a', () => 0);

            const promises: Promise<any>[] = [];
            new Array(100).fill(0).forEach((_v, i) => {
                promises.push(state.set('a', () => i));
            });
            await Promise.all(promises);

            const storageWrites = await state.collection.find().exec();
            assert.strictEqual(storageWrites.length, 2);

            state.collection.database.destroy();
        });
    });
    describe('.get()', () => {
        it('should get root state', async () => {
            const state = await getState();
            await state.set('foo', () => 'bar');
            const root = state.get();
            assert.strictEqual(root.foo, 'bar');
            state.collection.database.destroy();
        });
        it('should get the updated value', async () => {
            const state = await getState();
            await state.set('foo', () => 'bar');
            assert.strictEqual(state.foo, 'bar');
            assert.strictEqual(state.get('foo'), 'bar');
            await state.set('foo', () => 'bar2');
            assert.strictEqual(state.foo, 'bar2');
            assert.strictEqual(state.get('foo'), 'bar2');
            state.collection.database.destroy();
        });
        it('should get nested values', async () => {
            const state = await getState();
            await state.set('nes', () => {
                return { ted: 'foo' };
            });
            assert.deepStrictEqual(state.nes, { ted: 'foo' });
            assert.deepStrictEqual(state.get('nes'), { ted: 'foo' });
            assert.deepStrictEqual(state.get('nes.ted'), 'foo');

            await state.set('nes.ted', () => 'foo2');
            assert.deepStrictEqual(state.nes, { ted: 'foo2' });
            assert.deepStrictEqual(state.get('nes'), { ted: 'foo2' });
            assert.deepStrictEqual(state.get('nes.ted'), 'foo2');

            state.collection.database.destroy();
        });
        it('should not throw on undefined values', async () => {
            const state = await getState();
            assert.deepStrictEqual(state.get('nes'), undefined);
            assert.deepStrictEqual(state.nes, undefined);
            assert.deepStrictEqual(state.get('nes.ted'), undefined);
            state.collection.database.destroy();
        });
    });
    describe('.get$()', () => {
        it('should emit the correct data', async () => {
            const state = await getState();

            const emitted: any[] = [];
            state.get$('a').subscribe(v => {
                emitted.push(v);
            });

            await state.set('a', () => 0);
            await state.set('a', () => 1);


            await state.set('a', () => 2);

            assert.deepStrictEqual(emitted, [
                undefined,
                0,
                1,
                2
            ]);

            await Promise.all([
                state.set('a', () => 3),
                state.set('a', () => 4),
                state.set('a', () => 5)
            ]);

            await waitUntil(() => lastOfArray(emitted) === 5);
            assert.deepStrictEqual(emitted, [
                undefined,
                0,
                1,
                2,
                5
            ]);

            state.collection.database.destroy();
        });
        it('should emit the correct data via proxy-getter a$', async () => {
            const state = await getState();

            const emitted: any[] = [];
            state.a$.subscribe(v => {
                emitted.push(v);
            });

            await state.set('a', () => 0);
            await state.set('a', () => 1);
            await state.set('a', () => 2);

            assert.deepStrictEqual(emitted, [
                undefined,
                0,
                1,
                2
            ]);

            await Promise.all([
                state.set('a', () => 3),
                state.set('a', () => 4),
                state.set('a', () => 5)
            ]);

            await waitUntil(() => lastOfArray(emitted) === 5);
            assert.deepStrictEqual(emitted, [
                undefined,
                0,
                1,
                2,
                5
            ]);

            state.collection.database.destroy();
        });
    });
    describe('.get$$()', () => {
        it('should get the correct object', async () => {
            const state = await getState();
            await state.set('a', () => 42);
            const reactivityAr = [
                state.get$$('a'),
                state.a$$
            ];
            reactivityAr.forEach(rr => assert.strictEqual(rr.init, 42));
            state.collection.database.destroy();
        });
    });
    describe('cleanup', () => {
        it('should merge the state documents data on cleanup', async () => {
            const state = await getState();

            let t = 0;
            while (t < 100) {
                await state.set('a', () => t);
                t++;
            }

            const stateDocsBefore = await state.collection.find().exec();
            assert.strictEqual(stateDocsBefore.length, 100);
            console.log('stateDocsBefore: ' + stateDocsBefore.length);

            await state._cleanup();

            const stateDocsAfter = await state.collection.find().exec();
            assert.strictEqual(stateDocsAfter.length, 1, 'stateDocsAfter must be one');

            assert.strictEqual(state.a, 99);

            state.collection.database.destroy();
        });
    });
    describe('multiInstance', () => {
        if (!config.storage.hasMultiInstance) {
            return;
        }
        it('write with two states at once', async () => {
            const databaseName = randomCouchString(10);
            const state1 = await getState(databaseName);
            const state2 = await getState(databaseName);
            await state1.set('a', () => 0);
            await Promise.all([
                state1.set('a', plusOne),
                state2.set('a', plusOne),
            ]);
            await waitUntil(() => state1.a === 2);
            await waitUntil(() => state2.a === 2);
            state1.collection.database.destroy();
            state2.collection.database.destroy();
        });
        it('write with two states to nested at once', async () => {
            const databaseName = randomCouchString(10);
            const state1 = await getState(databaseName);
            const state2 = await getState(databaseName);
            await state1.set('nes', () => {
                return { ted: 'foo' };
            });
            await Promise.all([
                state1.set('nes.ted', () => 'foo1'),
                state2.set('nes.ted', () => 'foo2')
            ]);
            await waitUntil(() => state1.nes?.ted === 'foo2');
            await waitUntil(() => state2.nes?.ted === 'foo2');
            state1.collection.database.destroy();
            state2.collection.database.destroy();
        });
        it('should have a deterministic output when 2 instances write at the same time', async () => {
            const databaseName = randomCouchString(10);
            const state1 = await getState(databaseName);
            const state2 = await getState(databaseName);

            await state1.set('a', () => 0);

            let t = 0;
            const amount = 100;
            const promises: Promise<any>[] = [];
            while (t < amount) {
                t++;
                promises.push(state1.set('a', plusOne));
                promises.push(state2.set('a', plusOne));
                if (randomBoolean() && randomBoolean()) {
                    await wait(randomNumber(0, 10));
                }
            }
            await Promise.all(promises);

            await waitUntil(() => state1.a === amount * 2);
            await waitUntil(() => state2.a === amount * 2);

            state1.collection.database.destroy();
            state2.collection.database.destroy();
        });
        it('should have a deterministic output when 2 instances write to different fields', async () => {
            const databaseName = randomCouchString(10);
            const state1 = await getState(databaseName);
            const state2 = await getState(databaseName);

            await state1.set('a', () => 0);
            await state2.set('b', () => 0);

            let t = 0;
            const amount = 100;
            const promises: Promise<any>[] = [];
            while (t < amount) {
                t++;
                promises.push(state1.set('a', plusOne));
                promises.push(state2.set('b', plusOne));
                if (randomBoolean() && randomBoolean()) {
                    await wait(randomNumber(0, 10));
                }
            }
            await Promise.all(promises);
            await wait(100);

            assert.strictEqual(state1.get('a'), amount);
            assert.strictEqual(state2.get('a'), amount);
            assert.strictEqual(state1.get('b'), amount);
            assert.strictEqual(state2.get('b'), amount);

            state1.collection.database.destroy();
            state2.collection.database.destroy();
        });
    });
});
