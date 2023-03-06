import { Box } from "@chakra-ui/react";

export function ScrolledItem(props: { height?: number, children: any }) {
    if (props.height === undefined) {
        return props.children;
    } else {
        return <Box
            maxHeight={props.height + "px"}
            overflowY="scroll"
        >{props.children}</Box>
    }
}