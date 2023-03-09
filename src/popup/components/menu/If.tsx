import { HTMLChakraProps } from "@chakra-ui/react";
import { InjectProps } from "./InjectProps";

export interface IfProps extends HTMLChakraProps<'div'> {
    condition?: any
}
// better readability
export function If(props: IfProps) {

    const { condition, children, flexShrink, ...rest } = props;

    if (props.condition) {
        return <InjectProps  {...rest} flexShrink={flexShrink} >
            {children}
        </InjectProps>
    } else {
        return null;
    }

}