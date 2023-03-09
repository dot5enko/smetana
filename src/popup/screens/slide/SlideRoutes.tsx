import { SlideRoute } from "../../components/Router";
import { Confirm } from "./Confirm";
import { Box, Flex, Text } from "@chakra-ui/react"
import { ActionButton } from "../../components/menu/ActionButton";
import { useExtensionContext } from "../../components/context/ExtensionContext";
import { MenuEntry } from "../../components/menu/MenuEntry";
import { createNew } from "../../../background/types/DataType";
import { PublicKey } from "@solana/web3.js";

export function SlideRoutes() {

    const { setRoute, toggleSlide } = useExtensionContext();


    async function genAnchorIdlAddr(program_id: PublicKey) {

        let program_signer = PublicKey.findProgramAddressSync([], program_id)[0];
        let seed = "anchor:idl"
        const result = await PublicKey.createWithSeed(program_signer, seed, program_id)
        console.log('got an address', result.toBase58())
    }

    return <>
        <SlideRoute path="confirm">
            <Confirm />
        </SlideRoute>
        <SlideRoute path="new_type">
            <ActionButton
                colorVariant="success"
                action={() => {
                    setRoute('import_anchor_type', "Anchor idl import", true)
                }}>Import andhor idl</ActionButton>
            <MenuEntry
                colorVariant="info"
                onClick={() => {

                    genAnchorIdlAddr(new PublicKey("1349iiGjWC7ZTbu6otFmJwztms122jEEnShKgpVnNewy"));

                    createNew().then((id) => {
                        toggleSlide("");
                        setRoute('edit_datatype', "Create new type", false, id as number)
                    }).catch((e: any) => {
                        console.error('unable to create new type:', e.message)
                    });
                }}
            >Create manually</MenuEntry>
        </SlideRoute>
        <SlideRoute path="">
            <Flex
                direction="column"
                justifyContent="center"
                alignContent="center"
                textAlign="center"
                height="100%"
                width="100%"
            >
                <Box justifySelf={"center"} alignSelf="center">
                    <Text fontSize={"2xl"} textTransform="uppercase">Smetana</Text>
                    <Box fontSize="sm" marginTop="20px">
                        <Text>solana account data explorer</Text>
                        <Text>made by <strong>dot5enko</strong></Text>
                        <Text fontSize="xs">2023</Text>
                    </Box>
                </Box>
            </Flex>
        </SlideRoute>
    </>
}