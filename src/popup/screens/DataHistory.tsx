import { Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { AddressData, getHistory } from "../../background/types";
import { ActionButton } from "../components/menu";

export function DataHistory(props: { id?: number }) {

    const { id } = props;

    const [entries, setEntries] = useState<AddressData[]>([]);
    const [entriesCount, setCount] = useState(0);

    useEffect(() => {
        if (id) {
            getHistory(id, 30).then((items) => {
                setEntries(items.filtered);
                setCount(items.total)
            })
        } else {
            setEntries([]);
            setCount(0);
        }
    }, [id])


    return <>
        <ActionButton>total {entriesCount} entries</ActionButton>
        {entries.map((it) => {

            let date = new Date(it.created_at * 1000);

            return <ActionButton>
                created: {date.getHours()}:{date.getMinutes()}
            </ActionButton>
        })}
    </>
}