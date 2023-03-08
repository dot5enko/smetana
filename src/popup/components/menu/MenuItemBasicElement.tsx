import { Box, HTMLChakraProps } from "@chakra-ui/react";
import { useMemo } from "react";
import { ColorVariantStyle, ColorVariantType, getSizeVariant, getVariantStyle, SizeVariantType } from "./EntryVariantStyle";

export interface BasicEntryProps {
    sizeVariant?: SizeVariantType
    colorVariant?: ColorVariantType
}

export interface MenuItemBasicElementProps extends HTMLChakraProps<'div'>, BasicEntryProps {
}

export function MenuItemBasicElement(props: MenuItemBasicElementProps) {

    let { children, sizeVariant, colorVariant, ...rest } = props

    const sizeVariantProps = useMemo(() => {
        return getSizeVariant(sizeVariant);
    }, [sizeVariant])

    const { hover, style }: ColorVariantStyle = useMemo(() => {
        return getVariantStyle(colorVariant ?? 'default')
    }, [colorVariant])

    return <Box

        width="100%"
        cursor="pointer"
        transition="all .2s ease"

        justifyContent="center"
        display="flex"
        flexDirection="column"

        {...sizeVariantProps}
        {...style}

        _hover={{
            ...hover
        }}

        {...rest}
    >{children}</Box>
}