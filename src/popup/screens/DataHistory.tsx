import { Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { AddressData, getHistory } from "../../background/types";
import { ActionButton } from "../components/menu";

export function DataHistory(props: { id?: number }) {

    const { id } = props;

    const [entries, setEntries] = useState<AddressData[]>([]);

    useEffect(() => {
        if (id) {
            getHistory(id, 30).then((items) => {
                setEntries(items);
            })
        } else {
            setEntries([]);
        }
    }, [id])


    return <>
        <ActionButton>total {entries.length} entries</ActionButton>
        {entries.map((it) => {
            return <ActionButton>
                created: {new Date(it.created_at).toISOString()}
            </ActionButton>
        })}
    </>
}