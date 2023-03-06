import Dexie from "dexie";


export function setKeyValue(key: string, value: string) {

    localStorage.setItem(key,value)
}

export function getKeyValueOrDefault(key: string, deflt: string): string {
    let fetched =  localStorage.getItem(key)
    if (fetched == null) {
        setKeyValue(key,deflt)
        return deflt
    }

    return fetched;
}
