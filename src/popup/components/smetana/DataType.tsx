import { Box, Flex, HTMLChakraProps, Icon, Spacer, Text } from "@chakra-ui/react";
import { useMemo } from "react";
import { MdKeyboardArrowRight } from "react-icons/md";
import { DataType as DataTypeInterface } from "../../../background/types/DataType";
import { MenuItemBasicElement } from "../menu/MenuItemBasicElement";

export interface DataTypeProps extends HTMLChakraProps<'div'> {
    item: DataTypeInterface
}

export function DataType(props: DataTypeProps) {

    const { item, ...rest } = props;

    const fakeUsage = useMemo(() => {

        let min = 10;
        let max = 250;

        return Math.floor(Math.random() * (max - min) + min);
    }, [props.id])

    return <MenuItemBasicElement borderRadius={"6px"} {...rest}>
        <Flex>
            <Box>
                <Flex>
                    <Text fontWeight="bold" color={"white"}>{item.label}</Text>
                    {/* {item.optional ? <Text fontSize="xs" color="red">*</Text> : null} */}
                </Flex>
                <Text fontSize={"sm"} color="green.300">used by {fakeUsage} decoders</Text>
            </Box>
            <Spacer />
            <Box alignSelf="center">
                <Icon as={MdKeyboardArrowRight} />
            </Box>
        </Flex>
    </MenuItemBasicElement>
}