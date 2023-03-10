import { Connection } from "@solana/web3.js";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getKeyValueOrDefault, setKeyValue } from "../../../background/storage";

export interface ExtensionContextType {
    route: RouteHistoryEntry,
    setRoute(val: string, title: string, footer: boolean, ...args: any[]): void,

    routeBack(): void
    hasBack: boolean

    rpc: string
    setRpc(arg: string): void

    slideActive: boolean,
    slideRoute: RouteHistoryEntry
    setSlideRoute(val: string, ...args: any[]): void,
    hideSlide(): void

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
    footerContent: boolean
}

export function ExtensionContextProvider(props: ExtensionContextProviderProps) {

    const { children, ...rest } = props;

    const [currentRoute, setRouteState] = useState<RouteHistoryEntry>({ path: "", title: "", args: [], footerContent: false })
    const [routeStack, setRouteStack] = useState<RouteHistoryEntry[]>([]);

    const [rpc, setRpcRaw] = useState<string>(getKeyValueOrDefault(RpcConfigKey, "https://rpc.ankr.com/solana"));
    const [connection, setConnection] = useState(new Connection(rpc, 'confirmed'))

    const [slideActive, setSlideActive] = useState<boolean>(false);
    const [slideRoute, setSlideRouteVal] = useState<RouteHistoryEntry>({ path: "", title: "", args: [], footerContent: false })

    useEffect(() => {
        // todo use parameter
        setConnection(new Connection(rpc, 'confirmed'))
        console.log('connection changed to: ', rpc)
    }, [rpc])

    const ctxValue = useMemo(() => {

        const setRoute = (newPath: string, newTitle: string, footerContent: boolean, ...args: any[]) => {

            // push current route to stack
            {
                let routesHistory: RouteHistoryEntry[] = routeStack;
                routesHistory.push(currentRoute);

                setRouteStack(routesHistory);
            }

            const newRouteState: RouteHistoryEntry = {
                path: newPath,
                title: newTitle,
                args,
                footerContent
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
        const setSlideRoute = (path: string, ...args: any[]) => {

            const srval: RouteHistoryEntry = {
                path: path,
                title: "",
                args: args,
                footerContent: false
            }

            setSlideRouteVal(srval)
            setSlideActive(true)
        }

        // slide 

        const hideSlide = () => {
            setSlideActive(false)
        }


        const value: ExtensionContextType = {
            connection,
            setRoute, routeBack,
            hasBack: routeStack.length > 0,
            rpc, setRpc,
            route: currentRoute,

            slideActive,
            setSlideRoute,
            slideRoute,
            hideSlide
        }
        return value;

    }, [rpc, slideActive, routeStack, currentRoute, connection,
        slideRoute, slideActive])

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

export function useSlideRouteArg(idx: number, def?: any): any {
    const { slideRoute: { args: routeArgs } } = useExtensionContext();
    return routeArgs[idx] ?? def;
}