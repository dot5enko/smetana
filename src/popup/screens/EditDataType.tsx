import { useEffect, useState } from "react";
import { ActionButton } from "../components/menu/ActionButton";
import { MenuDivider } from "../components/menu/MenuDivider";
import { SwitchInput } from "../components/menu/SwitchInput";
import { TextInput } from "../components/menu/TextInput";
import { Route } from "../components/Router";
import { BorshTypeSelect } from "../components/smetana/BorshTypeSelect";

import { Text } from "@chakra-ui/react"

export interface EditDataTypeProps {
    path: string,
    id?: string
}

export function EditDataType(props: { path: string }) {

    const [curVal, setCurVal] = useState("u8");
    const [isOptional, setIsOptional] = useState(true);
    const [fieldName, setFieldName] = useState("");

    const [complexType, setComplexNested] = useState(false);

    return <Route path={props.path}>
        <TextInput sublabel="this will be shown in explorer" placeholder={"property name"} value={fieldName} onChange={(name: string) => {
            setFieldName(name)
        }} />
        <MenuDivider height={10} width={0} />
        <SwitchInput value={complexType} onChange={(val) => {
            setComplexNested(val)
        }}>Complex type</SwitchInput>

        {!complexType ?
            <BorshTypeSelect value={curVal} onChange={(type: string[]) => {
                setCurVal(type[0]);
            }}></BorshTypeSelect> :
            <Text>Complex types is not supported yet :(</Text>}
        <MenuDivider height={10} width={0} />
        <SwitchInput value={isOptional} onChange={(val) => {
            setIsOptional(val)
        }} sublabel="whether this field is optional in structure or not">Is optional</SwitchInput>
        <MenuDivider width={0} />
        <ActionButton actionVariant="info" action={() => { }} textAlign="center">Save</ActionButton>
    </Route>
}