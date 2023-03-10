import { ActionButton } from "../components/menu";

export function DataHistory(props: { id?: number }) {

    const { id } = props;

    return <>
        <ActionButton>address id : {id}</ActionButton>
    </>
}