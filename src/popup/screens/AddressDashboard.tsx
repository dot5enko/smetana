import { Skeleton } from "@chakra-ui/react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useEffect, useMemo, useState } from "react";
import { AddressData, AddressHandler, DataTypeHandler, decodeType, getLastHistoryEntryOrFetch, WatchedAddressHandler } from "../../background";
import { Address, createNewWatchedAddress, DataTypeSync, getAddrId, getDataTypeForSync, getTypeToDecode, WatchedAddress } from "../../background/types";
import { useExtensionContext } from "../components/context/ExtensionContext";
import { ActionButton, Group, If, Label, MenuDivider, MenuEntry, MultipleItemsRow, Sublabel, TextInput } from "../components/menu";
import { Copyable } from "../components/menu/Copyable";
import { addrFormat, DecodedType, WatchedAddress as WatchedAddressComponent, } from "../components/smetana";

export const ExpirySeconds: number = 5 * 60; // 5 minutes

export interface AddressDashboardProps {
    id?: string | number,
    type_id?: number
    explore?: boolean
}



export function AddressDashboard(props: AddressDashboardProps) {

    const { connection, setSlideRoute, setRoute, hideSlide } = useExtensionContext();

    const { id, type_id, explore } = props;

    const [objectId, setObjId] = useState(0);
    const [object, setObject] = useState<Address | undefined>();
    const [watched, setWatched] = useState<WatchedAddress | undefined>();
    const [lastData, setData] = useState<AddressData | undefined>();
    const [typ, setType] = useState<DataTypeSync | undefined>();

    const [noTypeFound, setNoTypeFound] = useState(false);
    const [loading, setLoading] = useState(true);

    const [decodeError, setDecodeError] = useState<string | undefined>()

    const [exploreInput, setInput] = useState("");

    useEffect(() => {
        if (id) {
            if (typeof id === 'number') {
                setObjId(id)
            } else {
                getAddrId(id).then(idval => setObjId(idval))
            }
        }
    }, [id])

    useEffect(() => {
        AddressHandler.getById(objectId).then(o => setObject(o))
        WatchedAddressHandler.getTable().get({ address_id: objectId }).then(w => setWatched(w))
    }, [objectId])

    const [programOwner, setProgramOwner] = useState("");

    const currentRep = useMemo(() => {
        if (!object) {
            return undefined;
        } else {

            const strlabel = (object.label != null && object.label != "") ? object.label : object.address;

            return <Label fontSize="sm" color={object.hasColor ? object.labelColor : "gray"}>{strlabel}</Label>
        }
    }, [object])


    useEffect(() => {
        if (object) {

            setLoading(true);

            getLastHistoryEntryOrFetch(connection, object, ExpirySeconds).then((it) => {
                setData(it);

                console.log('set last data to ', it)

                setLoading(false);
            }).catch((e: any) => {
                setDecodeError("unable to load account data: " + e.message)
                setLoading(false);
            })
        }
    }, [connection, object])


    useEffect(() => {

        function fallback() {

            setNoTypeFound(false);
            setLoading(true);

            let discriminatorBytes = undefined;

            if (lastData && lastData.data.length > 8) {
                discriminatorBytes = lastData?.data.slice(0, 8);
            }

            setNoTypeFound(false);

            getTypeToDecode(
                object as Address,
                true,
                discriminatorBytes,
                undefined,
                connection
            ).then((hasType) => {

                console.log('got type to decode result : ', hasType)

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

        if (object) {
            // at this point address has program owner, right ?
            AddressHandler.refresh(object).then(newAddr => {

                console.log('going to get address for program: ', newAddr.program_owner)

                AddressHandler.getById(newAddr.program_owner).then((owner) => {
                    setProgramOwner(owner.address);
                })
            });
        }

        if (type_id) {

            DataTypeHandler.getById(type_id).then((forceType) => {

                return getDataTypeForSync(forceType).then((syncType) => {
                    setType(syncType);
                    console.log("found forced type by route param");

                    setNoTypeFound(false);
                    setLoading(false);
                }).catch((e: any) => {

                    setNoTypeFound(true);
                    console.warn('unable to get referenced type, this shouldn"t happen: ' + e.message, e)

                    fallback()
                })
            })
        } else {
            fallback();
        }
    }, [lastData, type_id]);

    const decoded = useMemo(() => {

        if (typ && lastData) {

            console.log('decoding data with type ', typ?.typ.label, lastData?.data.length)

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

        <If condition={explore}>
            <TextInput
                value={exploreInput}
                invalidTypeLabel="pubkey in base58 format required"
                placeholder="address to explore"
                validate="publicKey"
                onChange={(nval) => { setInput(nval) }}
                onValidChange={(valid, validVal) => {
                    if (valid) {
                        getAddrId(validVal).then(idval => setObjId(idval))
                    }
                }}
            />
        </If>

        <If condition={object} >
            <MenuEntry submenu="basic_addr_edit" submenuTitle="address info edit" args={[objectId]} >
                Explorer presentation
                {currentRep}
            </MenuEntry>
        </If>

        <Copyable><Sublabel>{object?.address}</Sublabel></Copyable>
        {watched ?
            <WatchedAddressComponent item={watched as WatchedAddress} />
            : (object && typ ? <ActionButton colorVariant="info" action={() => {
                setSlideRoute("track_address_options", (label: string, fetchinterval: number) => {
                    createNewWatchedAddress(
                        object,
                        typ,
                        fetchinterval,
                        label).then(() => {
                            // todo move routes to config
                            setRoute("addresses", "Addresses", true)
                        }).finally(() => {
                            hideSlide();
                        })
                })
            }}>
                Watch this address
            </ActionButton> : null)
        }

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

        <If condition={lastData}>
            <MultipleItemsRow>
                <MenuEntry>
                    <Label color="green.400">{lastData?.data.length}</Label>
                    <Label fontSize="xs">size bytes</Label>
                </MenuEntry>
                <MenuEntry >
                    <Label color="green.400">{Math.round((lastData?.lamports as number / LAMPORTS_PER_SOL) * 1000) / 1000}</Label>
                    <Label fontSize="xs">sol balance</Label>
                </MenuEntry>
                <MenuEntry>
                    <Copyable value={programOwner}>
                        <Label color="green.400">{addrFormat(programOwner, 5)}</Label>
                        <Label fontSize="xs">owned by program</Label>
                    </Copyable>
                </MenuEntry>
            </MultipleItemsRow>
        </If>

        {noTypeFound ?
            <>
                <MenuDivider width={0} />
                <ActionButton>
                    No type found
                    <Label fontSize="xs">No worries, you still can try our <strong>smetana lab</strong> and decode address data by yourself!</Label>
                </ActionButton>
            </>
            :
            <If condition={object}>
                <MenuEntry submenu="addr_default_type" submenuTitle="change addr default type codec" args={[objectId]} >
                    Change address type
                    <Label fontSize="xs" color="green.300">
                        {typ?.typ.label}
                    </Label>
                </MenuEntry>
            </If >
        }
    </>
}