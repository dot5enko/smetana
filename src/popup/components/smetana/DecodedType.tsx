import { Flex, Text } from "@chakra-ui/react";
import { useMemo } from "react";
import { DecodeTypeResult, DecodedField } from "../../../background/types";
import { Label } from "../menu";
import { Copyable } from "../menu/Copyable";
import { If } from "../menu/If";
import { MenuEntry } from "../menu/MenuEntry";
import { MenuEntryWithSublabel } from "../menu/MenuEntryWithSublabel";

export function DecodedType(props: { item: DecodeTypeResult }) {

    return <Flex gap="5px" direction="column">
        {props.item.fields.filter((it) => !it.field.hide && (!it.field.optional || it.present)).map((it, idx) => {
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

    const referencedPk = useMemo(() => {
        if (field.field.references_type) {
            return field.decoded_value.toBase58();
        } else {
            return "";
        }
    }, [field.field.referenced_type_id]);

    const hasSubmenu = field.field.references_type && field.field.referenced_type_id;

    return <>
        <MenuEntry submenu={hasSubmenu ? "addr_view" : ""} submenuTitle="referenced addr" args={[
            referencedPk,
            field.field.referenced_type_id
        ]}>
            <Flex gap="5px">
                <Text fontWeight="bold">{field.field.label}</Text>
                <If condition={field.field.is_array}>
                    <Text color="blue.400">{field.decoded_value.length} elements</Text>
                </If>
            </Flex>
            <Copyable>
                <Label color="green.400" fontSize="md">{field.decoded_value.toString()}</Label>
            </Copyable>
        </MenuEntry>
    </>
}