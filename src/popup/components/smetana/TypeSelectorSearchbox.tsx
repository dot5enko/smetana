import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { DataTypeHandler } from "../../../background";
import { DataType } from "../../../background/types";
import { useDataTypes } from "../../screens";
import { ItemSelector, Label, ScrolledItem, TextInput } from "../menu";

export interface TypeSelectorSearchboxProps {
    onSelectorValueChange(val: DataType): void
    value?: number
}

export function TypeSelectorSearchbox(props: TypeSelectorSearchboxProps) {

    const { onSelectorValueChange, value, ...rest } = props;

    const [query, setQuery] = useState<string>("");
    const items = useDataTypes(query);

    const [valueTyp, setValueTyp] = useState<DataType | undefined>();
    const [innerValue, setInnerValue] = useState<number | undefined>();


    useEffect(() => {
        if (value && value != innerValue) {

            console.log('passed value is not equal to current, update type selected', value, innerValue)

            DataTypeHandler.getById(value).then(vt => {
                setValueTyp(vt)
                setInnerValue(value);

                console.log('type was selected : ',vt.label, 'inner value now ', vt)
            })
        }
    }, [value])


    return <>
        <TextInput
            sizeVariant="sm"
            placeholder="referemced type search query"
            value={query}
            onChange={(newVal) => {
                setQuery(newVal)
            }}></TextInput>
        <ScrolledItem height={200}>
            <ItemSelector
                onSelectorValueChange={(val) => {
                    const dt = val[0] as DataType;

                    // internal
                    setInnerValue(dt.id)
                    setValueTyp(dt);

                    // external notification
                    onSelectorValueChange(dt);
                }}
                sizeVariant="sm"
                options={items} value={[valueTyp]}
                elementRenderer={(it) => {
                    return <TypeCondensed item={it as DataType} />
                }}></ItemSelector>
        </ScrolledItem>
    </>
}

function TypeCondensed(props: { item: DataType }) {

    const { item } = props;

    return <Box>
        <Label fontSize={"xs"} fontWeight="bold" color={"white"}>{item.label}</Label>
        <Label fontSize={"xs"}>{item.info.fields_count} fields, total <strong>{item.info.size_bytes}</strong> bytes</Label>
    </Box>
}