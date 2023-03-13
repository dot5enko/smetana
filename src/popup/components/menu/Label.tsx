import { HTMLChakraProps, Text } from "@chakra-ui/react";

export interface LabelProps extends HTMLChakraProps<'div'> {

}

export function Label(props: LabelProps) {

    const { children, ...rest } = props;

    return <Text {...rest}>{children}</Text>
}