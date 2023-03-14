import { Skeleton } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { AddressData, AddressHandler, DataTypeHandler, decodeType, getLastHistoryEntryOrFetch, WatchedAddressHandler } from "../../background";
import { Address, DataTypeSync, getAddrId, getDataTypeForSync, getTypeToDecode, WatchedAddress } from "../../background/types";
import { useExtensionContext } from "../components/context/ExtensionContext";
import { ActionButton, Group, If, Label, MenuDivider, MenuEntry, Sublabel, TextLabel } from "../components/menu";
import { DecodedType, WatchedAddress as WatchedAddressComponent, } from "../components/smetana";

export const ExpirySeconds: number = 5 * 60; // 5 minutes

export interface AddressDashboardProps {
    id: string | number,
    type_id?: number
}

export function AddressDashboard(props: AddressDashboardProps) {

    const { connection } = useExtensionContext();

    const { id, type_id } = props;

    const [objectId, setObjId] = useState(0);
    const [object, setObject] = useState<Address | undefined>();
    const [watched, setWatched] = useState<WatchedAddress | undefined>();
    const [lastData, setData] = useState<AddressData | undefined>();
    const [typ, setType] = useState<DataTypeSync | undefined>();

    const [noTypeFound, setNoTypeFound] = useState(false);
    const [curState, setCurState] = useState<string>("");
    const [loading, setLoading] = useState(true);

    const [decodeError, setDecodeError] = useState<string | undefined>()

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

            const strlabel = (object.label != null && object.label != "") ? object.label : object.address;          

            return <Label color={object.hasColor ? object.labelColor : ""}>{strlabel}</Label>
        }
    }, [object])


    useEffect(() => {
        if (object) {

            setLoading(true);

            getLastHistoryEntryOrFetch(connection, object, ExpirySeconds).then((it) => {
                setData(it);
                setLoading(false);
            }).catch((e: any) => {
                setDecodeError("unable to load account data: " + e.message)
                setLoading(false);
            })
        }
    }, [connection, object])


    useEffect(() => {

        function fallback() {

            setLoading(true);

            let discriminatorBytes = undefined;

            if (lastData && lastData.data.length > 8) {
                discriminatorBytes = lastData?.data.slice(0, 8);
            }

            setNoTypeFound(false);

            getTypeToDecode(
                object as Address,
                true,
                discriminatorBytes
            ).then((hasType) => {
                
                setLoading(false);
                if (hasType.typ) {
                    setType(hasType.typ);
                } else {
                    setNoTypeFound(true);
                    
                }
            }).catch((e) => {
                setLoading(false);
            })
        }

        if (type_id) {

            DataTypeHandler.getById(type_id).then((forceType) => {

                return getDataTypeForSync(forceType).then((syncType) => {
                    setType(syncType);
                    setNoTypeFound(true);
                    setLoading(false);
                }).catch((e: any) => {

                    console.warn('unable to get referenced type, this shouldn"t happen: ' + e.message, e)

                    fallback()
                })
            })
        } else {
            fallback();
        }
    }, [lastData, type_id]);

    const decoded = useMemo(() => {

        console.log('decoding data with type ', typ?.typ.label, lastData?.data.length)

        if (typ && lastData) {
            setDecodeError(undefined);
            try {
                const decoded = decodeType(lastData?.data, typ)

                if (decoded.partial && decoded.fields.length == 0) {
                    setDecodeError("unable to decode even first field");
                    return undefined;
                } else {
                    return decoded;
                }
            } catch (e: any) {
                setDecodeError('unable to decode data : ' + e.message);
                return undefined;
            }

        } else {
            return undefined;
        }
    }, [typ, lastData])

    return <>
       
        <MenuEntry submenu="basic_addr_edit" submenuTitle="address info edit" args={[id]} >
            Explorer presentation
            {currentRep}
        </MenuEntry>
        <Sublabel>{object?.address}</Sublabel>
        
        <If condition={watched}>
            <WatchedAddressComponent item={watched as WatchedAddress} />
        </If>

        {loading ? <>
            <Skeleton width={"100%"} height="100px" borderRadius="6px"></Skeleton>
            <MenuDivider width={0} />
            <Skeleton width={"100%"} height="65px" borderRadius="6px"></Skeleton>
        </> : <>
            <If condition={decodeError}>
                <ActionButton>
                    <Label>Decode error</Label>
                    <Label fontSize="xs">{decodeError}</Label>
                </ActionButton>
            </If>

            {decoded ? <>
                <MenuDivider width={0} height={10} />
                <Group name="decoded">
                    <DecodedType item={decoded} ></DecodedType>
                </Group>
            </> : null}
        </>}
    </>
}