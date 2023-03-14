import { Flex, Icon, Text } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { MdLink } from "react-icons/md";
import { DataTypeHandler } from "../../../background";
import { DecodeTypeResult, DecodedField, DataType } from "../../../background/types";
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

    const [typ, setTyp] = useState<DataType | undefined>();

    const referencedPk = useMemo(() => {

        if (field.field.label === "mint") {
            console.log('recalc type reference');
        }

        if (field.field.references_type && field.field.referenced_type_id) {

            DataTypeHandler.getById(field.field.referenced_type_id).then(val => setTyp(val))

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
            <Copyable value={field.decoded_value.toString()}>
                <Label color="green.400" fontSize="md">{field.decoded_value.toString()}</Label>
            </Copyable>
            <If condition={hasSubmenu}>
                <Flex color="blue.300" gap="5px">
                    <Label >
                        <Icon as={MdLink} /> to
                    </Label>
                    <Label fontWeight="bold">{typ?.label}</Label>
                </Flex>
            </If>
        </MenuEntry>
    </>
}