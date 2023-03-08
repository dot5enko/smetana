import { Box, Input } from "@chakra-ui/react";
import { PublicKey } from "@solana/web3.js";
import { useEffect, useMemo, useState } from "react";
import { getSizeVariant } from "./EntryVariantStyle";
import { BasicEntryProps } from "./MenuItemBasicElement";
import { Sublabel } from "./Sublabel";

export interface TextInputProps extends BasicEntryProps {
    sublabel?: string,
    value?: string
    onChange?(val: string): void
    placeholder?: string
    validate?: InputType
    onValidChange?(valid: boolean, val: string): void
    invalidTypeLabel?: string
}

export type InputType = 'publicKey' | 'any' | 'int' | 'uint+'

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
        case 'uint+': {
            try {
                let parsed = parseInt(val);

                if (parsed <= 0) {
                    return false;
                }

                return "" + parsed === val;

            } catch (e: any) {
                return false;
            }
        }
        case 'int': {
            try {
                let parsed = parseInt(val);
                return "" + parsed === val;

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
        if (props.validate && props.value != undefined) {
            checkValueValid(props.value)
        }
    }, [props.value, props.validate])

    const sizeVariantProps = useMemo(() => {
        return getSizeVariant(props.sizeVariant);
    }, [props.sizeVariant])


    return <>
        <Box position="relative">
            {props.value != undefined ?
                <Input width="100%" {...sizeVariantProps} value={props.value} placeholder={props.placeholder} onChange={(e) => {
                    const newVal = e.target.value;
                    if (props.onChange) {
                        props.onChange(newVal)
                    }
                }} /> :
                // input and undefined value hotfix :)
                <Box width="100%" {...sizeVariantProps}></Box>
            }
            {!valid && props.invalidTypeLabel ?
                <Sublabel position={"absolute"} top="0" left="0" color="red.400">{props.invalidTypeLabel}</Sublabel> :
                (props.value ? <Sublabel position={"absolute"} top="-1px" left="2px" color="blue.400">{props.placeholder}</Sublabel> : null)
            }
        </Box>
        {props.sublabel ? <Sublabel>{props.sublabel}</Sublabel> : null}
    </>
}