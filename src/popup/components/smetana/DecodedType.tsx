import { Flex, Text } from "@chakra-ui/react";
import { toast } from "react-toastify";
import { DecodeTypeResult } from "src/background/types/DataType";
import { DecodedField } from "src/background/types/DecodedField";
import { If } from "../menu/If";
import { MenuEntry } from "../menu/MenuEntry";
import { MenuEntryWithSublabel } from "../menu/MenuEntryWithSublabel";

export function DecodedType(props: { item: DecodeTypeResult }) {

    return <Flex gap="5px" direction="column">
        {props.item.fields.filter((it) => !it.field.hide).map((it, idx) => {
            return <DecodedFieldComponent key={idx} field={it} />
        })}
        {props.item.partial ? <>
            <MenuEntryWithSublabel text="not all fields decoded. you seeing all fields prior decode error">
                Partial result
            </MenuEntryWithSublabel>
        </> : null}
    </Flex>
}

function DecodedFieldComponent(props: { field: DecodedField }) {

    const { field } = props;

    if (field.field.field_type == 'bool') {
        return <>
            <MenuEntry >
                <Text fontWeight="bold">{field.field.label}</Text>
                <Text color="red.200">&lt;bool field parse error&gt;</Text>
            </MenuEntry>
        </>
    }

    return <>
        <MenuEntry onClick={() => {
            navigator.clipboard.writeText(field.decoded_value.toString())
            toast('copied', {
                autoClose: 300
            })
        }}>
            <Flex gap="5px">
                <Text fontWeight="bold">{field.field.label}</Text>
                <If condition={field.field.is_array}>
                    <Text color="blue.400">{field.decoded_value.length} elements</Text>
                </If>
            </Flex>
            <Text color="green.400" fontSize="md">{field.decoded_value.toString()}</Text>
        </MenuEntry>
    </>
}