import { HTMLChakraProps, Input, Text } from "@chakra-ui/react";
import { MenuEntry } from "./MenuEntry";
import { MenuItemBasicElement } from "./MenuItemBasicElement";
import { Sublabel } from "./Sublabel";

export interface TextInputProps {
    sublabel?: string,
    value?: string
    onChange(val: string): void
    placeholder?: string
}

export function TextInput(props: TextInputProps) {
    return <>
        <Input width="100" minHeight="55px" placeholder={props.placeholder} onChange={(e) => {
            props.onChange(e.target.value)
        }} />
        {props.sublabel ? <Sublabel value={props.sublabel} /> : null}
    </>
}