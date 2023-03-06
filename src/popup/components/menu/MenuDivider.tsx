import { Box, Flex } from "@chakra-ui/react";

export function MenuDivider(props: { height?: number, width?: number }) {

    let { height, width } = props;
    if (height == null) {
        height = 30;
    }
    if (width == null) {
        width = 90
    }

    let half = height / 2;

    return <Flex direction="row" justifyContent="center">
        <Box width={width + "%"} textAlign="center" margin={half + "px 0px"} height="1px" borderTop="1px solid #363A46"></Box>
    </Flex>
}