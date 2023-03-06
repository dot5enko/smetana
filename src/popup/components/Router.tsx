import { useMemo } from "react";
import { useExtensionContext } from "./context/ExtensionContext";

export function Router() {

}

export interface RouteProps {
    path: string
    children: any
}

export function Route(props: RouteProps) {

    const { route } = useExtensionContext();

    const content = useMemo(() => {
        if (route == props.path) {
            return props.children;
        } else {
            return null;
        }

    }, [route, props.path, props.children])

    return content;
}