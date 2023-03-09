import { useEffect, useState } from "react";
import { useExtensionContext } from "../components/context/ExtensionContext";
import { DataType } from "../components/smetana";
import { DataType as DataTypeInterface, findDatatypes } from "../../background/types"
import { TextInput, BottomContent, MenuEntry } from "../components/menu";

export let SearchLimit = 30;

export interface DataTypesProps {
}

export function DataTypes(props: DataTypesProps) {

    const { setRoute, toggleSlide } = useExtensionContext();
    const [query, setQuery] = useState<string>("");

    const [items, setItems] = useState<DataTypeInterface[]>([]);

    useEffect(() => {
        findDatatypes(query, SearchLimit).then((items) => {
            setItems(items);
        });
    }, [query])

    return <>
        <BottomContent>
            {/* <MultipleItemsRow> */}
            <MenuEntry
                colorVariant="info"
                onClick={() => {
                    toggleSlide("new_type");
                }}>New type</MenuEntry>
        </BottomContent>
        <TextInput
            sizeVariant="sm"
            placeholder="search query"
            value={query}
            onChange={(newVal) => {
                setQuery(newVal)
            }}></TextInput>
        {items.map((it, idx) => {
            return <DataType key={idx} item={it} onClick={() => {
                setRoute("edit_datatype", "Edit type", false, it.id);
            }} />
        })}
    </>
}