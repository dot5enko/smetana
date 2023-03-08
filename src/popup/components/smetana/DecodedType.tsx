import { Flex, Text } from "@chakra-ui/react";
import { delay } from "framer-motion";
import { toast } from "react-toastify";
import { DecodeTypeResult } from "src/background/types/DataType";
import { DecodedField } from "src/background/types/DecodedField";
import { MenuEntry } from "../menu/MenuEntry";
import { MenuEntryWithSublabel } from "../menu/MenuEntryWithSublabel";

export function DecodedType(props: { item: DecodeTypeResult }) {
    return <Flex gap="5px" direction="column">
        {props.item.fields.filter((it) => !it.field.hide).map((it, idx) => {
            return <DecodedField key={idx} field={it} />
        })}
        {props.item.partial ? <>
            <MenuEntryWithSublabel text="not all fields decoded. you seeing all fields prior decode error">
                Partial result
            </MenuEntryWithSublabel>
        </> : null}
    </Flex>
}

function DecodedField(props: { field: DecodedField }) {

    const { field } = props;

    return <>
        <MenuEntry onClick={() => {
            navigator.clipboard.writeText(field.decoded_value.toString())
            toast('copied', {
                autoClose: 300
            })
        }}>
            <Text fontWeight="bold">{field.field.label}</Text>
            <Text color="green.400" fontSize="md">{field.decoded_value.toString()}</Text>
        </MenuEntry>
    </>
}