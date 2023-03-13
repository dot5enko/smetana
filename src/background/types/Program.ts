import { Connection, PublicKey } from "@solana/web3.js"
import { getAddrId } from "."
import { AddressHandler, db, ProgramHandler } from "../database"
import { genAnchorIdlAddr, parseIdlFromAccountData, parseIdlTypes } from "../idl"
import { getSingleAddressInfo } from "../rpc"
import { importType } from "./DataType"
import { getSignleRawAccountInfo } from "./RawAccountinfo"

export interface Program {
    id?: number
    address_id: number

    // anchor idl account exists
    is_anchor: boolean

    idl_parsed: boolean
    imported: boolean

    // whether account data tryed 
    fetched: boolean
}

const programtable = ProgramHandler.getTable()

export async function getProgramAddrById(address_id: number): Promise<Program> {

    const object = await programtable.get({ address_id });

    if (object == null) {

        let newObject: Program = {
            address_id: address_id,
            is_anchor: false,
            fetched: false,
            imported: false,
            idl_parsed: false
        };

        const resultid = await programtable.add(newObject);
        newObject.id = resultid as number;

        return Promise.resolve(newObject);
    } else {
        return Promise.resolve(object);
    }
}

export async function getProgramState(program_id: string): Promise<Program> {

    const id = await getAddrId(program_id);
    const object = await getProgramAddrById(id);

    return object;
}

export async function fetchProgramIdl(conn: Connection, program_id: string): Promise<Program> {

    const programInfo = await getProgramState(program_id);

    if (!programInfo.fetched) {
        const idlAddress = await genAnchorIdlAddr(new PublicKey(program_id));

        programInfo.fetched = true;
        await programtable.update(programInfo.id, programInfo)

        const idlId = await getAddrId(idlAddress.toBase58())

        const addrData = await AddressHandler.getById(idlId);

        const rawAccountInfo = await getSignleRawAccountInfo(conn, addrData)

        programInfo.is_anchor = true;
        await programtable.update(programInfo.id, programInfo)

        const idlJson = parseIdlFromAccountData(rawAccountInfo.data);

        const parseJsonIdlResult = await parseIdlTypes(idlJson, true);

        programInfo.idl_parsed = true;
        await programtable.update(programInfo.id, programInfo)

        for (var it of parseJsonIdlResult.types) {
            try {
                await importType(program_id, it[1]);
            } catch (e: any) {
                console.log(`unable to import type ${it[0]}: ${e.message}`, e)
            }
        }

        programInfo.imported = true;
        await programtable.update(programInfo.id, programInfo)
    }

    return Promise.resolve(programInfo);
}

