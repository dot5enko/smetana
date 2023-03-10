import { useEffect, useState } from "react";
import { MenuEntry, If, ActionButton, MenuDivider, SwitchInput, TextInput, Group, MultipleItemsRow } from "../components/menu";
import { BorshTypeSelect } from "../components/smetana/BorshTypeSelect";
import { DataTypeField, getFieldsById, getFieldSize, removeTypeField, updateDatatypeField } from "../../background/types/DataTypeField";
import { useExtensionContext } from "../components/context/ExtensionContext";
import { toast } from "react-toastify";

export interface EditTypeFieldProps {
    id: any
    protected?: boolean
}

export function EditTypeField(props: EditTypeFieldProps) {

    const { routeBack, setSlideRoute, hideSlide } = useExtensionContext();
    const [object, setObject] = useState<DataTypeField | undefined>(undefined)
    const [fieldSize, setFieldSize] = useState<number | undefined>(undefined);

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

    const [changesCount, setChangesCount] = useState(0);
    useEffect(() => {
        if (changesCount > 0) {
            updateDatatypeField(props.id, object).catch(e => console.error('unable to update field config', e))
        }
    }, [changesCount, props.id])

    const [arrSize, setArraySize] = useState<string | undefined>(undefined);

    useEffect(() => {
        setArraySize(object?.array_size + "")
    }, [object?.array_size])

    // recalc size
    useEffect(() => {
        if (object) {
            getFieldSize(object).then(resp => {
                setFieldSize(resp);
            }).catch(e => {
                setFieldSize(undefined);
            })
        } else {
            setFieldSize(undefined);
        }
    }, [object?.array_size, object?.field_type, object?.is_array, object?.optional, object?.is_complex_type])

    function changeObject(handler: { (obj: DataTypeField): void }) {
        if (props.protected) {
            toast('changes protected, unprotect first', { type: 'warning' })
        } else {
            if (object !== undefined) {

                // is it passed by reference?
                handler(object)

                setObject(object)
                setChangesCount(changesCount + 1)
            }
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
        >Is optional</SwitchInput>

        <SwitchInput value={object?.hide} onChange={(val) => {
            changeObject(it => it.hide = val)
        }}
        >Hide in view</SwitchInput>

        <Group name="property type">

            <If condition={fieldSize}>
                <MenuEntry sizeVariant="xs">
                    {fieldSize} bytes total
                </MenuEntry>
            </If>
            <MultipleItemsRow>
                <SwitchInput value={object?.is_array} onChange={(val) => {
                    changeObject(it => it.is_array = val)
                }}
                >Is Array</SwitchInput>
                <If condition={object?.is_array}>
                    <SwitchInput value={object?.is_dynamic_size} onChange={(val) => {
                        changeObject(it => it.is_dynamic_size = val)
                    }}>dynamic</SwitchInput>
                </If>
                <If condition={object?.is_array && !object.is_dynamic_size}>
                    <TextInput sizeVariant="sm"
                        value={arrSize + ""}
                        placeholder="size"
                        validate="uint+"
                        onChange={(val) => {
                            setArraySize(val);
                        }}
                        invalidTypeLabel="positive int"
                        onValidChange={(valid, val) => {
                            if (valid) {
                                changeObject(it => it.array_size = parseInt(val))
                            }
                        }} />
                </If>
            </MultipleItemsRow>

            <SwitchInput value={object?.is_complex_type} onChange={(val) => {
                changeObject(it => it.is_complex_type = val)
            }}>Complex type</SwitchInput>

            {!object?.is_complex_type ?
                <BorshTypeSelect value={object?.field_type as string} onChange={(type: string[]) => {
                    changeObject(it => it.field_type = type[0])
                }}></BorshTypeSelect> :
                <ActionButton colorVariant="warning" action={function (): void {
                    throw new Error("Function not implemented.");
                }} >not supported yet :(</ActionButton>}
        </Group>

        <MenuDivider height={10} width={0} />
        <Group name="danger zone">
            <ActionButton sizeVariant="sm" colorVariant="error" action={() => {

                setSlideRoute("confirm", () => {
                    hideSlide();
                    removeTypeField(props.id).then(() => {
                        routeBack();
                    }).catch(e => {
                        console.error('unable to remove field:', e)
                    })
                }, "do you really want to remove this item?");

            }} textAlign="center">Remove</ActionButton>
        </Group>

    </>
}