import { Box, Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Address, findAddresses } from "../../background/types";
import { If, Label, MenuEntry, TextInput } from "../components/menu";
import { SearchLimit } from "./DataTypes";

export function AddressBook() {

    const [query, setQuery] = useState<string>("");
    const [items, setItems] = useState<Address[]>([]);

    useEffect(() => {
        findAddresses(query, SearchLimit).then((items) => {
            setItems(items);
        });
    }, [query])

    return <>
        <TextInput
            sizeVariant="sm"
            placeholder="search by label"
            value={query}
            onChange={(newVal) => {
                setQuery(newVal)
            }}></TextInput>
        {items.map((it, idx) => {
            return <AddressBookEntry key={idx} item={it} />
        })}
    </>

}

function AddressBookEntry(props: { item: Address }) {

    const { item } = props;

    return <MenuEntry submenu="basic_addr_edit" args={[item.id as number]} submenuTitle={"edit " + item.address}>
        <Flex gap="5px" alignItems={"center"} justifyItems="center">
            <If condition={item.hasColor}>
                <Box
                    display="inline-block"
                    backgroundColor={item?.labelColor}
                    height="8px"
                    width="60px"
                    borderRadius="6px"
                >
                </Box>
            </If>
            <Label fontSize={"sm"}>{item.label != "" && item.label != null ? item.label : item.address}</Label>
        </Flex>
    </MenuEntry>
}