import { ActionButton, If, ItemSelector, MenuEntry, Sublabel, SwitchInput, TextInput } from "../components/menu";
import { minutesReadable } from "../slide";
import { Text } from "@chakra-ui/react"
import { useObjectState } from "../components/context/objectState";
import { WatchedAddressHandler } from "../../background";

export interface EditWatchedAddressProps {
    id?: number
}

export function EditWatchedAddress(props: EditWatchedAddressProps) {

    const { id, ...rest } = props;

    const values = [1, 5, 10, 30, 60, 360, 12 * 60];

    const { object, err, changeObject } = useObjectState(WatchedAddressHandler, id);

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
            <MenuEntry submenu="address_data_history" args={[object?.address_id]} >Data fetch history</MenuEntry>
        </If>
        <If condition={err}>
            <ActionButton>{err}</ActionButton>
        </If>
    </>

}