import { db } from "./database";
export const RpcConfigKey = "rpc_config";

const configtable = db.table('config');

export async function getKeyValueFromDb(key: string, deflt: string) {
    return configtable.db.transaction('rw', configtable, async () => {
        const resp = await configtable.get({ key });
        if (resp == null) {
            await configtable.add({ key, value: deflt });
            return deflt;
        } else {
            return resp.value;
        }
    })
}


export async function getAndSet(key: string, ifval: string, setval: string): Promise<string> {

    return configtable.db.transaction('rw', configtable, async () => {
        const resp = await configtable.get({ key });
        if (resp == null) {
            await configtable.add({ key, value: setval });
            return ifval;
        } else {

            if (resp.value == ifval) {
                await configtable.update(key, { value: setval });
                return ifval;
            } else {
                return resp.value;
            }
        }
    })
}

export async function setKeyValueToDb(key: string, value: string): Promise<any> {

    return configtable.db.transaction('rw', configtable, async () => {
        const resp = configtable.get({ key });

        if (resp == null) {
            try {
                const result = configtable.add({ key, value: value });
                return value;
            } catch (e) {
                console.log('unable to set configtable value ', key, e)
                throw e;
            }
        } else {
            return configtable.update(key, { value: value }).then(() => {
                return value;
            })
        }
    }).catch(e => {
        console.warn('got an exception when setting key value config : ' + e.message, e)
    })
}


export function setKeyValue(key: string, value: string) {
    localStorage.setItem(key, value)

    // async. don't wait
    configtable.get({ key }).then((resp) => {
        if (resp != null) {
            configtable.update(key, { value })
        } else {
            configtable.add({ key, value: value })
        }
    })
}

export function getKeyValueOrDefault(key: string, deflt: string): string {

    // duplicate keys into database
    // so it can be used in background worker as well


    let fetched = localStorage.getItem(key)
    if (fetched == null) {
        setKeyValue(key, deflt)
        return deflt
    }

    return fetched;
}



