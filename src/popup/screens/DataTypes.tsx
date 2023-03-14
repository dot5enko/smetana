import { useEffect, useState } from "react";
import { useExtensionContext } from "../components/context/ExtensionContext";
import { DataType } from "../components/smetana";
import { DataType as DataTypeInterface, findDatatypes, ItemFilter } from "../../background/types"
import { TextInput, BottomContent, MenuEntry } from "../components/menu";
import { setup_types } from "../../background/setupTypes";

export let SearchLimit = 30;

export interface DataTypesProps {
}

// todo add one ability to make OR filter
export function useDataTypes(q: string, filterF?: ItemFilter<DataTypeInterface>): DataTypeInterface[] {

    const [query, setQuery] = useState<string>("");
    const [items, setItems] = useState<DataTypeInterface[]>([]);
    const [filter, setFilter] = useState<ItemFilter<DataTypeInterface> | undefined>(filterF);

    useEffect(() => {
        setQuery(q);
    }, [q])

    useEffect(() => {
        setFilter(filterF)
    }, [filterF])

    function loadTypes(q: string, filterFunc?: ItemFilter<DataTypeInterface>) {
        findDatatypes(q, SearchLimit, filterFunc).then((items) => {
            setItems(items);
        });
    }

    useEffect(() => {
        loadTypes(query);
    }, [query])

    return items;
}

export function DataTypes(props: DataTypesProps) {

    const { setRoute, setSlideRoute } = useExtensionContext();

    const [query, setQuery] = useState<string>("");
    const items = useDataTypes(query);

    useEffect(() => {
        setup_types().then((setup) => {
            if (setup) {
                setQuery("tok");
            }
        });
    }, [])

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
            placeholder="search type by name"
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