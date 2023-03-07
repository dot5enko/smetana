import { Box, Flex, HTMLChakraProps } from "@chakra-ui/react";



export function MultipleItemsRow(props: HTMLChakraProps<'div'>) {

    const {children, ...rest} = props;

    return <Flex gap="5px" {...rest}>
        {children}
    </Flex>
}