import { Box, Flex, Link, Text } from "@chakra-ui/react"
import { useExtensionContext, useSlideRouteArg } from "./components/context/ExtensionContext";
import { ActionButton, MenuEntry, SlideRoute, MenuDivider } from "./components/menu";
import { createNew } from "../background/types/DataType";
import { ImportTypesFromIdl, TrackNewAddressOptions, RpcConfig, Config, Confirm } from "./slide";

export function SlideRoutes() {

    const { setRoute, hideSlide } = useExtensionContext();

    return <>
        <SlideRoute path="confirm">
            <Confirm
                action={useSlideRouteArg(0)}
                label={useSlideRouteArg(1)}
                sublabel={useSlideRouteArg(2)}
            />
        </SlideRoute>
        <SlideRoute path="rpc_config">
            <RpcConfig />
        </SlideRoute>
        <SlideRoute path="config">
            <Config />
        </SlideRoute>
        <SlideRoute path="track_address_options">
            <TrackNewAddressOptions action={useSlideRouteArg(0)} />
        </SlideRoute>
        <SlideRoute path="import_json_idl">
            <ImportTypesFromIdl />
        </SlideRoute>
        <SlideRoute path="new_type">
            <ActionButton
                colorVariant="success"
                action={() => {
                    hideSlide();
                    setRoute('import_anchor_type', "Anchor idl import", true)
                }}>Import idl.json</ActionButton>
            <MenuEntry
                colorVariant="info"
                onClick={() => {
                    createNew(false).then((id) => {
                        hideSlide();
                        setRoute('edit_datatype', "Create new type", false, id as number)
                    }).catch((e: any) => {
                        console.error('unable to create new type:', e.message)
                    });
                }}
            >Create manually</MenuEntry>
        </SlideRoute>
        <SlideRoute path="about">
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
                    <MenuDivider />
                    <Box fontSize="sm" marginTop="20px">
                        <Text>solana account data insights made it easy</Text>
                        <Text fontSize="xs"><Link href="https://twitter.com/fwnd18"><strong>@fwnd18</strong></Link>, 2023,  <Link href="https://github.com/dot5enko/smetana" >source code</Link></Text>
                    </Box>
                </Box>
                <MenuDivider width={0} />
            </Flex>
        </SlideRoute>
    </>
}