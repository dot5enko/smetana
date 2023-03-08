import { Box, HTMLChakraProps, Text } from "@chakra-ui/react";
import { ActionButton } from "./ActionButton";
import { MenuEntry } from "./MenuEntry";
import { MenuItemBasicElement } from "./MenuItemBasicElement";
import { MultipleItemsRow } from "./MultipleitemsRow";
import { Sublabel } from "./Sublabel";

export interface SlideWindowProps extends HTMLChakraProps<'div'> {
    windowActive: boolean
}

export function SlideWindow(props: SlideWindowProps) {

    const { windowActive, children, ...rest } = props;

    return <Box
        position={"absolute"}
        width="100%"
        display="flex"
        bottom="0"
        right="0"
        left="0"
        flexDirection="column"
        boxSizing="border-box"
    // paddingTop="20px"
    >
        <Box
            justifySelf="center"
            alignSelf="center"
            width="94%"
            transition="all .3s cubic-bezier(.47,1.64,.41,.8)"
            height={windowActive ? "200px" : "0px"}

            boxShadow="md"

            borderTopRadius="6px"
            backgroundColor="#1E2027"
            padding="10px"
            {...rest}
            display="flex"
            flexDir="column"
            gap="10px"
        >
            <MenuItemBasicElement textAlign="center" >
                <Text fontSize="xl">Remove item?</Text>
                <Sublabel>This action could not be undone</Sublabel>
            </MenuItemBasicElement>
            <MultipleItemsRow>
                <ActionButton colorVariant="warning" action={function (): void {
                    throw new Error("Function not implemented.");
                }} >Confirm</ActionButton>
                <ActionButton action={function (): void {
                    throw new Error("Function not implemented.");
                }} >Go Back</ActionButton>
            </MultipleItemsRow>
        </Box>
    </Box >

}