import { Box, Flex, Highlight, HTMLChakraProps, Icon, Spacer } from "@chakra-ui/react";
import { MdKeyboardArrowRight } from "react-icons/md";
import { MenuItemBasicElement } from "./MenuItemBasicElement";

export interface MenuEntryProps extends HTMLChakraProps<"div"> {
    submenu?: boolean
    highlighted?: boolean
}

export function MenuEntry(props: MenuEntryProps) {

    let { children, ...rest } = props

    return <MenuItemBasicElement {...rest}  borderRadius="6px">
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