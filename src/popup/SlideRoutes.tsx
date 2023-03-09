import { Confirm } from "./slide/Confirm";
import { Box, Flex, Text } from "@chakra-ui/react"
import { useExtensionContext } from "./components/context/ExtensionContext";
import { SlideRoute } from "./components/menu/Router";
import { ActionButton } from "./components/menu/ActionButton";
import { MenuEntry } from "./components/menu/MenuEntry";
import { createNew } from "../background/types/DataType";

export function SlideRoutes() {

    const { setRoute, toggleSlide } = useExtensionContext();

    return <>
        <SlideRoute path="confirm">
            <Confirm />
        </SlideRoute>
        <SlideRoute path="new_type">
            <ActionButton
                colorVariant="success"
                action={() => {
                    setRoute('import_anchor_type', "Anchor idl import", true)
                }}>Import idl.json</ActionButton>
            <MenuEntry
                colorVariant="info"
                onClick={() => {
                    createNew(false).then((id) => {
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