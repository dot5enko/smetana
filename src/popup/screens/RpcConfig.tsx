import { useEffect, useState } from "react";
import { getKeyValueOrDefault, setKeyValue } from '../../background/storage';
import { useExtensionContext } from "../components/context/ExtensionContext";
import { ItemSelector } from "../components/menu/ItemSelect";
import { Route } from "../components/Router";

export function RpcConfig(props: { path: string }) {

    const { rpc, setRpc } = useExtensionContext();

    const opts = [
        "https://rpc.ankr.com/solana",
        "https://api.mainnet-beta.solana.com",
        "https://api.devnet.solana.com",
        "https://api.testnet.solana.com"
    ]

    return <Route path={props.path}>
        <ItemSelector options={opts} value={[rpc]} label={"select rpc you want use for extension"} onSelectorValueChange={(val: string[]) => {
            setRpc(val[0]);
        }}></ItemSelector>
    </Route>
}