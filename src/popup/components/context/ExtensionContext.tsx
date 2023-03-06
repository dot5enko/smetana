import { createContext, useContext, useMemo, useState } from "react";
import { getKeyValueOrDefault, setKeyValue } from "../../../background/storage";


export interface ExtensionContextType {
    route: string
    setRoute(val: string): void,
    routeBack(): void
    hasBack: boolean
    rpc: string
    setRpc(arg: string): void
}

const ExtensionContext = createContext({} as ExtensionContextType);

export interface ExtensionContextProviderProps {
    children?: JSX.Element
}

const RpcConfigKey = "rpc_config";

export function ExtensionContextProvider(props: ExtensionContextProviderProps) {

    const { children, ...rest } = props;

    const [route, setRouteVal] = useState("")
    const [routeStack, setRouteStack] = useState<string[]>([]);
    const [rpc, setRpcRaw] = useState<string>(getKeyValueOrDefault(RpcConfigKey, "https://rpc.ankr.com/solana"));

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

        const setRpc = (val: string) => {
            setKeyValue(RpcConfigKey, val);
            setRpcRaw(val);
        }

        const value: ExtensionContextType = {
            route,
            setRoute,
            routeBack,
            hasBack: routeStack.length > 0,
            rpc, setRpc
        }
        return value;
    }, [route, routeStack, rpc])

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


