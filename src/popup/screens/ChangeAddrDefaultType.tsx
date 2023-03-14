import { DataType } from "../../background/types";
import { AddressHandler } from "../../background";
import { useObjectState } from "../components/context/objectState";
import { Decoder } from "../components/smetana/Decoder";
import { TypeSelectorSearchbox } from "../components/smetana/TypeSelectorSearchbox";

export interface ChangeAddrDefaultTypeProps {
    id: number
}

export function ChangeAddrDefaultType(props: ChangeAddrDefaultTypeProps) {

    const { id } = props;

    const { object, changeObject } = useObjectState(AddressHandler, id);

    return <>
        <TypeSelectorSearchbox
            elementRenderer={(it) => {
                return <Decoder it={it as DataType} datasize={object?.datalen ?? 0} />
            }}
            placeholder="type new type name" value={object?.type_assigned} onSelectorValueChange={nval => {
                changeObject(it => it.type_assigned = nval.id as number)
            }} />
    </>
}