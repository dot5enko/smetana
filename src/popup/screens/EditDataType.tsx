import { Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { DataType, getById } from "../../background/types/DataType";
import { useExtensionContext } from "../components/context/ExtensionContext";
import { ActionButton } from "../components/menu/ActionButton";
import { Route, RouteProps } from "../components/Router";

export interface EditDataTypeProps {
    id: any
}

export function EditDataType(props: EditDataTypeProps) {

    const [object, setObject] = useState<DataType | null>(null);

    useEffect(() => {
        getById(props.id).then((obj) => {
            setObject(obj);
        }).catch(e => {
            console.error('unable to get an object by id :', props.id)
        });
    }, [props.id])

    return <>
        <Text>Editing type {props.id} {object?.label}</Text>
        <ActionButton action={function (): void {
            throw new Error("Function not implemented.");
        }}>Add field</ActionButton>
    </>
}