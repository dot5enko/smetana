import { useEffect, useState } from "react";
import { MenuEntry, If, ActionButton, MenuDivider, SwitchInput, TextInput, Group, MultipleItemsRow, Label } from "../components/menu";
import { BorshTypeSelect } from "../components/smetana/BorshTypeSelect";
import { DataTypeFieldHandler, getFieldSize,DataType } from "../../background/types";
import { useExtensionContext } from "../components/context/ExtensionContext";
import { DataTypeHandler } from "../../background/database";
import { useObjectState } from "../components/context/objectState";
import { TypeSelectorSearchbox } from "../components/smetana/TypeSelectorSearchbox";

export interface EditTypeFieldProps {
    id: any
    protected?: boolean
}

export function EditTypeField(props: EditTypeFieldProps) {

    const { routeBack, setSlideRoute, hideSlide } = useExtensionContext();

    // todo pass is protected
    const { object, changeObject } = useObjectState(DataTypeFieldHandler, props.id, props.protected, "type is protected, unprotect first");

    const [referenedType,setReferencedType] = useState<DataType | undefined>();

    useEffect(() => {
        if (object?.referenced_type_id) {
            DataTypeHandler.getById(object.referenced_type_id).then( typ => {
                setReferencedType(typ);
            })
        }
    },[object?.referenced_type_id])


    const [arraySize, setArraySize] = useState<string | undefined>();

    useEffect(() => {
        if (object?.array_size) {
            setArraySize(object?.array_size + "");
        }
    }, [object?.array_size])


    const [fieldSize, setFieldSize] = useState<number | undefined>(undefined);

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

        <If condition={!object?.is_array && object?.field_type === "publicKey"}>
            <Group name="referenced value type">
                <SwitchInput value={object?.references_type} onChange={(val) => {
                    changeObject(it => it.references_type = val)
                }}
                >Referenced value type
                    <If condition={object?.references_type && object?.referenced_type_id}>
                        <Label color="green.300">{referenedType?.label}</Label>
                    </If>
                </SwitchInput>
                <If condition={object?.references_type}>
                    <TypeSelectorSearchbox placeholder="referemced type search query" value={object?.referenced_type_id} onSelectorValueChange={nval => {
                        changeObject(it => it.referenced_type_id = nval.id as number)
                    }} />
                </If>
            </Group>
        </If>

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
                        value={arraySize + ""}
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
                    DataTypeFieldHandler.remove(props.id).then(() => {
                        routeBack();
                    }).catch((e: any) => {
                        console.error('unable to remove field:', e)
                    })
                }, "do you really want to remove this item?");

            }} textAlign="center">Remove</ActionButton>
        </Group>

    </>
}