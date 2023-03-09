import { Box, Text } from "@chakra-ui/react";
import { ActionButton } from "../../components/menu/ActionButton";
import { MultipleItemsRow } from "../../components/menu/MultipleitemsRow";
import { Sublabel } from "../../components/menu/Sublabel";

export function Confirm() {
    return <><Box textAlign="center" padding="20px">
        <Text fontSize="xl">Remove item?</Text>
        <Sublabel>This action could not be undone</Sublabel>
    </Box>
        <MultipleItemsRow>
            <ActionButton sizeVariant="sm" colorVariant="warning" action={function (): void {
                throw new Error("Function not implemented.");
            }} >Confirm</ActionButton>
            <ActionButton sizeVariant="sm" action={() => { }} >Cancel</ActionButton>
        </MultipleItemsRow>
    </>
}