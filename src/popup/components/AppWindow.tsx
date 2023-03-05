import { Box, Flex, HTMLChakraProps, MenuItemProps } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { MenuEntry, MenuEntryProps } from "./MenuEntry";

export interface WindowProps extends HTMLChakraProps<'div'> {
    config: AppWindowConfig
}

export enum MenuEntryType {
    Label,
    Submenu,
    Action,
    Select,
    TextInput
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
}

export function AppWindow(props: WindowProps) {

    let { children, ...rest } = props

    const [activeWindow, setActiveWindow] = useState<AppWindowConfig>(props.config);

    const content = useMemo(() => {

        let items = [];

        for (let menuItem of activeWindow.entries) {

            let menuEntryParams: MenuEntryProps = {}

            switch (menuItem.type) {
                case MenuEntryType.Action: {
                    menuEntryParams.onClick = menuItem._config;
                } break;
                case MenuEntryType.Submenu: {
                    menuEntryParams.submenu = true;
                } break;
                default: {
                    console.warn(`unable to handle menu item type: ${menuItem.type}`);
                }
            }

            items.push(<MenuEntry {...menuEntryParams}>{menuItem.label}</MenuEntry>)
        }

        return items;

    }, [activeWindow]);

    /*
    <MenuItem>Actions</MenuItem>
    <MenuItem highlighted={true} submenu={true}>Addresses</MenuItem>
    <MenuItem>Settings</MenuItem>
*/

    return <Flex width="100%" {...rest} direction="column" gap="5px">
        {content}
    </Flex>
}