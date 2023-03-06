import { Box, Flex, Highlight, HTMLChakraProps, Icon, Spacer } from "@chakra-ui/react";
import { MdKeyboardArrowRight } from "react-icons/md";
import { useExtensionContext } from "../context/ExtensionContext";
import { MenuItemBasicElement } from "./MenuItemBasicElement";

export interface MenuEntryProps extends HTMLChakraProps<"div"> {
    submenu?: string,
    highlighted?: boolean
}

export function MenuEntry(props: MenuEntryProps) {

    let { children, submenu, ...rest } = props

    const { setRoute } = useExtensionContext();

    const clickAction = submenu ? () => {
        setRoute(submenu as string);
    } : props.onClick;

    return <MenuItemBasicElement {...rest} onClick={clickAction} borderRadius="6px">
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
    </MenuItemBasicElement>
}