import { Flex, HTMLChakraProps } from "@chakra-ui/react";
import { InjectProps } from "./InjectProps";

export function MultipleItemsRow(props: HTMLChakraProps<'div'>) {

    const { children, ...rest } = props;

    return <Flex gap="5px" {...rest}>
        <InjectProps flexShrink="1">{children}</InjectProps>
    </Flex>
}