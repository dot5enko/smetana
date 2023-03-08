import { useEffect, useState } from "react";
import { createNew, findDatatypes } from "../../background/types/DataType";
import { useExtensionContext } from "../components/context/ExtensionContext";
import { ActionButton } from "../components/menu/ActionButton";
import { DataType } from "../components/smetana/DataType";
import { DataType as DataTypeInterface } from "../../background/types/DataType"
import { TextInput } from "../components/menu/TextInput";
import { MultipleItemsRow } from "../components/menu/MultipleitemsRow";
import { BottomContent } from "../components/menu/BottomContent";
import { MenuEntry } from "../components/menu/MenuEntry";

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
        <BottomContent>
            <MultipleItemsRow>
                <MenuEntry
                    colorVariant="info"
                    submenu="adwad"
                    onClick={() => {
                        createNew().then((id) => {
                            setRoute('edit_datatype', "Create new type", false, id as number)
                        }).catch((e: any) => {
                            console.error('unable to create new type:', e.message)
                        });
                    }}>New type</MenuEntry>
                {/* <ActionButton
                    colorVariant="success"
                    action={() => {
                        setRoute('import_anchor_type', "Anchor idl import")
                    }}>Import idl</ActionButton> */}
            </MultipleItemsRow>
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