import { ActionButton } from "./ActionButton";
import { BasicEntryProps } from "./MenuItemBasicElement";

export function TextLabel(props: { children: any } & BasicEntryProps) {

    const { children, ...rest } = props;

    return <ActionButton
        textAlign="left"
        noHover={true}

        {...rest}
    >{children}
    </ActionButton>
}