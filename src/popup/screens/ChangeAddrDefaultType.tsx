import { AddressHandler } from "../../background";
import { useObjectState } from "../components/context/objectState";

export interface ChangeAddrDefaultTypeProps {
    id: number
}

export function ChangeAddrDefaultType(props: ChangeAddrDefaultTypeProps) {

    const { id } = props;

    const { object, changeObject } = useObjectState(AddressHandler, id);

    return <>

    </>
}