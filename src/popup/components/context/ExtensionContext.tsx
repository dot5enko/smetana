import { createContext, useContext, useMemo, useState } from "react";
import { getKeyValueOrDefault, setKeyValue } from "../../../background/storage";


export interface ExtensionContextType {
    route: string
    setRoute(val: string, ...args: any[]): void,
    routeBack(): void
    hasBack: boolean
    rpc: string
    setRpc(arg: string): void
    routeArgs: any[]
}

const ExtensionContext = createContext({} as ExtensionContextType);

export interface ExtensionContextProviderProps {
    children?: JSX.Element
}

const RpcConfigKey = "rpc_config";

interface RouteHistoryEntry {
    path: string,
    args?: any[]
}

export function ExtensionContextProvider(props: ExtensionContextProviderProps) {

    const { children, ...rest } = props;

    const [route, setRouteVal] = useState("")
    const [routeStack, setRouteStack] = useState<RouteHistoryEntry[]>([]);
    const [rpc, setRpcRaw] = useState<string>(getKeyValueOrDefault(RpcConfigKey, "https://rpc.ankr.com/solana"));
    const [routeArgs, setRouteArgs] = useState<any[]>([]);

    const ctxValue = useMemo(() => {

        const setRoute = (newVal: string, ...args: any[]) => {

            // push current route to stack
            {
                let routesHistory: RouteHistoryEntry[] = routeStack;
                routesHistory.push({
                    path: route,
                    args: routeArgs
                });

                setRouteStack(routesHistory);
            }

            setRouteVal(newVal);
            setRouteArgs(args)
        }


        const routeBack = () => {
            const prevRoute = routeStack.pop();

            if (prevRoute !== undefined) {
                setRouteStack(routeStack);

                let prevRouteVal = prevRoute;

                // don't push current into history
                setRouteVal(prevRouteVal.path);
                setRouteArgs(prevRouteVal.args as any[])
            }
        }

        const setRpc = (val: string) => {
            setKeyValue(RpcConfigKey, val);
            setRpcRaw(val);
        }

        const value: ExtensionContextType = {
            route, setRoute, routeBack,
            hasBack: routeStack.length > 0,
            rpc, setRpc,
            routeArgs
        }
        return value;
    }, [route, routeStack, rpc, routeArgs])

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

export function useRouteArg(idx: number): any {
    const { routeArgs } = useExtensionContext();
    return routeArgs[idx];
}


