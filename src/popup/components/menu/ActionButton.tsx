import { background, HTMLChakraProps } from "@chakra-ui/react";
import { useMemo } from "react";
import { MenuItemBasicElement } from "./MenuItemBasicElement";
import { Sublabel } from "./Sublabel";

export interface ActionButtonProps extends HTMLChakraProps<'div'> {
    actionVariant?: ActionButtonVariant
    action(): void
    sublabel?: string
}

export type ActionButtonVariant = 'warning' | 'default' | 'success' | 'error' | 'info'

interface ActionButtonVariantStyle {
    hover: {
        backgroundColor: string,
        color: string
    },
    style: {
        backgroundColor: string,
        color: string
    }

}

export function ActionButton(props: ActionButtonProps) {

    const { children, action, actionVariant, sublabel, ...rest } = props;

    const { hover, style }: ActionButtonVariantStyle = useMemo(() => {

        let result: ActionButtonVariantStyle = {
            hover: {
                backgroundColor: "",
                color: "white"
            },
            style: {
                backgroundColor: "",
                color: "white"
            }
        }

        switch (actionVariant) {

            case 'error':
                result.style.backgroundColor = "#ec404b";
                result.hover.backgroundColor = "#E81A27";

                break;
            case 'warning':

                result.style.backgroundColor = "#ff570a";
                result.hover.backgroundColor = "#E34800";
                break;
            case 'success':
                result.style.backgroundColor = "#788D04"
                result.hover.backgroundColor = "#647503";

                break;
            case 'info':
                result.style.backgroundColor = "#428dff"
                result.hover.backgroundColor = "#1472FF";
                break;

            default: {
                result.style.backgroundColor = "#2f4351"
                result.hover.backgroundColor = "#283945";
            } break;
        }

        return result;
    }, [actionVariant])

    return <>
        <MenuItemBasicElement
            onClick={() => action()}
            textAlign="center"
            borderRadius="6px"
            {...rest} {...style} _hover={{ ...hover }}>
            {children}
        </MenuItemBasicElement>
        {props.sublabel ? <Sublabel value={props.sublabel} /> : null}
    </>
}