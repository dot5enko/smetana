import { Box, Flex, HTMLChakraProps, keyframes, Spacer, Icon, Text } from "@chakra-ui/react";
import { MdKeyboardBackspace } from "react-icons/md";
import { DataTypes } from "../screens/DataTypes";
import { EditDataType } from "../screens/EditDataType";
import { EditTypeField } from "../screens/EditTypeField";
import { RpcConfig } from "../screens/RpcConfig";
import { ExtensionContextProvider, useExtensionContext, useRouteArg } from "./context/ExtensionContext";
import { MenuDivider } from "./menu/MenuDivider";
import { MenuEntry } from "./menu/MenuEntry";
import { MenuEntryType } from "./menu/MenuEntryType";
import { Route } from "./Router";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SlideWindow } from "./menu/SlideWindow";
import { Addresses } from "../screens/Addresses";
import { TextInput } from "./menu/TextInput";
import { TrackNewAddress } from "../screens/TrackNewAddress";
import { ImportIdl } from "../screens/ImportIdl";
import { If } from "./menu/If";

export interface WindowProps extends HTMLChakraProps<'div'> {
    // config: AppWindowConfig
}

export interface AppMenuEntry {
    type: MenuEntryType,
    children?: AppWindowConfig,
    label: string
    _config: any
}

export interface AppWindowConfig {
    title: string
    entries: AppMenuEntry[]
    parent?: AppWindowConfig
}

const AnimationDuration = 150;

const fademove = keyframes`
    50% {
        transform: translateX(5px);
        opacity: 0;
    }
    100% {
        transform: translateX(0px);
        opacity: 1;
    }
`

function AppWindowInner(props: { children: any }) {

    const { slideActive, hasBack, routeBack, rpc, route: { footerContent: footer, title } } = useExtensionContext();

    return <Box
        width="360px"
        padding="10px"
        backgroundColor="#353535"
        position="relative"
        overflow="hidden"
    >
        <Flex direction="column" height="560px">
            <Box padding="5px 0px" height="55px">
                <Flex>
                    {hasBack ? <Box
                        cursor="pointer"
                        border="1px solid gray"
                        padding="10px 15px"
                        borderRadius="6px"
                        onClick={() => {
                            routeBack();
                        }}
                    ><Icon as={MdKeyboardBackspace} /></Box> : null}
                    <Flex alignItems="center" paddingLeft="20px">
                        <Text>{title}</Text>
                    </Flex>
                    <Spacer />
                </Flex>
            </Box>
            <Flex
                // flex="1"
                marginTop="5px"
                direction="column"
                gap="5px"
                overflowY="scroll"
                css={{
                    '&::-webkit-scrollbar': {
                        display: "none",
                    }
                }}
            >
                <Route path="">
                    <MenuEntry submenu="addresses">Favorites</MenuEntry>
                    <MenuEntry submenu="tags">Tags</MenuEntry>
                    <MenuEntry submenu="data_types" fixedFooter={true} >Data types</MenuEntry>
                    <MenuDivider width={0} />
                    <MenuEntry submenu="config">Settings</MenuEntry>
                    <AboutPage />
                </Route>
                <Route path="track_new_address">
                    <TrackNewAddress addr="3QwsnHqEo1pq45UbDfura4fmSaWXqbGQMNDbr6pV1G56" />
                </Route>
                <Route path="addresses">
                    <Addresses />
                </Route>
                <Route path="config">
                    <MenuEntry submenu="rpc_config" submenuTitle="Network RPC">
                        <strong>Network RPC</strong>
                        <Text size={"xs"} color="gray.600">{rpc}</Text>
                    </MenuEntry>
                    <MenuEntry submenu="lang_config">
                        Language
                    </MenuEntry>
                </Route>
                <Route path="import_anchor_type">
                    <ImportIdl />
                </Route>
                <Route path="data_types">
                    <DataTypes />
                </Route>
                <Route path="edit_datatype">
                    <EditDataType id={useRouteArg(0)} />
                </Route>
                <Route path="edit_typefield" >
                    <EditTypeField id={useRouteArg(0)} protected={useRouteArg(1, false)} />
                </Route>
                <Route path="rpc_config">
                    <RpcConfig />
                </Route>
            </Flex>
            <Spacer />
            <If condition={footer}>
                <Flex width="100%" minHeight="65px" padding="5px 0" />
            </If>
            <SlideWindow windowActive={slideActive} />
        </Flex>
    </Box >
}
function AboutPage() {
    const { toggleSlide } = useExtensionContext();
    return <MenuEntry onClick={toggleSlide} >About</MenuEntry>
}

export function AppWindow(props: WindowProps) {

    let { children, ...rest } = props;

    return <Box {...rest}>
        <ToastContainer position="top-center" limit={1} theme="dark" hideProgressBar={true} closeButton={false} />
        <ExtensionContextProvider>
            <AppWindowInner>{children}</AppWindowInner>
        </ExtensionContextProvider>
    </Box>
}