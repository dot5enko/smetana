import { Box, Flex } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { useExtensionContext } from "../context/ExtensionContext";

export interface RouteProps {
    path: string
    children?: any
    args?: any[]
}

type RouteAction = 'show' | 'hide' | "none";

export function Route(props: RouteProps) {

    const { route } = useExtensionContext();

    const [current, setCurrent] = useState(false);
    const [action, setAction] = useState<RouteAction>('none')
    const [opacity, setOpacity] = useState<number>(0);

    if (route.path == props.path) {
        if (!current) {
            setAction('show');
            setCurrent(true);
        }
    } else {

        if (current) {
            setAction('hide');
            setCurrent(false);
        }
    }

    useEffect(() => {

        if (action == 'show') {
            setTimeout(() => {
                setOpacity(1);
            }, 5)
        }

        if (action == 'hide') {
            setOpacity(0);
        }
    }, [action])

    if (current) {
        return <Flex direction="column" gap="5px" transition="all .35s ease" opacity={opacity} translateX={opacity == 1?"-200px":"0px"}>
            {props.children}
        </Flex>
    } else {
        return null;
    }
}

export function SlideRoute(props: RouteProps) {

    const { slideRoute } = useExtensionContext();

    const content = useMemo(() => {
        if (slideRoute.path == props.path) {
            return props.children
        } else {
            return null;
        }

    }, [slideRoute.path, props.path, props.children])

    return content;
}