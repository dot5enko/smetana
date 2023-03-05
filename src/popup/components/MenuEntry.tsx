import { Box, Flex, HTMLChakraProps, Icon, Spacer } from "@chakra-ui/react";
import { MdKeyboardArrowRight } from "react-icons/md";
import { AppMenuEntry, AppWindowConfig, MenuEntryType } from "./AppWindow";

export interface MenuEntryProps extends HTMLChakraProps<"div"> {
    submenu?: boolean
    highlighted?: boolean
}

export function MenuEntry(props: MenuEntryProps) {

    let { children, ...rest } = props

    return <Box

        width="100%"
        borderRadius="6px"
        padding="10px 20px"
        backgroundColor="#1E2027"
        height="55px"
        cursor="pointer"
        transition="all .2s ease"
        color={props.highlighted ? "white" : "whiteAlpha.600"}

        justifyContent="center"
        display="flex"
        flexDirection="column"

        _hover={{
            backgroundColor: "#363A46",
            color: "whiteAlpha.900"
        }}

        {...rest}
    >
        <Flex>
            <Box>
                {children}
            </Box>
            {props.submenu ? <>
                <Spacer />
                <Box>
                    <Icon as={MdKeyboardArrowRight} />
                </Box>
            </> : null}
        </Flex>
    </Box>
}

// todo make builder 
export function Action(label: string, action: { (): void }) {
    const menu: AppMenuEntry = {
        type: MenuEntryType.Action,
        label: label,
        _config: action,
    };

    return menu;
}

export function Submenu(label: string, subwindowTitle: string, ...subitems: AppMenuEntry[]) {

    const subwindow: AppWindowConfig = {
        title: subwindowTitle,
        entries: subitems
    }

    const menu: AppMenuEntry = {
        type: MenuEntryType.Submenu,
        label: label,
        _config: null,
        children: subwindow
    };

    return menu;

}