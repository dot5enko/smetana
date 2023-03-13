import { ActionButton, ActionButtonProps, Label, MenuEntry, MenuEntryProps } from "."

interface MenuEntryWithSublabelProps extends ActionButtonProps {
    text?: string
}

export function MenuEntryWithSublabel(props: MenuEntryWithSublabelProps) {

    const { text, children, ...rest } = props;

    return <ActionButton {...rest}>
        {children}
        {text ? <Label fontSize="xs">{text}</Label> : null}
    </ActionButton >
}