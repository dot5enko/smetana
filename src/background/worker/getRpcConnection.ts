import { Connection } from "@solana/web3.js";
import { DefaultRpcServer } from "../rpc";
import { getKeyValueFromDb, RpcConfigKey } from "../storage";

export async function getRpcConnection(): Promise<Connection> {

    let rpcAddr = await getKeyValueFromDb(RpcConfigKey, DefaultRpcServer);

    console.log(`started with rpc: ${rpcAddr}`)

    let connection = new Connection(rpcAddr, "confirmed");

    return connection;

}