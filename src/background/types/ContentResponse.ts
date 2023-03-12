import { Address } from "./Address";
import { AddressData } from "./AddressData";

export interface ContentResponse {
    LastData?: AddressData,
    Address: Address
}