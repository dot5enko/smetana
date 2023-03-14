import { Box, Skeleton, Text } from "@chakra-ui/react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { RawAccountInfo, DataType, DecodeTypeResult, fetchProgramIdl, datatypesForDiscriminator, datatypesForProgram, createNewWatchedAddress, getDataTypeForSync, getAddrId, getTypeToDecode, getSignleRawAccountInfo } from "../../background/types";
import { useExtensionContext } from "../components/context/ExtensionContext";
import { TextInput, ActionButton, Sublabel, MultipleItemsRow, MenuEntry, Group, BottomContent, ItemSelector, MenuDivider } from "../components/menu";
import { addrFormat, DecodedType } from "../components/smetana";
import { AddressHandler, decodeType as decodeTypeFunc } from "../../background"


export interface TrackNewAddressProps {
    addr?: string
}

export function TrackNewAddress(props: TrackNewAddressProps) {

    const { connection, setSlideRoute, hideSlide, setRoute } = useExtensionContext();

    const [addr, setAddr] = useState(props.addr ?? "");
    const [validAddr, setValid] = useState("");
    const [loading, setLoading] = useState(false);
    const [raw, setRaw] = useState<RawAccountInfo | undefined>(undefined);
    const [found, setFound] = useState(false);
    const [err, setErr] = useState<string | undefined>(undefined);

    useEffect(() => {

        setErr(undefined);
        setDecoded(undefined);
        setDecodeError(false);

        if (validAddr != "") {

            setLoading(true);

            getAddrId(validAddr).then(addrid => {

                return AddressHandler.getById(addrid).then((addrObj) => {

                    console.log(' addr object for ', validAddr, addrObj.address, addrObj)

                    return getSignleRawAccountInfo(connection, addrObj).then(rawaccount => {

                        setFound(true);
                        setRaw(rawaccount)

                        setLoading(false)
                    }).catch(e => {
                        setLoading(false)
                        setFound(false);
                        setRaw(undefined)
                        setErr(e.message)
                        console.error('unable to fetch address info : ', e.message)
                    })
                });
            });

        }
    }, [validAddr, connection])

    const [decodeType, setType] = useState<DataType | undefined>(undefined);
    const [types, setTypes] = useState<DataType[]>([])
    const [typesChanges, setTypesChanges] = useState(0);

    const [decodeError, setDecodeError] = useState<boolean>(false);
    const [decoded, setDecoded] = useState<DecodeTypeResult | undefined>(undefined);

    useEffect(() => {
        if (decodeType != undefined) {

            setDecodeError(false);

            getDataTypeForSync(decodeType).then(fulltype => {

                let decoded = decodeTypeFunc(raw?.data as Uint8Array, fulltype);
                try {
                    if (decoded.partial && decoded.fields.length == 0) {
                        setDecodeError(true);
                    } else {
                        setDecoded(decoded);
                    }
                } catch (e: any) {
                    console.warn('unable to decode data : ', e)
                    toast('unable to decode data: ' + e.message);
                    setDecodeError(true);
                }
            })
        }
    }, [decodeType])

    useEffect(() => {

        function cleanTypes() {
            setType(undefined);
            setTypes([]);
            setTypesChanges(typesChanges + 1)
        }

        if (raw != undefined) {

            fetchProgramIdl(connection, raw.owner).then((programFetchState) => {
                let discriminant = raw.data.slice(0, 8)

                datatypesForDiscriminator(discriminant).then(types => {
                    if (types.length == 0) {
                        datatypesForProgram(raw.owner, "", 50).
                            then((types: DataType[]) => {
                                setTypes(types);
                                setTypesChanges(typesChanges + 1);
                            }).catch((e: any) => {
                                cleanTypes()
                                console.error('unable to fetch datatypes for program', e.message)
                            })
                    } else {

                        setType(types[0]);

                        console.log('found codec by discriminant !, count = ', types.length, types[0]);
                    }
                })
            }).catch((e: any) => {
                cleanTypes()
            })
        } else {
            cleanTypes()
        }
    }, [raw])

    return <>
        <TextInput
            value={addr}
            invalidTypeLabel="pubkey in base58 format required"
            placeholder="address to track"
            validate="publicKey"
            onChange={(nval) => { setAddr(nval) }}
            onValidChange={(valid, validVal) => {
                if (valid) {
                    setValid(validVal);
                }
            }}
        />
        {loading ? <>
            <Skeleton width={"100%"} height="100px" borderRadius="6px"></Skeleton>
            <MenuDivider width={0} />
            <Skeleton width={"100%"} height="65px" borderRadius="6px"></Skeleton>
        </> :
            (!found ? <ActionButton action={() => { }} >
                <Text>Unable to get account data</Text>
                <Sublabel>{err ? "RPC error, try again later or change RPC server in settings" : "Either account address is invalid or account not exists"}</Sublabel>
            </ActionButton> :
                (raw ?
                    // <Group name="info fetched">
                    <>
                        <MultipleItemsRow>
                            <MenuEntry>
                                <Text color="green.400">{raw.data.length}</Text>
                                <Text fontSize="xs">size bytes</Text>
                            </MenuEntry>
                            <MenuEntry >
                                <Text color="green.400">{Math.round((raw.lamports / LAMPORTS_PER_SOL) * 1000) / 1000}</Text>
                                <Text fontSize="xs">sol balance</Text>
                            </MenuEntry>
                            <MenuEntry>
                                <Text color="green.400">{addrFormat(raw.owner, 5)}</Text>
                                <Text fontSize="xs">owned by program</Text>
                            </MenuEntry>
                        </MultipleItemsRow>

                        {decoded ? <>
                            <MenuDivider width={0} height={10} />
                            <Group name="decoded">
                                <DecodedType item={decoded} ></DecodedType>
                            </Group>
                        </> : null}

                        <BottomContent>
                            <ActionButton colorVariant="info" action={() => {
                                if (decodeType) {
                                    setSlideRoute("track_address_options", (label: string, fetchinterval: number) => {

                                        createNewWatchedAddress(
                                            validAddr,
                                            decodeType?.id as number,
                                            fetchinterval,
                                            label).then(() => {
                                                // todo move routes to config
                                                setRoute("addresses", "Addresses", true)
                                            }).finally(() => {
                                                hideSlide();
                                            })
                                    })
                                }
                            }}>
                                <Text>Track</Text>
                                {!decodeType ? <Sublabel >select type decoder first</Sublabel> : null}
                            </ActionButton>
                        </BottomContent>
                        {/* <MenuDivider width={0} /> */}
                        <ItemSelector label="Select compatible decoder for data" onSelectorValueChange={(nval) => {
                            setType(nval[0])
                        }} value={[decodeType]} options={types} elementRenderer={(it) => {
                            return <Decoder it={it as DataType} datasize={raw.data.length} />
                        }}></ItemSelector>
                    </> : null))}

    </>
}

function Decoder(props: { it: DataType, datasize: number }) {

    const matchSize = props.datasize === props.it.info.size_bytes;

    return <Box>
        {matchSize ?
            <Text fontSize="xs" color="green.400">matched by size</Text> :
            <Text fontSize="xs" color="orange.400">type size is not equal to data size</Text>
        }
        <Text fontWeight="bold" color={"white"}>{props.it.label}</Text>
        <Text fontSize="sm"><strong>{props.it.info.size_bytes}</strong> bytes, {props.it.info.fields_count} fields</Text>
    </Box>
}