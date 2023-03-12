import { useRouteArg } from "./components/context/ExtensionContext";
import { BottomContent, ColorPicker, Route, MenuEntry } from "./components/menu";
import { TrackNewAddress, Addresses, ImportIdl, DataTypes, EditDataType, EditTypeField, EditWatchedAddress } from "./screens";
import { BasicAddrEdit } from "./screens/BasicAddrEdit";
import { DataHistory } from "./screens/DataHistory";
export function Routes() {

    return <>
        <Route path="">
            <MenuEntry submenu="addresses">Watching</MenuEntry>
            <MenuEntry submenu="data_types" fixedFooter={true} >Data types</MenuEntry>
            <BottomContent>
                <MenuEntry submenu="track_new_address" colorVariant="info" fixedFooter={true}>Track new address</MenuEntry>
            </BottomContent>
            <MenuEntry submenu="basic_addr_edit" args={["A35xZFvr3xsRdaV6jnMrNujzBkKx3hApXTDCfj1AVpmm"]} >Edit me</MenuEntry>
        </Route>
        <Route path="basic_addr_edit">
            <BasicAddrEdit id={useRouteArg(0)} />
        </Route>
        <Route path="track_new_address">
            <TrackNewAddress addr="8szGkuLTAux9XMgZ2vtY39jVSowEcpBfFfD8hXSEqdGC" />
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