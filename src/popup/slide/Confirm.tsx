import { Box, Text } from "@chakra-ui/react";
import { useExtensionContext } from "../components/context/ExtensionContext";
import { If } from "../components/menu";
import { ActionButton } from "../components/menu/ActionButton";
import { MultipleItemsRow } from "../components/menu/MultipleitemsRow";
import { Sublabel } from "../components/menu/Sublabel";

export interface ConfirmProps {
    action(): void
    label: string
    sublabel?: string
}

export function Confirm(props: ConfirmProps) {

    const { hideSlide } = useExtensionContext();

    const { action, label, sublabel } = props;

    return <><Box textAlign="center" padding="20px">
        <Text fontSize="xl">{label}</Text>
        <If condition={sublabel}>
            <Sublabel>{sublabel}</Sublabel>
        </If>
    </Box>
        <MultipleItemsRow>
            <ActionButton sizeVariant="sm" colorVariant="warning" action={() => {
                if (action) {
                    action()
                }
            }} >Confirm</ActionButton>
            <ActionButton sizeVariant="sm" action={hideSlide} >Cancel</ActionButton>
        </MultipleItemsRow>
    </>
}