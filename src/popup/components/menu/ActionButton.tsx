import { background, HTMLChakraProps } from "@chakra-ui/react";
import { useMemo } from "react";
import { EntryVariant, EntryVariantStyle, getVariantStyle } from "./EntryVariantStyle";
import { MenuItemBasicElement } from "./MenuItemBasicElement";
import { Sublabel } from "./Sublabel";

export interface ActionButtonProps extends HTMLChakraProps<'div'> {
    actionVariant?: EntryVariant
    action?(): void
    sublabel?: string
}

export function ActionButton(props: ActionButtonProps) {

    const { children, action, actionVariant, sublabel, ...rest } = props;

    const { hover, style }: EntryVariantStyle = useMemo(() => {
        return getVariantStyle(actionVariant ?? 'default')
    }, [actionVariant])

    return <>
        <MenuItemBasicElement
            onClick={action}
            textAlign="center"
            borderRadius="6px"
            {...rest} {...style} _hover={{ ...hover }}>
            {children}
        </MenuItemBasicElement>
        {props.sublabel ? <Sublabel>{props.sublabel} </Sublabel> : null}
    </>
}