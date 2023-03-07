import { Box, Skeleton, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { RawAccountInfo } from "../../background/types/RawAccountinfo";
import { getAddressInfo } from "../../background/rpc";
import { useExtensionContext } from "../components/context/ExtensionContext";
import { Group } from "../components/menu/Group";
import { MenuEntry } from "../components/menu/MenuEntry";
import { Sublabel } from "../components/menu/Sublabel";
import { TextInput } from "../components/menu/TextInput";
import { addrFormat } from "../components/smetana/helpers";
import { MultipleItemsRow } from "../components/menu/MultipleitemsRow";
import { MenuDivider } from "../components/menu/MenuDivider";
import { ActionButton } from "../components/menu/ActionButton";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

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

    useEffect(() => {
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
                }
            }).catch(e => {
                setFound(false);
                console.error('unable to fetch address info : ', e.message)
            }).finally(() => {
                setLoading(false)
            })
        }
    }, [validAddr, connection])

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
        {raw && !loading ?
            (!found ? <ActionButton action={() => { }} >
                <Text>Account not found</Text>
                <Sublabel>Either account address is invalid or account not exists</Sublabel>
            </ActionButton> :
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
                </>)
            // </Group> 
            : <>
                <Skeleton width={"100%"} height="100px"></Skeleton>
                <MenuDivider width={0} />
                <Skeleton width={"100%"} height="65px"></Skeleton>
            </>
        }
    </>
}