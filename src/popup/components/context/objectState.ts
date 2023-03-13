import { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { TypeOperations } from "../../../background/TypeOperations";

export type ObjectChangeHandler<T> = (obj: T) => void

export interface ObjectState<T> {
    object?: T
    object_id?: number
    changeObject: (handler: ObjectChangeHandler<T>, forceProtect?: boolean) => void
    err?: string
}

export function useObjectState<T>(dbhandler: TypeOperations<T>, id?: number,
    disabled?: boolean, disabledMessage?: string
): ObjectState<T> {

    const [object, setObject] = useState<T | undefined>();
    const [object_id, setObjectId] = useState<number | undefined>();
    const [err, setErr] = useState<string | undefined>(undefined);

    const [changesCount, setChangesCount] = useState(0);

    function fetchObject(fetchId: number) {

        setErr(undefined);

        console.log("fetch object in useObjectState()")

        dbhandler.getById(fetchId).then((respObject) => {
            setObject(respObject)
            setObjectId(fetchId);
        }).catch((e: any) => {
            setErr('unable to find object')
        })
    }

    useEffect(() => {
        if (id) {
            fetchObject(id);
        } else {
            setObject(undefined);
        }
    }, [id])


    useEffect(() => {
        if (object_id && changesCount > 0) {
            dbhandler.update(object_id, object)
                .catch(e => {
                    console.error('unable to update object', e.message)
                    setErr(e.message)
                })
        }
    }, [changesCount, object_id])

    const result = useMemo(() => {

        const changeObject = (handler: ObjectChangeHandler<T>, forceProtection?: boolean) => {
            if (object !== undefined) {

                if (disabled && !forceProtection) {
                    toast(disabledMessage)
                } else {
                    handler(object)

                    setObject(object)
                    setChangesCount(changesCount + 1)
                }
            }
        }

        let context: ObjectState<T> = {
            object_id: object_id,
            object,
            changeObject,
            err
        };

        return context;
    }, [object, object_id, changesCount, err, disabled])

    return result;
}
