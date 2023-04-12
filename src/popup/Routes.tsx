import { useRouteArg } from "./components/context/ExtensionContext";
import { BottomContent, ColorPicker, Route, MenuEntry } from "./components/menu";
import { Addresses, ImportIdl, DataTypes, EditDataType, EditTypeField, EditWatchedAddress, AddressDashboard } from "./screens";
import { AddressBook } from "./screens/AddressBook";
import { BasicAddrEdit } from "./screens/BasicAddrEdit";
import { ChangeAddrDefaultType } from "./screens/ChangeAddrDefaultType";
import { DataHistory } from "./screens/DataHistory";
export function Routes() {

    return <>
        <Route path="home">
            <MenuEntry submenu="addresses">Watching</MenuEntry>
            <MenuEntry submenu="address_book">Address Book</MenuEntry>
            <MenuEntry submenu="data_types" fixedFooter={true} >Data types</MenuEntry>
            <BottomContent>
                <MenuEntry submenu="addr_view" colorVariant="info" args={[undefined, undefined, true]}>Explore</MenuEntry>
            </BottomContent>
        </Route>
        <Route path="">
            <AddressDashboard id={useRouteArg(0)} type_id={useRouteArg(1)} explore={true} />
        </Route>
        <Route path="address_book">
            <AddressBook />
        </Route>
        <Route path="addr_default_type">
            <ChangeAddrDefaultType id={useRouteArg(0)} />
        </Route>
        <Route path="addr_view">
            <AddressDashboard id={useRouteArg(0)} type_id={useRouteArg(1)} explore={useRouteArg(2)} />
        </Route>
        <Route path="basic_addr_edit">
            <BasicAddrEdit id={useRouteArg(0)} />
        </Route>
        <Route path="addresses">
            <Addresses />
        </Route>
        <Route path="import_anchor_type">
            <ImportIdl />
        </Route>
        <Route path="data_types">
            <DataTypes />
        </Route>
        <Route path="edit_datatype">
            <EditDataType id={useRouteArg(0)} />
        </Route>
        <Route path="edit_typefield" >
            <EditTypeField id={useRouteArg(0)} protected={useRouteArg(1, false)} />
        </Route>
        <Route path="edit_watchedaddress">
            <EditWatchedAddress id={useRouteArg(0)} />
        </Route>
        <Route path="address_data_history">
            <DataHistory id={useRouteArg(0)} />
        </Route>
    </>
}