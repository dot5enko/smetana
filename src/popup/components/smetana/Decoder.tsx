import { Box } from "@chakra-ui/react";
import { DataType } from "../../../background/types";
import { Label } from "../menu";

export function Decoder(props: { it: DataType, datasize: number }) {

    const matchSize = props.datasize === props.it.info.size_bytes;

    return <Box>
        {matchSize ?
            <Label fontSize="xs" color="green.400">matched by size</Label> :
            <Label fontSize="xs" color="orange.400">type size is not equal to data size</Label>
        }
        <Label fontWeight="bold" color={"white"}>{props.it.label}</Label>
        <Label fontSize="sm"><strong>{props.it.info.size_bytes}</strong> bytes, {props.it.info.fields_count} fields</Label>
    </Box>
}