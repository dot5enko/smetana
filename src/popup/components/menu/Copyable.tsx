import { Box } from "@chakra-ui/react";
import { useState } from "react";
import { Label } from "./Label";


export interface CopyableProps {
    children: any,
    copyLabel: string
}

Copyable.defaultProps = {
    copyLabel: "copied!"
}

export function Copyable(props: CopyableProps) {
    const [copied, setCopied] = useState(false);

    return <Box display="inline" onClick={(e: any) => {

        e.preventDefault()
        e.stopPropagation()

        console.log('trying to copy ...',props.children)

        navigator.clipboard.writeText(props.children)
        setCopied(true);
        setTimeout(() => {
            setCopied(false)
        }, 450)
    }}>
        {!copied ?
            (props.children) :
            <Label color="blue.400">{props.copyLabel}</Label>
        }
    </Box>
}