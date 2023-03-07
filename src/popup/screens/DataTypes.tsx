import { useEffect, useState } from "react";
import { createNew, findDatatypes } from "../../background/types/DataType";
import { useExtensionContext } from "../components/context/ExtensionContext";
import { ActionButton } from "../components/menu/ActionButton";
import { DataType } from "../components/smetana/DataType";
import { DataType as DataTypeInterface } from "../../background/types/DataType"
import { TextInput } from "../components/menu/TextInput";
import { Group } from "../components/menu/Group";
import { MultipleItemsRow } from "../components/menu/MultipleitemsRow";

export let SearchLimit = 30;

export interface DataTypesProps {
}

export function DataTypes(props: DataTypesProps) {

    const { setRoute } = useExtensionContext();
    const [query, setQuery] = useState<string>("");

    const [items, setItems] = useState<DataTypeInterface[]>([]);

    useEffect(() => {
        findDatatypes(query, SearchLimit).then((items) => {
            setItems(items);
        });
    }, [query])

    return <>
        <MultipleItemsRow>
            <ActionButton
                actionVariant="info"
                action={() => {
                    createNew().then((id) => {
                        setRoute('edit_datatype', id as number)
                    }).catch((e: any) => {
                        console.error('unable to create new type:', e.message)
                    });
                }}>New type</ActionButton>
            <ActionButton
                actionVariant="success"
                action={() => {
                    setRoute('import_anchor_type')
                }}>From anchor</ActionButton>
        </MultipleItemsRow>

        {/* <Group> */}
        <TextInput
            placeholder="search query"
            value={query}
            onChange={(newVal) => {
                setQuery(newVal)
            }}></TextInput>
        {items.map((it, idx) => {
            return <DataType key={idx} item={it} onClick={() => {
                setRoute("edit_datatype", it.id);
            }} />
        })}
        {/* </Group> */}
    </>
}