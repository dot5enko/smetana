import { Box, Flex, Spacer, Switch } from "@chakra-ui/react";
import { BasicEntryProps, InputGenericProps, MenuItemBasicElement, Sublabel } from ".";

export interface SwitchInputProps extends InputGenericProps<boolean>, BasicEntryProps {
    children?: any,
    sublabel?: string,
    flexShrink?: any
}

SwitchInput.defaultProps = {
    sizeVariant: "sm"
}

export function SwitchInput(props: SwitchInputProps) {

    return <>
        <MenuItemBasicElement borderRadius="6px" sizeVariant={props.sizeVariant} flexShrink={props.flexShrink}>
            <Flex width="100%">
                <Box>{props.children}</Box>
                <Spacer />
                <Switch colorScheme={"green"} isChecked={props.value} onChange={(event: any) => {
                    props.onChange(event.target.checked)
                }} />
            </Flex>
        </MenuItemBasicElement>
        {props.sublabel ? <Sublabel>{props.sublabel}</Sublabel> : null}
    </>
}