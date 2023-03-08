import { HTMLChakraProps } from "@chakra-ui/react";
import { BasicEntryProps, MenuItemBasicElement } from "./MenuItemBasicElement";
import { Sublabel } from "./Sublabel";

export interface ActionButtonProps extends HTMLChakraProps<'div'>, BasicEntryProps {

    action?(): void
    sublabel?: string
}

export function ActionButton(props: ActionButtonProps) {

    const { children, action, sublabel, ...rest } = props;

    return <>
        <MenuItemBasicElement
            onClick={action}
            textAlign="center"
            // todo move to border radius variant
            borderRadius="6px"
            {...rest}>
            {children}
        </MenuItemBasicElement>
        {props.sublabel ? <Sublabel>{props.sublabel} </Sublabel> : null}
    </>
}