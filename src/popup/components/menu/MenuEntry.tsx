import { Box, Flex, HTMLChakraProps, Icon, Spacer } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { MdKeyboardArrowRight } from "react-icons/md";
import { useExtensionContext } from "../context/ExtensionContext";
import { EntryVariant, getVariantStyle } from "./EntryVariantStyle";
import { MenuItemBasicElement } from "./MenuItemBasicElement";

export interface MenuEntryProps extends HTMLChakraProps<"div"> {
    submenu?: string,
    submenuTitle?: string
    entryVariant?: EntryVariant
}

export function MenuEntry(props: MenuEntryProps) {

    let { children, submenu, submenuTitle, entryVariant, ...rest } = props

    const [title, setTitle] = useState<string>("");

    const variantStyle = useMemo(() => {
        return getVariantStyle(entryVariant ?? 'default');
    }, [entryVariant])

    useEffect(() => {
        if (submenu) {
            if (submenuTitle === undefined) {
                if (typeof children === 'string') {
                    submenuTitle = children as string;
                } else {
                    console.error('no submenuTitle prop provided, nor child is string type')
                }
            } else {
                setTitle(submenuTitle)
            }
        }
    }, [submenuTitle, submenu])

    const { setRoute } = useExtensionContext();

    const clickAction = submenu ? () => {
        setRoute(submenu as string, title);
    } : props.onClick;

    return <MenuItemBasicElement
        onClick={clickAction}
        borderRadius="6px"
        {...variantStyle.style}
        _hover={{ ...variantStyle.hover }}
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
    </MenuItemBasicElement>
}