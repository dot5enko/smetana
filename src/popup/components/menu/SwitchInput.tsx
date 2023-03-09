import { Box, Flex, Spacer, Switch } from "@chakra-ui/react";
import { BasicEntryProps, MenuItemBasicElement,Sublabel } from ".";

export interface SwitchInputProps extends BasicEntryProps {
    children?: any,
    sublabel?: string,

    value?: boolean
    onChange(val: boolean): void
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
                    console.log('change event fired')
                    props.onChange(event.target.checked)
                }} />
            </Flex>
        </MenuItemBasicElement>
        {props.sublabel ? <Sublabel>{props.sublabel}</Sublabel> : null}
    </>
}