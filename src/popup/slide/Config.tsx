import { MenuEntry } from "../components/menu/MenuEntry";
import { Text } from "@chakra-ui/react"
import { useExtensionContext } from "../components/context/ExtensionContext";

export function Config() {

    const { rpc } = useExtensionContext();

    return <>
        <MenuEntry isSlidePath={true} submenu="rpc_config" submenuTitle="Network RPC">
            <strong>Network RPC</strong>
            <Text size={"xs"} color="gray.600">{rpc}</Text>
        </MenuEntry>
        <MenuEntry isSlidePath={true} submenu="lang_config">
            Language
        </MenuEntry>
    </>
}