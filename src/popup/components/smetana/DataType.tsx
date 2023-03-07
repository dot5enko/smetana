import { Box, Flex, HTMLChakraProps, Icon, Spacer, Text } from "@chakra-ui/react";
import { MdKeyboardArrowRight } from "react-icons/md";
import { DataType as DataTypeInterface, DataTypeAggregatedInfo } from "../../../background/types/DataType";
import { MenuItemBasicElement } from "../menu/MenuItemBasicElement";
import { Sublabel } from "../menu/Sublabel";
import { addrFormat } from "./helpers";

export interface DataTypeProps extends HTMLChakraProps<'div'> {
    item: DataTypeInterface
}

export function DataType(props: DataTypeProps) {

    const { item, ...rest } = props;

    return <MenuItemBasicElement borderRadius={"6px"} {...rest}>
        <Flex gap="5px">
            <Box>
                <Flex gap="5px">
                    <Text fontWeight="bold" color={"white"}>{item.label}</Text>
                    <Spacer />
                    <Text textAlign={"center"} color="blue.400" marginRight="15px">used {item.info.used_by} times</Text>
                </Flex>
                <Text fontSize={"xs"} color="green.300">ProgramId: {addrFormat(item.program_id, 5)}</Text>
                <Text fontSize={"xs"}>{item.info.fields_count} fields, total <strong>{item.info.size_bytes}</strong> bytes</Text>
            </Box>
            <Spacer />
            <Box alignSelf="center">
                <Icon as={MdKeyboardArrowRight} />
            </Box>
        </Flex>
    </MenuItemBasicElement>
}