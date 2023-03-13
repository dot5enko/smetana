import { Box, HTMLChakraProps } from "@chakra-ui/react";
import { useMemo } from "react";
import { ColorVariantStyle, ColorVariantType, getSizeVariant, getVariantStyle, SizeVariantType } from "./EntryVariantStyle";

export interface BasicEntryProps {
    sizeVariant?: SizeVariantType
    colorVariant?: ColorVariantType
    noHover?: boolean
}

export interface MenuItemBasicElementProps extends HTMLChakraProps<'div'>, BasicEntryProps {
}

export function MenuItemBasicElement(props: MenuItemBasicElementProps) {

    let { children, sizeVariant, colorVariant, flexShrink, noHover, ...rest } = props

    const sizeVariantProps = useMemo(() => {
        return getSizeVariant(sizeVariant);
    }, [sizeVariant])

    const { hover, style }: ColorVariantStyle = useMemo(() => {
        return getVariantStyle(colorVariant ?? 'default')
    }, [colorVariant])

    const shrink = flexShrink ?? "0"

    let hoverProps = noHover ? {} : hover;

    return <Box

        width="100%"
        cursor={noHover?"":"pointer"}
        transition="all .2s ease"

        justifyContent="center"
        display="flex"
        flexDirection="column"
        flexShrink={shrink}

        {...sizeVariantProps}
        {...style}

        _hover={{
            ...hoverProps
        }}

        {...rest}
    >{children}</Box>
}