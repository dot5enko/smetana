import { Box, Flex, Icon } from "@chakra-ui/react";
import { useState } from "react";
import { MdContentCopy as CopyIcon } from "react-icons/md";
import { If } from "./If";
import { Label } from "./Label";


export interface CopyableProps {
    children: any,
    copyLabel: string
    value?: string
    showIcon: boolean
}

Copyable.defaultProps = {
    copyLabel: "copied!",
    showIcon: false
}

// todo use absolute copy label 
export function Copyable(props: CopyableProps) {
    const [copied, setCopied] = useState(false);

    const [hover, setHover] = useState(false);

    return <Box display="inline" cursor="pointer"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)} onClick={(e: any) => {

            e.preventDefault()
            e.stopPropagation()

            navigator.clipboard.writeText(props.value ?? props.children)
            setCopied(true);
            setTimeout(() => {
                setCopied(false)
            }, 450)
        }}>
        {/* <Flex> */}
        <If condition={hover && props.showIcon} marginRight="5px">
            <Icon display="inline" as={CopyIcon} ></Icon>
        </If>
        {!copied ? (props.children) : <Label color="blue.400">{props.copyLabel}</Label>}
        {/* </Flex> */}
    </Box>
}