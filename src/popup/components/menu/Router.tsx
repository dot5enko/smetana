import { useMemo } from "react";
import { useExtensionContext } from "../context/ExtensionContext";

export interface RouteProps {
    path: string
    children?: any
    args?: any[]
}

export function Route(props: RouteProps) {

    const { route } = useExtensionContext();

    const content = useMemo(() => {
        if (route.path == props.path) {
            return props.children;
        } else {
            return null;
        }

    }, [route.path, props.path, props.children])

    return content;
}

export function SlideRoute(props: RouteProps) {

    const { slideRoute } = useExtensionContext();

    const content = useMemo(() => {
        if (slideRoute.path == props.path) {
            return props.children;
        } else {
            return null;
        }

    }, [slideRoute.path, props.path, props.children])

    return content;
}