import { HTMLChakraProps, Text } from "@chakra-ui/react";
import { DataType as DataTypeInterface } from "../../../background/types/DataType";
import { MenuItemBasicElement } from "../menu/MenuItemBasicElement";

export interface DataTypeProps extends HTMLChakraProps<'div'> {
    item: DataTypeInterface
}

export function DataType(props: DataTypeProps) {

    const { item, ...rest } = props;

    return <MenuItemBasicElement borderRadius={"6px"} {...rest}>
        <Text>{item.label}</Text>
    </MenuItemBasicElement>
}