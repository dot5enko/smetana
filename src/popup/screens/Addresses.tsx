import { MenuEntry } from "../components/menu/MenuEntry";

export interface AddressesProps {

}
export function Addresses(props: AddressesProps) {
    return <>
        <MenuEntry submenu="track_new_address" colorVariant="info" fixedFooter={true}>Track new address</MenuEntry>
        <MenuEntry submenu="address_history">History</MenuEntry>
    </>
}