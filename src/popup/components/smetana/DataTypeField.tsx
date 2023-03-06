import { HTMLChakraProps, Text } from "@chakra-ui/react";
import { DataTypeField } from "../../../background/types/DataTypeField";
import { MenuItemBasicElement } from "../menu/MenuItemBasicElement";

export interface DataTypeFieldProps extends HTMLChakraProps<'div'> {
    item: DataTypeField
}

export function DataTypeField(props: DataTypeFieldProps) {

    const { item, ...rest } = props;

    return <MenuItemBasicElement borderRadius={"6px"} {...rest}>
        <Text>{item.label}</Text>
    </MenuItemBasicElement>
}