import { useEffect, useState } from "react";
import { getAddrId } from "../../background/types";
import { MenuEntry, Sublabel } from "../components/menu";

export function AddressDashboard(props: { id: string | number }) {

    const { id } = props;

    const [objectId, setObjId] = useState(0);

    useEffect(() => {
        if (typeof id === 'number') {
            setObjId(id)
        } else {
            getAddrId(id).then(idval => setObjId(idval))
        }
    }, [id])


    return <>
        <MenuEntry submenu="basic_addr_edit" args={[id]}>
            Edit Explorer presentation
            <Sublabel>sdakdksds</Sublabel>
        </MenuEntry>
    </>
}