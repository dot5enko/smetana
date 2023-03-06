import { createContext, useContext, useMemo, useState } from "react";


export interface ExtensionContextType {
    route: string
    setRoute(val: string): void,
    routeBack(): void
    hasBack: boolean
}

const ExtensionContext = createContext({} as ExtensionContextType);

export interface ExtensionContextProviderProps {
    children?: JSX.Element
}

export function ExtensionContextProvider(props: ExtensionContextProviderProps) {

    const { children, ...rest } = props;

    const [route, setRouteVal] = useState("")
    const [routeStack, setRouteStack] = useState<string[]>([]);

    const ctxValue = useMemo(() => {

        const setRoute = (newVal: string) => {

            // push current route to stack
            {
                let routesHistory = routeStack;
                routesHistory.push(route);

                setRouteStack(routesHistory);
            }

            setRouteVal(newVal);
        }


        const routeBack = () => {
            const prevRoute = routeStack.pop();

            if (prevRoute !== undefined) {
                setRouteStack(routeStack);

                // don't push current into history
                setRouteVal(prevRoute as string);
            }
        }

        const value: ExtensionContextType = {
            route,
            setRoute,
            routeBack,
            hasBack: routeStack.length > 0
        }
        return value;
    }, [route,routeStack])

    return (
        <ExtensionContext.Provider value={ctxValue}>
            {children}
        </ExtensionContext.Provider>
    )
}

export function useExtensionContext(): ExtensionContextType {
    const ctx: ExtensionContextType = useContext(ExtensionContext)

    if (ctx === null) {
        throw new Error("route context is undefined, have you wrapped element in ContextProvider?")
    }

    return ctx;
}


