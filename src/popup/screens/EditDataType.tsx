import { Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { DataType as DataTypeInterface, getById, updateDatatype } from "../../background/types/DataType";
import { createNewField, DataTypeField as DataTypeFieldInterface, getFieldsForType } from "../../background/types/DataTypeField";
import { useExtensionContext } from "../components/context/ExtensionContext";

import { ActionButton } from "../components/menu/ActionButton";
import { Group } from "../components/menu/Group";
import { MenuDivider } from "../components/menu/MenuDivider";
import { TextInput } from "../components/menu/TextInput";
import { DataTypeField } from "../components/smetana/DataTypeField";

export interface EditDataTypeProps {
    id: any
}

export function EditDataType(props: EditDataTypeProps) {

    const [items, setItems] = useState<DataTypeFieldInterface[]>([]);
    const [label, setLabelValue] = useState<string | undefined>(undefined);

    const { setRoute } = useExtensionContext();

    // update object
    useEffect(() => {
        if (props.id !== undefined && label != null) {
            updateDatatype(props.id, {
                label: label
            })
        }
    }, [label, props.id])

    useEffect(() => {
        if (props.id != undefined) {
            getFieldsForType(props.id).then((items) => {
                setItems(items);
            }).catch(e => {
                console.error('unable to get fields by type :', props.id, e.message)
            });

            getById(props.id).then((obj) => {
                setLabelValue(obj.label)
                console.log('got an object', obj)
            }).catch(e => {
                console.error('unable to get an object by id :', props.id)
            });
        }
    }, [props.id])

    return <>
        <TextInput placeholder="label" sublabel="this is what you'll see in explorer" value={label} onChange={(newVal) => {
            setLabelValue(newVal);
        }} />
        <>
            {items.map((it, idx) => {
                return <DataTypeField key={idx} item={it} onClick={() => {
                    setRoute("edit_typefield", it.id);
                }} />
            })}
        </>
        <ActionButton actionVariant="info" action={function (): void {
            createNewField(props.id).then(id => {
                // todo use consts
                setRoute("edit_typefield", id);
            })
        }}>Add field</ActionButton>

        <MenuDivider width={0} height={15} />
        <Group name={"danger zone"}>
            <ActionButton actionVariant="error" action={() => {
                if (confirm("really delete")) {

                }
            }}>Delete type</ActionButton>
        </Group>
    </>
}