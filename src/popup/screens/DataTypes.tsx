import { createNew } from "../../background/types/DataType";
import { useExtensionContext } from "../components/context/ExtensionContext";
import { ActionButton } from "../components/menu/ActionButton";

export interface DataTypesProps {
}

export function DataTypes(props: DataTypesProps) {

    const { setRoute } = useExtensionContext();

    return <>
        <ActionButton
            actionVariant="info"
            action={async () => {
                try {
                    const id = await createNew();
                    setRoute('edit_datatype', id as number)
                } catch (e: any) {
                    console.error('unable to create new type:', e.message)
                }
            }}>New type</ActionButton>
    </>
}