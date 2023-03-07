import { useEffect, useState } from "react";
import { ActionButton } from "../components/menu/ActionButton";
import { MenuDivider } from "../components/menu/MenuDivider";
import { SwitchInput } from "../components/menu/SwitchInput";
import { TextInput } from "../components/menu/TextInput";
import { BorshTypeSelect } from "../components/smetana/BorshTypeSelect";
import { Group } from "../components/menu/Group";
import { DataTypeField, getFieldsById, removeTypeField, updateDatatypeField } from "../../background/types/DataTypeField";
import { useExtensionContext } from "../components/context/ExtensionContext";

export interface EditTypeFieldProps {
    id: any
}

export function EditTypeField(props: EditTypeFieldProps) {

    const { routeBack } = useExtensionContext();

    const [object, setObject] = useState<DataTypeField | undefined>(undefined)
    const [changesCount, setChangesCount] = useState(0);

    useEffect(() => {
        if (props.id != undefined) {
            getFieldsById(props.id).then((item) => {
                setObject(item);
                setChangesCount(changesCount + 1)
            }).catch(e => {
                console.error('unable to get data type field :', props.id, e.message)
            });
        }
    }, [props.id])

    useEffect(() => {
        if (changesCount > 0) {
            updateDatatypeField(props.id, object).catch(e => console.error('unable to update field config'))
            console.log('alter db object', object)
        }
    }, [changesCount, props.id])


    function changeObject(handler: { (obj: DataTypeField): void }) {
        if (object !== undefined) {

            // is it passed by reference?
            handler(object)

            setObject(object)
            setChangesCount(changesCount + 1)
        }
    }

    return <>
        <TextInput
            placeholder={"property name"}
            value={object?.label}
            onChange={(name: string) => {
                changeObject(it => it.label = name)
            }} />
        <SwitchInput value={object?.optional} onChange={(val) => {
            changeObject(it => it.optional = val)
        }}
        // sublabel="whether this field is optional in structure or not"
        >Is optional</SwitchInput>

        <Group name="property type">
            <SwitchInput value={object?.is_complex_type} onChange={(val) => {
                changeObject(it => it.is_complex_type = val)
            }}>Complex type</SwitchInput>

            {!object?.is_complex_type ?
                <BorshTypeSelect value={object?.field_type as string} onChange={(type: string[]) => {
                    changeObject(it => it.field_type = type[0])
                }}></BorshTypeSelect> :
                <ActionButton actionVariant="warning" action={function (): void {
                    throw new Error("Function not implemented.");
                }} >not supported yet :(</ActionButton>}
        </Group>
        <MenuDivider height={10} width={0} />
        <Group name="danger zone">
            <ActionButton actionVariant="error" action={() => {
                if (confirm("do you really want to remove this item?")) {
                    removeTypeField(props.id).then(() => {
                        routeBack();
                    }).catch(e => {
                        console.error('unable to remove field', e.message)
                    })
                }
            }} textAlign="center">Remove</ActionButton>
        </Group>

    </>
}