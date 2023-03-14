import { Box, Flex, HTMLChakraProps, Icon, Spacer } from "@chakra-ui/react";
import { useEffect } from "react";
import { MdKeyboardArrowRight } from "react-icons/md";
import { DataType as DataTypeInterface } from "../../../background/types/DataType";
import { Label } from "../menu";
import { MenuItemBasicElement } from "../menu/MenuItemBasicElement";

export interface DataTypeProps extends HTMLChakraProps<'div'> {
    item: DataTypeInterface
}

export function DataType(props: DataTypeProps) {

    const { item, ...rest } = props;

    useEffect(() => {
        if (item.id) {
            // count references
        }
    }, [item.id])

    return <MenuItemBasicElement borderRadius={"6px"} {...rest}>
        <Flex gap="5px">
            <Box>
                {/* <Label fontSize={"xs"} color="green.400">{item.program_id}</Label> */}
                <Label fontWeight="bold" color={"white"}>{item.label}</Label>
                <Label fontSize={"xs"}>{item.info.fields_count} fields, total <strong>{item.info.size_bytes}</strong> bytes</Label>
            </Box>
            <Spacer />
            <Box alignSelf="center">
                <Icon as={MdKeyboardArrowRight} />
            </Box>
        </Flex>
    </MenuItemBasicElement>
}