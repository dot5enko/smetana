import { db } from "./database";
export const RpcConfigKey = "rpc_config";

const configtable = db.table('config');

export async function getKeyValueFromDb(key: string, deflt: string): Promise<string> {
    return configtable.get({ key }).then((resp) => {
        if (resp == null) {
            return configtable.add({ key, value: deflt }).then(() => {
                return deflt;
            })
        } else {
            return resp.value;
        }
    })
}

export async function setKeyValueToDb(key: string, value: string) {
    return configtable.get({ key }).then((resp) => {
        if (resp == null) {
            return configtable.add({ key, value: value }).then(() => {
                return value;
            })
        } else {
            return configtable.update(key, { value: value }).then(() => {
                return value;
            })
        }
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



