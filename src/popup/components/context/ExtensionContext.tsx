import { Connection } from "@solana/web3.js";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getKeyValueOrDefault, setKeyValue } from "../../../background/storage";


export interface ExtensionContextType {
    route: RouteHistoryEntry,
    setRoute(val: string, title: string, ...args: any[]): void,

    routeBack(): void
    hasBack: boolean

    rpc: string
    setRpc(arg: string): void

    slideActive: boolean,
    toggleSlide(): void

    connection: Connection
}

const ExtensionContext = createContext({} as ExtensionContextType);

export interface ExtensionContextProviderProps {
    children?: JSX.Element
}

const RpcConfigKey = "rpc_config";

interface RouteHistoryEntry {
    path: string,
    title: string,
    args: any[]
}

export function ExtensionContextProvider(props: ExtensionContextProviderProps) {

    const { children, ...rest } = props;

    const [currentRoute, setRouteState] = useState<RouteHistoryEntry>({ path: "", title: "", args: [] })

    const [routeStack, setRouteStack] = useState<RouteHistoryEntry[]>([]);
    const [rpc, setRpcRaw] = useState<string>(getKeyValueOrDefault(RpcConfigKey, "https://rpc.ankr.com/solana"));

    const [slideActive, setSlideActive] = useState<boolean>(false);
    const [connection, setConnection] = useState(new Connection(rpc, 'confirmed'))

    useEffect(() => {
        // todo use parameter
        setConnection(new Connection(rpc, 'confirmed'))
        console.log('connection changed to: ', rpc)
    }, [rpc])


    const ctxValue = useMemo(() => {

        const setRoute = (newPath: string, newTitle: string, ...args: any[]) => {

            // push current route to stack
            {
                let routesHistory: RouteHistoryEntry[] = routeStack;
                routesHistory.push(currentRoute);

                setRouteStack(routesHistory);
            }

            const newRouteState: RouteHistoryEntry = {
                path: newPath,
                title: newTitle,
                args
            };
            setRouteState(newRouteState);
        }


        const routeBack = () => {
            const prevRoute = routeStack.pop();

            if (prevRoute !== undefined) {
                setRouteStack(routeStack);

                let prevRouteVal = prevRoute;
                // don't push current into history
                setRouteState(prevRouteVal)
            }
        }

        const setRpc = (val: string) => {
            setKeyValue(RpcConfigKey, val);
            setRpcRaw(val);
        }

        // slide window 
        const toggleSlide = () => {
            setSlideActive(!slideActive)
        }

        const value: ExtensionContextType = {
            connection,
            setRoute, routeBack,
            hasBack: routeStack.length > 0,
            rpc, setRpc,
            route: currentRoute,
            slideActive, toggleSlide,
        }
        return value;
    }, [rpc, slideActive, routeStack, currentRoute, connection])

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

export function useRouteArg(idx: number, def?: any): any {
    const { route: { args: routeArgs } } = useExtensionContext();
    return routeArgs[idx] ?? def;
}


