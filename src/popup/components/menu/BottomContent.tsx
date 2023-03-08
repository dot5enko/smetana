import { Box } from "@chakra-ui/react";

export function BottomContent(props: { children?: any }) {

    const { children } = props;

    return <Box
        position="absolute"
        left="0"
        bottom="0"
        right="0"
    >
        <Box padding="10px">
            {children}
        </Box>
    </Box>

}