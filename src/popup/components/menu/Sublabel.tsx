import { Text } from "@chakra-ui/react"

export function Sublabel(props: { value: string }) {
    return <Text padding="2px 15px" fontSize="xs" color="gray.200">{props.value}</Text>
}