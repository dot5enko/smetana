import { Box, Input } from "@chakra-ui/react";
import { PublicKey } from "@solana/web3.js";
import { useEffect, useState } from "react";
import { Sublabel } from "./Sublabel";

export interface TextInputProps {
    sublabel?: string,
    value?: string
    onChange?(val: string): void
    placeholder?: string
    validate?: InputType
    onValidChange?(valid: boolean, val: string): void
    invalidTypeLabel?: string
}

export type InputType = 'publicKey' | 'any'

function validateFormat(val: string, typ: InputType): boolean {

    switch (typ) {
        case 'publicKey': {
            try {
                new PublicKey(val);
                return true;
            } catch (e: any) {
                return false;
            }
        } break;
        default:
            return true;
    }

}

export function TextInput<T>(props: TextInputProps) {

    const [valid, setValid] = useState(true);

    function checkValueValid(val: any): boolean {
        if (props.validate) {
            if (!validateFormat(val, props.validate)) {
                if (props.onValidChange) {
                    props.onValidChange(false, val)
                }
                setValid(false);
                return false;
            } else {
                if (props.onValidChange) {
                    props.onValidChange(true, val)
                }
                setValid(true);
                return true;
            }
        }
        return true;
    }

    useEffect(() => {
        if (props.value != undefined) {
            checkValueValid(props.value)
        }
    }, [props.value])

    return <>
        <Box position="relative">
            <Input width="100%" minHeight="55px" value={props.value} placeholder={props.placeholder} onChange={(e) => {
                const newVal = e.target.value;
                if (props.onChange) {
                    props.onChange(newVal)
                }
            }} />
            {!valid && props.invalidTypeLabel ?
                <Sublabel position={"absolute"} top="0" left="0" color="red.400">{props.invalidTypeLabel}</Sublabel> :
                (props.value ? <Sublabel position={"absolute"} top="-1px" left="2px" color="blue.400">{props.placeholder}</Sublabel> : null)
            }
        </Box>
        {props.sublabel ? <Sublabel>{props.sublabel}</Sublabel> : null}
    </>
}