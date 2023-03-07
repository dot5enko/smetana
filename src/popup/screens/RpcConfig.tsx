import { useExtensionContext } from "../components/context/ExtensionContext";
import { ItemSelector } from "../components/menu/ItemSelect";

export function RpcConfig() {

    const { rpc, setRpc } = useExtensionContext();

    const opts = [
        "https://rpc.ankr.com/solana",
        "https://api.mainnet-beta.solana.com",
        "https://api.devnet.solana.com",
        "https://api.testnet.solana.com",
        "https://try-rpc.mainnet.solana.blockdaemon.tech"
    ]

    return <>
        <ItemSelector options={opts} value={[rpc]} label={"select rpc you want use for extension"} onSelectorValueChange={(val: string[]) => {
            setRpc(val[0]);
        }}></ItemSelector>
    </>
}