import { Box, Flex, HTMLChakraProps, Text } from "@chakra-ui/react";
import { ScrolledItem } from "./ScrolledItem";

export interface GroupProps extends HTMLChakraProps<'div'> {
    name?: any
    maxContentHeight?: number
}

export function Group(props: GroupProps) {
    return <Box
        padding="10px 10px"
        paddingTop="5px"
        marginBottom="20px"

        border="1px solid #363A46"
        borderRadius="6px"
    >
        <Box>
            <Box marginBottom="10px">
                <Text fontSize={"sm"} textAlign="left">{props.name}</Text>
            </Box>
            <ScrolledItem height={props.maxContentHeight} >
                <Flex
                    direction="column"
                    gap="5px"
                >
                    {props.children}
                </Flex>
            </ScrolledItem>

        </Box>
    </Box >
}