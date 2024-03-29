import { Box, Flex, HTMLChakraProps, Icon, Spacer } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { MdKeyboardArrowRight } from "react-icons/md";
import { useExtensionContext } from "../context/ExtensionContext";
import { BasicEntryProps, MenuItemBasicElement } from "./MenuItemBasicElement";

export interface MenuEntryProps extends HTMLChakraProps<"div">, BasicEntryProps {
    submenu?: string,
    submenuTitle?: string
    fixedFooter?: boolean
    isSlidePath?: boolean
    args: any[]
}

MenuEntry.defaultProps = {
    args: []
}

export function MenuEntry(props: MenuEntryProps) {

    let { children, submenu, submenuTitle, fixedFooter, onClick, isSlidePath, args, ...rest } = props

    const [title, setTitle] = useState<string>("");

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

    const { setRoute, setSlideRoute } = useExtensionContext();

    const clickAction = (e: any) => {

        e.stopPropagation();
        e.preventDefault();

        if (onClick) {
            onClick(e)
        }

        if (submenu) {
            const argsForSure = args as [];

            if (isSlidePath) {
                setSlideRoute(submenu as string, ...argsForSure)
            } else {
                setRoute(
                    submenu as string,
                    title,
                    fixedFooter ?? false,
                    ...argsForSure
                );
            }
        }
    };

    return <MenuItemBasicElement
        onClick={clickAction}
        borderRadius="6px"
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