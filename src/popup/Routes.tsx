import { useRouteArg } from "./components/context/ExtensionContext";
import { MenuDivider } from "./components/menu/MenuDivider";
import { MenuEntry } from "./components/menu/MenuEntry";
import { Route } from "./components/menu/Router";
import { Addresses } from "./screens/Addresses";
import { DataTypes } from "./screens/DataTypes";
import { EditDataType } from "./screens/EditDataType";
import { EditTypeField } from "./screens/EditTypeField";
import { ImportIdl } from "./screens/ImportIdl";
import { RpcConfig } from "./slide/RpcConfig";
import { TrackNewAddress } from "./screens/TrackNewAddress";
import { AboutPage } from "./slide/About";
import { Config } from "./slide/Config";
import { BottomContent } from "./components/menu";

export function Routes() {

    return <>
        <Route path="">
            <MenuEntry submenu="addresses">Watched addresses</MenuEntry>
            <MenuEntry submenu="tags">Tags</MenuEntry>
            <MenuEntry submenu="data_types" fixedFooter={true} >Data types</MenuEntry>
            <MenuDivider width={0} />
            <AboutPage />
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
        <Route path="rpc_config">
            <RpcConfig />
        </Route>
    </>
}