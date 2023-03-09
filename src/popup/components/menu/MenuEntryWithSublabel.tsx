import { ActionButton, ActionButtonProps,Sublabel } from "."

interface MenuEntryWithSublabelProps extends ActionButtonProps {
    text?: string
}

export function MenuEntryWithSublabel(props: MenuEntryWithSublabelProps) {

    const { text, children, ...rest } = props;

    return <ActionButton {...rest}>
        {children}
        {text ? <Sublabel>{text}</Sublabel> : null}
    </ActionButton >
}