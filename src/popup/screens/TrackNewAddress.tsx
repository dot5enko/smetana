import { Box, Skeleton, Text } from "@chakra-ui/react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

import { useEffect, useState } from "react";
import { RawAccountInfo } from "../../background/types/RawAccountinfo";
import { getAddressInfo } from "../../background/rpc";
import { useExtensionContext } from "../components/context/ExtensionContext";
import { MenuEntry } from "../components/menu/MenuEntry";
import { Sublabel } from "../components/menu/Sublabel";
import { TextInput } from "../components/menu/TextInput";
import { addrFormat } from "../components/smetana/helpers";
import { MultipleItemsRow } from "../components/menu/MultipleitemsRow";
import { MenuDivider } from "../components/menu/MenuDivider";
import { ActionButton } from "../components/menu/ActionButton";
import { ItemSelector } from "../components/menu/ItemSelect";
import { DataType, datatypesForProgram } from "../../background/types/DataType";
import { Group } from "../components/menu/Group";
import { DataType as DataTypeComponent } from "../components/smetana/DataType";

export interface TrackNewAddressProps {
    addr?: string
}

export function TrackNewAddress(props: TrackNewAddressProps) {

    const { connection } = useExtensionContext();

    const [addr, setAddr] = useState(props.addr ?? "");
    const [validAddr, setValid] = useState("");
    const [loading, setLoading] = useState(false);
    const [raw, setRaw] = useState<RawAccountInfo | undefined>(undefined);
    const [found, setFound] = useState(false);
    const [err, setErr] = useState<string | undefined>(undefined);

    useEffect(() => {

        setErr(undefined);

        if (validAddr != "") {
            setLoading(true);
            getAddressInfo(validAddr, connection).then(resp => {
                if (resp.value != undefined) {

                    const rawaccount: RawAccountInfo = {
                        context_slot: resp.context.slot,
                        data: resp.value?.data,
                        executable: resp.value?.executable,
                        lamports: resp.value?.lamports,
                        owner: resp.value.owner.toBase58()
                    }

                    setFound(true);
                    setRaw(rawaccount)
                } else {
                    setFound(false);
                    setRaw(undefined)
                }
                setLoading(false)
            }).catch(e => {
                setLoading(false)
                setFound(false);
                setRaw(undefined)
                setErr(e.message)
                console.error('unable to fetch address info : ', e.message)
            })
        }
    }, [validAddr, connection])

    const [decodeType, setType] = useState<DataType | undefined>(undefined);
    const [types, setTypes] = useState<DataType[]>([])
    const [typesChanges, setTypesChanges] = useState(0);

    useEffect(() => {

        function cleanTypes() {
            setType(undefined);
            setTypes([]);
            setTypesChanges(typesChanges + 1)
        }

        if (raw != undefined) {
            // todo use config
            datatypesForProgram(raw.owner, "", 100).
                then((types: DataType[]) => {
                    setTypes(types);
                    setTypesChanges(typesChanges + 1);

                    console.log('set types : ', types)

                }).catch((e: any) => {
                    cleanTypes()
                    console.error('unable to fetch datatypes for program', e.message)

                })
        } else {
            cleanTypes()
        }
    }, [raw])

    // 

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
            <Skeleton width={"100%"} height="100px"></Skeleton>
            <MenuDivider width={0} />
            <Skeleton width={"100%"} height="65px"></Skeleton>
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
                        <MenuDivider width={0} />
                        <ActionButton actionVariant="info" action={() => { }}>
                            <Text>Track</Text>
                            {raw.data.length == 0 ? <Sublabel >Account has no data to track</Sublabel> : null}
                        </ActionButton>
                        <MenuDivider width={0} />

                        <ItemSelector label="Select compatible decoder for data" onSelectorValueChange={(nval) => {
                            setType(nval[0])
                        }} value={[decodeType]} options={types} elementRenderer={(it) => {
                            return <Decoder it={it as DataType} />
                        }}></ItemSelector>
                    </> : null))}
    </>
}

function Decoder(props: { it: DataType }) {
    return <Box>
        <Text fontWeight="bold" color={"white"}>{props.it.label}</Text>
        <Text fontSize="xs"><strong>{props.it.info.size_bytes}</strong> bytes, {props.it.info.fields_count} fields</Text>
    </Box>
}