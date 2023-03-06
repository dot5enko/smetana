import { Box, Flex, Spacer, Switch, Text } from "@chakra-ui/react";
import { MenuItemBasicElement } from "./MenuItemBasicElement";
import { Sublabel } from "./Sublabel";

export interface SwitchInputProps {
    children?: any,
    sublabel?: string,

    value: boolean
    onChange(val: boolean): void
}

export function SwitchInput(props: SwitchInputProps) {

    return <>
        <MenuItemBasicElement borderRadius="6px">
            <Flex width="100%">
                <Box>{props.children}</Box>
                <Spacer />
                <Switch colorScheme={"green"} isChecked={props.value} onChange={(event: any) => {
                    props.onChange(event.target.checked)
                }} />
            </Flex>
        </MenuItemBasicElement>
        {props.sublabel ? <Sublabel value={props.sublabel} /> : null}
    </>
}