import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Address, getAddresById, getAddrId, updateAddress } from "../../background/types";
import { ColorBlock, ColorPicker, If, SwitchInput, TextInput, twitterColors } from "../components/menu";

export function BasicAddrEdit(props: { id: string | number }) {

    const { id } = props;


    const [objectId, setObjId] = useState(0);

    const [object, setObject] = useState<Address | undefined>(undefined);

    function fetchObject(fetchId: number) {

        getAddresById(fetchId).then((respObject) => {
            setObject(respObject)
            setObjId(fetchId);
        })
    }

    useEffect(() => {

        if (typeof id == 'string') {
            getAddrId(id).then(idval => fetchObject(idval))
        } else {
            fetchObject(id);
        }

    }, [id])

    const [changesCount, setChangesCount] = useState(0);
    useEffect(() => {
        if (changesCount > 0) {
            updateAddress(objectId, object)
                .catch(e => console.error('unable to update object', e.message))


            console.log('update adddress ', object)
        }
    }, [changesCount, objectId])

    function changeObject(handler: { (obj: Address): void }) {

        if (object !== undefined) {

            handler(object)

            setObject(object)
            setChangesCount(changesCount + 1)
        }
    }

    return <>
        <TextInput placeholder="label" sublabel="this is what you'll see in explorer instead of address" value={object?.label ?? ""} onChange={(newVal) => {
            changeObject(it => it.label = newVal)
        }} />
        <SwitchInput value={object?.hasColor} onChange={(val) => {
            changeObject(it => it.hasColor = val)
        }}>Color label {(object?.hasColor && object.labelColor) ? <Box display="inline-block" backgroundColor={object?.labelColor} height="5px" width="50px" borderRadius="6px"></Box> : null}</SwitchInput>
        <If condition={object?.hasColor}>
            <ColorPicker
                values={twitterColors}
                value={object?.labelColor}
                onChange={nval => changeObject(it => it.labelColor = nval)}
            />
        </If>
    </>
}