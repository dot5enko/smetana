import { Box, Flex, HTMLChakraProps, Icon, Spacer, Text } from "@chakra-ui/react";
import { MdKeyboardArrowRight } from "react-icons/md";
import { DataTypeField } from "../../../background/types/DataTypeField";
import { MenuItemBasicElement } from "../menu/MenuItemBasicElement";

export interface DataTypeFieldProps extends HTMLChakraProps<'div'> {
    item: DataTypeField
}

export function DataTypeField(props: DataTypeFieldProps) {

    const { item, ...rest } = props;

    return <MenuItemBasicElement borderRadius={"6px"} {...rest}>
        <Flex>
            <Box>
                <Flex>
                    <Text fontWeight="bold" color={"white"}>{item.label}</Text>
                    {item.optional ? <Text fontSize="xs" color="red">*</Text> : null}
                </Flex>
                <Text fontSize={"sm"} color="green.300">{item.field_type}</Text>
            </Box>
            <Spacer />
            <Box alignSelf="center">
                <Icon as={MdKeyboardArrowRight} />
            </Box>
        </Flex>
    </MenuItemBasicElement>
}