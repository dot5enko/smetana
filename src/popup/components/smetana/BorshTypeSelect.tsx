import { ItemSelector } from "../menu/ItemSelect";

const opts = [
    "bool",
    "string",
    "publicKey",
    "u8",
    "u16",
    "u32",
    "u64",
    "u128",
    "i8",
    "i16",
    "i32",
    "i64",
    "i128",
];

export function BorshTypeSelect(props: { value: string, onChange: { (val: string[]): void } }) {
    return <ItemSelector size="sm" options={opts} value={[props.value]} onSelectorValueChange={props.onChange}></ItemSelector >
}