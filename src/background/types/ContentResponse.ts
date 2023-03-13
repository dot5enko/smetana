import { Address, AddressData, DataTypeSync } from ".";

export interface ContentResponse {
    LastData?: AddressData,
    Address: Address
    Type?: DataTypeSync
    DataCount: number

}