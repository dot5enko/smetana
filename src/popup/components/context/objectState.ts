import { useState, useEffect, useMemo } from "react";
import { TypeOperations } from "../../../background/TypeOperations";

export type ObjectChangeHandler<T> = (obj: T) => void

export interface ObjectState<T> {
    object?: T
    object_id?: number
    changeObject: (handler: ObjectChangeHandler<T>) => void
}

export function useObjectState<T>(dbhandler: TypeOperations<T>, id?: number): ObjectState<T> {

    const [object, setObject] = useState<T | undefined>();
    const [object_id, setObjectId] = useState<number | undefined>();

    const [changesCount, setChangesCount] = useState(0);

    function fetchObject(fetchId: number) {

        console.log("fetch object in useObjectState()")

        dbhandler.getById(fetchId).then((respObject) => {
            setObject(respObject)
            setObjectId(fetchId);
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
                .catch(e => console.error('unable to update object', e.message))

            console.log('update object: ', object)
        }
    }, [changesCount, object_id])

    const result = useMemo(() => {

        const changeObject = (handler: ObjectChangeHandler<T>) => {
            if (object !== undefined) {

                handler(object)

                setObject(object)
                setChangesCount(changesCount + 1)
            }
        }

        let context: ObjectState<T> = {
            object_id: object_id,
            object,
            changeObject
        };

        return context;
    }, [object, object_id, changesCount])

    return result;
}
