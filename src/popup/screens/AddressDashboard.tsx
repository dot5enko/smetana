import { Flex } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { AddressHandler, WatchedAddressHandler } from "../../background";
import { Address, getAddrId, WatchedAddress } from "../../background/types";
import { If, Label, MenuEntry, TextLabel } from "../components/menu";
import { WatchedAddress as WatchedAddressComponent, } from "../components/smetana";

export function AddressDashboard(props: { id: string | number }) {

    const { id } = props;

    const [objectId, setObjId] = useState(0);
    const [object, setObject] = useState<Address | undefined>();
    const [watched, setWatched] = useState<WatchedAddress | undefined>();

    useEffect(() => {
        if (typeof id === 'number') {
            setObjId(id)
        } else {
            getAddrId(id).then(idval => setObjId(idval))
        }
    }, [id])

    useEffect(() => {
        AddressHandler.getById(objectId).then(o => setObject(o))
        WatchedAddressHandler.getTable().get({ address_id: objectId }).then(w => setWatched(w))
    }, [objectId])

    const currentRep = useMemo(() => {
        if (!object) {
            return undefined;
        } else {
            const strlabel = object.label != "" ? object.label : object.address;

            return <Label color={object.hasColor ? object.labelColor : ""}>{strlabel}</Label>
        }
    }, [object])

    return <>
        <TextLabel sizeVariant="sm">{object?.address}</TextLabel>
        <MenuEntry submenu="basic_addr_edit" submenuTitle="address info edit" args={[id]} >
            Explorer presentation
            <Label fontSize="xs">{currentRep}</Label>
        </MenuEntry>
        <If condition={watched}>
            <WatchedAddressComponent item={watched as WatchedAddress} />
        </If>

    </>
}