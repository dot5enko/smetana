import { useExtensionContext } from "../context/ExtensionContext"
import { Label } from "./Label"

export interface LinkProps {

    // todo introduce RouteType
    to: string,
    title: string
    fixedFooter: boolean
    args: any[]
    children: any
}

Link.defaultProps = {
    args: [],
    title: "",
    fixedFooter: false
}

export function Link(props: LinkProps) {
    const { setRoute } = useExtensionContext();

    return <Label color="blue.400" _hover={{
        color: "blue.700"
    }} display={"inline"} onClick={(e: any) => {
        e.preventDefault()
        e.stopPropagation()
        setRoute(props.to, props.title, props.fixedFooter, ...props.args)
    }}>
        {props.children}
    </Label>
}