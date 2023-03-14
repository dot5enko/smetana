import { useEffect, useState } from "react";
import { useExtensionContext } from "../components/context/ExtensionContext";
import { DataType } from "../components/smetana";
import { DataType as DataTypeInterface, findDatatypes } from "../../background/types"
import { TextInput, BottomContent, MenuEntry } from "../components/menu";
import { setup_types } from "../../background/setupTypes";

export let SearchLimit = 30;

export interface DataTypesProps {
}

export function DataTypes(props: DataTypesProps) {

    const { setRoute, setSlideRoute } = useExtensionContext();

    const [query, setQuery] = useState<string>("");
    const [items, setItems] = useState<DataTypeInterface[]>([]);

    function loadTypes(q: string) {
        findDatatypes(q, SearchLimit).then((items) => {
            setItems(items);
        });
    }

    useEffect(() => {
        setup_types().then((setup) => {
            if (setup) {
                loadTypes(query);
            }
        });
    }, [])

    useEffect(() => {


        loadTypes(query);

    }, [query])

    return <>
        <BottomContent>
            {/* <MultipleItemsRow> */}
            <MenuEntry
                colorVariant="info"
                onClick={() => {
                    setSlideRoute("new_type");
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