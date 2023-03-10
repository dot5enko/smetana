import { useState, useEffect } from "react";
import { findWatchedAddresses, WatchedAddress as WatchedAddressInterface } from "../../background/types";
import { useExtensionContext } from "../components/context/ExtensionContext";
import { TextInput } from "../components/menu";
import { WatchedAddress } from "../components/smetana";
import { SearchLimit } from "./DataTypes";

export interface AddressesProps {

}

export function Addresses(props: AddressesProps) {

    const { setRoute } = useExtensionContext();

    const [query, setQuery] = useState<string>("");
    const [items, setItems] = useState<WatchedAddressInterface[]>([]);

    useEffect(() => {
        findWatchedAddresses(query, SearchLimit).then((items) => {
            setItems(items);
        });
    }, [query])

    return <>
        <TextInput
            sizeVariant="sm"
            placeholder="search query"
            value={query}
            onChange={(newVal) => {
                setQuery(newVal)
            }}></TextInput>
        {items.map((it, idx) => {
            return <WatchedAddress key={idx} item={it} onClick={() => {
                setRoute("edit_watchedaddress", "Edit watched address", false, it.id);
            }} />
        })}
    </>
}