import { useEffect, useState } from "react";
import { ActionButton, If, ItemSelector, MenuEntry, ScrolledItem, Sublabel, SwitchInput, TextInput } from "../components/menu";
import { minutesReadable } from "../slide";
import { Text } from "@chakra-ui/react"
import { getWatchedByAddressId, getWatchedById, updateWatched, WatchedAddress } from "../../background/types";
import { toast } from "react-toastify";

export interface EditWatchedAddressProps {
    id?: number
}

export function EditWatchedAddress(props: EditWatchedAddressProps) {

    const { id, ...rest } = props;

    const values = [1, 5, 10, 30, 60, 360, 12 * 60];

    const [object, setObject] = useState<WatchedAddress | undefined>(undefined);

    // todo show error
    const [err, setErr] = useState<string | undefined>(undefined);

    function fetchObject(keyval: number) {
        setErr(undefined);
        getWatchedById(keyval).then((obj) => {
            setObject(obj)
        }).catch(e => {
            setErr('unable to get an object by id :' + e.message)
        });
    }

    useEffect(() => {
        if (id != undefined) {
            fetchObject(id)
        } else {
            setChangesCount(0);
        }
    }, [id])


    const [changesCount, setChangesCount] = useState(0);
    useEffect(() => {
        if (changesCount > 0) {
            updateWatched(id as number, object).catch(e => {
                toast('unable to update type:' + e.message)
            })
        }
    }, [changesCount, id])

    function changeObject(handler: { (obj: WatchedAddress): void }, unprotect?: boolean) {
        if (object !== undefined) {
            handler(object)

            setObject(object)
            setChangesCount(changesCount + 1)
        }
    }

    return <>
        <If condition={id}>
            <TextInput
                value={object?.label}
                placeholder="label for this address"
                onChange={(nval) => { changeObject(it => it.label = nval) }}
            />
            <Sublabel textAlign="left">Track interval</Sublabel>
            <ItemSelector
                sizeVariant="xs"
                options={values}
                value={[object?.sync_interval as number]}
                elementRenderer={(it) => {
                    return <>
                        <Text>{minutesReadable(it)}</Text>
                    </>
                }}
                onSelectorValueChange={(newVal) => {
                    changeObject(it => it.sync_interval = newVal[0])
                }}
            />
            <SwitchInput value={object?.paused == 1} onChange={(val) => {
                changeObject(it => it.paused = val ? 1 : 0)
            }}
            >Pause</SwitchInput>

            <MenuEntry submenu="data_insight_configuration" args={[id]} >Configure data insights</MenuEntry>
            <MenuEntry submenu="address_data_history" args={[id]} >Data fetch history</MenuEntry>
        </If>
        <If condition={err}>
            <ActionButton>{err}</ActionButton>
        </If>
    </>

}