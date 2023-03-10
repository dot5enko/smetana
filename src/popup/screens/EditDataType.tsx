import { Flex, HTMLChakraProps, Input, Skeleton } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { createNewField, DataTypeField as DataTypeFieldInterface, getFieldsForType, DataType as DataTypeInterface, getById, removeType, updateDatatype } from "../../background/types";
import { useExtensionContext } from "../components/context/ExtensionContext";
import { ActionButton, Group, If, Sublabel, SwitchInput, TextInput, MenuEntry, MultipleItemsRow } from "../components/menu";
import { DataTypeField } from "../components/smetana/DataTypeField";

import { Buffer } from "buffer"

export interface EditDataTypeProps {
    id: any
}
export interface HexEditorProps extends HTMLChakraProps<'div'> {
    bytes: number
    onValueChange(val: Uint8Array): void
    value: Uint8Array
}

function HexView(props: HexEditorProps) {

    const { value, onValueChange, bytes, gap, ...rest } = props;

    const content = useMemo(() => {

        const inputs = [];

        for (var i = 0; i < bytes; i++) {
            inputs.push(<Input key={i} {...rest} value={value[i]} onChange={(nval) => {
                const byteVal = parseInt(nval.target.value);

                if (byteVal > 255 || byteVal < 0) {
                    // console.log('erroneous input for byte ', i, ' value is ', nval, byteVal)
                } else {
                    console.log('value changed for byte', i, byteVal)
                    value[i] = byteVal;
                    onValueChange(value)
                }
            }} />)
        }

        return <Flex gap={gap}>
            {inputs}
        </Flex>
    }, [bytes, value])

    return content;
}

export function EditDataType(props: EditDataTypeProps) {

    const [items, setItems] = useState<DataTypeFieldInterface[]>([]);
    const [object, setObject] = useState<DataTypeInterface | undefined>(undefined);

    const { setRoute, routeBack, setSlideRoute, hideSlide } = useExtensionContext();

    const [orderEditable, setOrderEditable] = useState(false);

    function fetchFields() {
        getFieldsForType(props.id).then((items) => {
            setItems(items);
        }).catch(e => {
            console.error('unable to get fields by type :', props.id, e.message)
        });
    }

    function fetchObject() {
        getById(props.id).then((obj) => {
            setObject(obj)
        }).catch(e => {
            console.error('unable to get an object by id :', props.id)
        });
    }

    useEffect(() => {
        if (props.id != undefined) {
            fetchFields();
            fetchObject()
        }
    }, [props.id])

    const [changesCount, setChangesCount] = useState(0);
    useEffect(() => {
        if (changesCount > 0) {
            updateDatatype(props.id, object).catch(e => console.error('unable to update type', e.message))
        }
    }, [changesCount, props.id])

    function changeObject(handler: { (obj: DataTypeInterface): void }, unprotect?: boolean) {

        if (object !== undefined) {

            // allow if its unprotection

            if (object.protect_updates && !unprotect) {
                toast('updates protected!', { type: 'warning' });
            } else {
                // is it passed by reference?
                handler(object)

                setObject(object)
                setChangesCount(changesCount + 1)
            }
        }
    }

    return <>
        <TextInput placeholder="label" sublabel="this is what you'll see in explorer" value={object?.label} onChange={(newVal) => {
            changeObject(it => it.label = newVal)
        }} />
        <TextInput validate='publicKey' invalidTypeLabel="should be valid solana address" placeholder="program_id" sublabel="this type would only be applied to addresses owned by this program" value={object?.program_id} onChange={(newVal) => {
            changeObject(it => it.program_id = newVal)
        }} />

        <MultipleItemsRow>
            <SwitchInput value={object?.is_anchor} onChange={(val) => {
                changeObject(it => it.is_anchor = val)
            }}>Is anchor type</SwitchInput>
            <If condition={object?.is_anchor && object?.discriminator}>
                <MenuEntry sizeVariant="sm">
                    <>Discriminator: </>{object?.discriminator.toString()}
                </MenuEntry>
                {/* <Text>{Buffer.from(object?.discriminator as Uint8Array).toString("hex")}</Text> */}
                {/* <HexView value={object?.discriminator as Uint8Array} bytes={8} gap="5px" padding="2px" onValueChange={(val: Uint8Array) => {
                changeObject(it => it.discriminator = val)
            }} /> */}
            </If>
        </MultipleItemsRow>
        <Group name="structure">
            {items.map((it, idx) => {
                return <DataTypeField movable={orderEditable} onMoved={() => {
                    fetchFields();
                }} key={idx} item={it} onClick={() => {
                    if (!orderEditable) {
                        setRoute(
                            "edit_typefield",
                            "Edit " + object?.label + " property",
                            false,
                            it.id,
                            object?.protect_updates);
                    }
                }} />
            })}

            <If condition={!object?.protect_updates}>
                <ActionButton colorVariant="info" action={function (): void {
                    if (object?.protect_updates) {
                        toast("changes protected", { type: 'warning' })
                    } else {
                        createNewField(props.id).then(id => {
                            // todo use consts
                            setRoute(
                                "edit_typefield",
                                object?.label + " > new field",
                                false,
                                id
                            );
                        })
                    }
                }}>+ field</ActionButton>
            </If>
        </Group>
        <Group name={"danger zone"}>
            <ActionButton action={() => {
                changeObject(it => it.protect_updates = !it.protect_updates, true)
            }}>{object?.protect_updates ? "Unprotect changes" : "Protect"} {!object?.protect_updates ? <Sublabel>you won't able make any updates into structure while type is protected</Sublabel> : null}</ActionButton>
            <If condition={!object?.protect_updates}>
                <ActionButton colorVariant={orderEditable ? "success" : "default"} action={() => {
                    if (object?.protect_updates) {
                        toast("changes protected", { type: 'warning' })
                    } else {
                        setOrderEditable(!orderEditable);
                    }
                }}>{orderEditable ? "Exit edit mode" : "Change property order"}</ActionButton>
                <ActionButton colorVariant="error" action={() => {

                    setSlideRoute("confirm", () => {
                        hideSlide();
                        removeType(props.id).then(() => {
                            routeBack();
                        }).catch(e => {
                            console.error('unable to remove field:', e)
                        })
                    }, "really want to delete this item?");

                }}>Delete type</ActionButton>
            </If>
        </Group>
    </>
}