import { Box, HTMLChakraProps, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useExtensionContext } from "../context/ExtensionContext";
import { ActionButton } from "./ActionButton";
import { If } from "./If";
import { MultipleItemsRow } from "./MultipleitemsRow";
import { Sublabel } from "./Sublabel";

export interface SlideWindowProps extends HTMLChakraProps<'div'> {
    windowActive: boolean
}

export function SlideWindow(props: SlideWindowProps) {

    const { windowActive, children, ...rest } = props;
    const { toggleSlide } = useExtensionContext();


    function dismiss() {

        setAnimate(false);

        setTimeout(() => {
            toggleSlide()
        }, 250);
    }

    // workaround to play animation
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setAnimate(windowActive)
        }, 5)
    }, [windowActive])

    return <If condition={windowActive}>
        <Box
            position="absolute"
            width="100%"
            height="100%"
            backgroundColor="gray"
            transition="all .3s ease"
            opacity={animate ? 0.5 : 0}
            top="0"
            left={0}
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
                opacity={0.98}
                justifySelf="center"
                alignSelf="center"
                width="95%"
                transition="all .3s cubic-bezier(.47,1.64,.41,.8)"

                marginBottom={animate ? "10px" : "-300px"}

                height={"200px"}

                boxShadow="md"

                borderRadius="6px"
                backgroundColor="#1E2027"
                padding="10px"
                {...rest}
                display="flex"
                flexDir="column"
                gap="10px"
            // marginBottom="10px"
            >
                <Box textAlign="center" padding="20px">
                    <Text fontSize="xl">Remove item?</Text>
                    <Sublabel>This action could not be undone</Sublabel>
                </Box>
                <MultipleItemsRow>
                    <ActionButton sizeVariant="sm" colorVariant="warning" action={function (): void {
                        throw new Error("Function not implemented.");
                    }} >Confirm</ActionButton>
                    <ActionButton sizeVariant="sm" action={dismiss} >Cancel</ActionButton>
                </MultipleItemsRow>
            </Box>
        </Box >
    </If>
}