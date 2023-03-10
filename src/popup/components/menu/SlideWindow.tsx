import { Box, HTMLChakraProps } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useExtensionContext } from "../context/ExtensionContext";
import { If } from "./If";

export interface SlideWindowProps extends HTMLChakraProps<'div'> {
    windowActive: boolean
}

export function SlideWindow(props: SlideWindowProps) {

    const { windowActive, children, ...rest } = props;
    const { hideSlide } = useExtensionContext();

    const [actualActive, setActive] = useState(false);

    useEffect(() => {

        if (!windowActive) {
            dismiss()
        } else {
            setActive(windowActive);
        }
    }, [windowActive])


    function dismiss() {

        setAnimate(false);

        setTimeout(() => {
            setActive(false);
            hideSlide();
        }, 250);
    }

    // workaround to play animation
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setAnimate(actualActive)
        }, 5)
    }, [actualActive])

    return <If condition={actualActive}>
        <Box
            position="absolute"
            width="100%"
            height="100%"
            // backgroundColor="gray"
            transition="all .3s ease"
            backdropFilter={animate ? "blur(10px)" : ""}
            top="0"
            left={0}
            onClick={dismiss}
        ></Box>
        <Box
            position={"absolute"}
            width="100%"
            display="flex"
            bottom="0"
            right="0"
            left="0"
            flexDirection="column"
            boxSizing="border-box"
        >
            <Box
                opacity={0.97}
                justifySelf="center"
                alignSelf="center"
                width="100%"
                transition="all .3s cubic-bezier(.47,1.64,.41,.8)"

                marginBottom={animate ? "0px" : "-300px"}

                boxShadow="md"

                borderTopRadius="20px"
                backgroundColor="#1E2027"
                {...rest}

                padding="20px"
                display="flex"
                flexDir="column"
                gap="10px"
            // marginBottom="10px"
            >
                {props.children}
            </Box>
        </Box >
    </If>
}