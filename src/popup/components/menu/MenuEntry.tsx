import { Box, Flex, Highlight, HTMLChakraProps, Icon, Spacer } from "@chakra-ui/react";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { MdKeyboardArrowRight } from "react-icons/md";
import { useExtensionContext } from "../context/ExtensionContext";
import { MenuItemBasicElement } from "./MenuItemBasicElement";

export interface MenuEntryProps extends HTMLChakraProps<"div"> {
    submenu?: string,
    submenuTitle?: string
    highlighted?: boolean
}

export function MenuEntry(props: MenuEntryProps) {

    let { children, submenu, submenuTitle, ...rest } = props

    const [title, setTitle] = useState<string>("");

    useEffect(() => {

        if (submenuTitle === undefined) {
            if (typeof children === 'string') {
                submenuTitle = children as string;
            } else {
                console.error('no submenuTitle prop provided, nor child is string type')
            }
        } else {
            setTitle(submenuTitle)
        }
    }, [submenuTitle])

    const { setRoute } = useExtensionContext();

    const clickAction = submenu ? () => {
        setRoute(submenu as string, title);
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