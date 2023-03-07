import { HTMLChakraProps, Text } from "@chakra-ui/react"

export interface SublabelProps extends HTMLChakraProps<'div'> {
}

export function Sublabel(props: SublabelProps) {

    let { children, ...rest } = props;

    return <Text
        padding="2px 15px"
        fontSize="xs"
        color="gray.200"
        {...rest}
    >{children}</Text>
}