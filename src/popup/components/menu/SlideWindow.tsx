import { Box, HTMLChakraProps } from "@chakra-ui/react";

export interface SlideWindowProps extends HTMLChakraProps<'div'> {
    windowActive: boolean
}

export function SlideWindow(props: SlideWindowProps) {

    const { windowActive, children, ...rest } = props;

    return <Box {...rest}>
        {children}
    </Box>
}