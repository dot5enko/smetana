import { HTMLChakraProps } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { AddressDataHandler } from "../../../background";
import { WatchedAddress as WatchedAddressInterface } from "../../../background/types"
import { Label, MenuEntry, minutesReadable } from "../menu";

export interface WatchedAddressProps extends HTMLChakraProps<'div'> {
    item: WatchedAddressInterface
}

export function WatchedAddress(props: WatchedAddressProps) {

    const { item, ...rest } = props;
    const [entries, setEntries] = useState(0);

    useEffect(() => {
        if (item?.id) {
            AddressDataHandler.getTable().where("address_id").equals(item.address_id).count().then(total_items => {
                setEntries(total_items);
            })
        } else {
            setEntries(0);
        }
    }, [item.id])

    return <MenuEntry
        borderRadius={"6px"}
        submenu="edit_watchedaddress"
        submenuTitle="Edit watched address"
        args={[item.id]} {...rest}
    >
        <Label fontWeight="bold" color={"white"}>{item.label}</Label>
        <Label fontSize={"xs"} color="blue.400">watch once in {minutesReadable(item.sync_interval)}. total entries :{entries} </Label>
    </MenuEntry>
}