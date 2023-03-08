import { Box } from "@chakra-ui/react";

export function BottomContent(props: { children?: any }) {

    const { children } = props;

    return <Box position="absolute" bottom="0" width="100%">
        {children}
    </Box>

}