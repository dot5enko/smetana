import { Box, Flex, HTMLChakraProps, Text } from "@chakra-ui/react";
import { ScrolledItem } from "./ScrolledItem";

export interface GroupProps extends HTMLChakraProps<'div'> {
    name?: any
    maxContentHeight?: number
}

export function Group(props: GroupProps) {
    return <Box
        padding="10px 10px"
        paddingTop="1px"
        marginBottom="20px"

        border="1px solid #363A46"
        borderRadius="6px"
    >
        <Box>
            <Box marginBottom="5px">
                <Text marginLeft="6px" fontSize={"xs"} textAlign="left" color="blue.400">{props.name}</Text>
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