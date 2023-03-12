import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { AddressHandler, getAddrId } from "../../background/types";
import { useObjectState } from "../components/context/objectState";
import { ColorPicker, If, SwitchInput, TextInput, twitterColors } from "../components/menu";

export function BasicAddrEdit(props: { id: string | number }) {

    const { id } = props;

    const [objectId, setObjId] = useState(0);

    useEffect(() => {
        if (typeof id === 'number') {
            setObjId(id)
        } else {
            getAddrId(id).then(idval => setObjId(idval))
        }
    }, [id])

    const { object, changeObject } = useObjectState(AddressHandler, objectId);

    return <>
        <TextInput placeholder="label" sublabel="this is what you'll see in explorer instead of address" value={object?.label ?? ""} onChange={(newVal) => {
            changeObject(it => it.label = newVal)
        }} />
        <SwitchInput value={object?.hasColor} onChange={(val) => {
            changeObject(it => it.hasColor = val)
        }}>Color label {(object?.hasColor && object.labelColor) ? <Box display="inline-block" backgroundColor={object?.labelColor} height="8px" width="60px" borderRadius="6px"></Box> : null}</SwitchInput>
        <If condition={object?.hasColor}>
            <ColorPicker
                values={twitterColors}
                value={object?.labelColor}
                onChange={nval => changeObject(it => it.labelColor = nval)}
            />
        </If>
    </>
}