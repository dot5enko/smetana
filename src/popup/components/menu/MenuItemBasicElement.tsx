import { Box, HTMLChakraProps } from "@chakra-ui/react";

export interface MenuItemBasicElementProps extends HTMLChakraProps<'div'> {

}

export function MenuItemBasicElement(props: MenuItemBasicElementProps) {

    let { children, ...rest } = props

    return <Box

        width="100%"
        padding="10px 20px"
        backgroundColor="#363A46"
        minHeight="55px"
        cursor="pointer"
        transition="all .2s ease"
        color={"whiteAlpha.600"}

        justifyContent="center"
        display="flex"
        flexDirection="column"

        _hover={{
            backgroundColor: "#1E2027",
            color: "whiteAlpha.900"
        }}

        {...rest}
    >{children}</Box>
}