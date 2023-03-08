import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { DataType as DataTypeInterface, getById, removeType, updateDatatype } from "../../background/types/DataType";
import { createNewField, DataTypeField as DataTypeFieldInterface, getFieldsForType } from "../../background/types/DataTypeField";
import { useExtensionContext } from "../components/context/ExtensionContext";

import { ActionButton } from "../components/menu/ActionButton";
import { Group } from "../components/menu/Group";
import { If } from "../components/menu/If";
import { Sublabel } from "../components/menu/Sublabel";
import { TextInput } from "../components/menu/TextInput";
import { DataTypeField } from "../components/smetana/DataTypeField";

export interface EditDataTypeProps {
    id: any
}

export function EditDataType(props: EditDataTypeProps) {

    const [items, setItems] = useState<DataTypeFieldInterface[]>([]);
    const [object, setObject] = useState<DataTypeInterface | undefined>(undefined);

    const { setRoute, routeBack, toggleSlide } = useExtensionContext();

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
            console.log('got an object fetched', obj)
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
            console.log('alter db object', object)
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
        <Group name="structure">
            <>
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
            </>
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
                    if (confirm("really want to delete this item?")) {
                        removeType(props.id).then(() => {
                            routeBack();
                        }).catch(e => {
                            console.error('unable to remove field:', e)
                        })
                    }
                }}>Delete type</ActionButton>
            </If>
        </Group>
    </>
}