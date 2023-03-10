import { Box, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useExtensionContext } from "../components/context/ExtensionContext";
import { ActionButton } from "../components/menu/ActionButton";
import { MenuDivider } from "../components/menu/MenuDivider";
import { MultipleItemsRow } from "../components/menu/MultipleitemsRow";
import { Sublabel } from "../components/menu/Sublabel";
import { TextInput } from "../components/menu/TextInput";

export function ImportTypesFromIdl() {

    const { hideSlide, slideRoute : {args} } = useExtensionContext();

    const [addr, setAddr] = useState("");
    const [validAddr, setValid] = useState("");

    return <>
        <Box textAlign="center" padding="20px">
            <Text fontSize="xl">Import selected types</Text>
            <Sublabel>Provide program address this types refer to</Sublabel>
        </Box>
        <TextInput
            value={addr}
            invalidTypeLabel="pubkey in base58 format required"
            placeholder="program_id of uploaded idl"
            validate="publicKey"
            onChange={(nval) => { setAddr(nval) }}
            onValidChange={(valid, validVal) => {
                if (valid) {
                    setValid(validVal);
                }
            }}
        />
        <MenuDivider width={0} />
        <MultipleItemsRow>
            <ActionButton sizeVariant="sm" colorVariant="info" action={() => {
                if (args[0]) {
                    args[0]()
                }
            }} >Confirm</ActionButton>
            <ActionButton sizeVariant="sm" action={() => { hideSlide() }} >Cancel</ActionButton>
        </MultipleItemsRow>
        <MenuDivider width={0} />
    </>
}