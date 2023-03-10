import { useRouteArg } from "./components/context/ExtensionContext";
import { MenuEntry } from "./components/menu/MenuEntry";
import { Route } from "./components/menu/Router";
import { Addresses } from "./screens/Addresses";
import { DataTypes } from "./screens/DataTypes";
import { EditDataType } from "./screens/EditDataType";
import { EditTypeField } from "./screens/EditTypeField";
import { ImportIdl } from "./screens/ImportIdl";
import { TrackNewAddress } from "./screens/TrackNewAddress";
import { BottomContent } from "./components/menu";

export function Routes() {

    return <>
        <Route path="">
            <MenuEntry submenu="addresses">Watching</MenuEntry>
            <MenuEntry submenu="tags">Tags</MenuEntry>
            <MenuEntry submenu="data_types" fixedFooter={true} >Data types</MenuEntry>
            <BottomContent>
                <MenuEntry submenu="track_new_address" colorVariant="info" fixedFooter={true}>Track new address</MenuEntry>
            </BottomContent>
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
    </>
}