// import { PublicKey } from "@solana/web3.js";
import { ChunkDataEntry } from "src/background/worker/periodicTask";
import { Address, AddressData, ContentResponse, DataType, RawAccountInfo } from "../background/types";

interface AddrCacheEntry {
    data?: RawAccountInfo
    address?: Address
    lastUpdated?: Date
    datatype?: DataType,
    fetched: boolean
}

export interface FetchAddressesDataResponse {
    items: ChunkDataEntry[]
}

export class ContentContext {

    addressDataCache: Map<string, AddrCacheEntry> = new Map();

    public setSeen(addr: string) {
        this.addressDataCache.set(addr, {
            fetched: false
        });
    }

    public getData(addr: string): AddrCacheEntry | undefined {

        var addrStr = addr;

        return this.addressDataCache.get(addrStr);
    }

    public seen(addr: string): boolean {
        return this.addressDataCache.has(addr);
    }
    public fetchAddressData(addrs: string[]): Promise<AddressData[]> {
        let chromeObject = (window as any).chrome;

        return chromeObject.runtime.sendMessage({
            "smetana": true,
            "command": "fetch_addresses_data",
            "address": addrs,
        }).then((resp: FetchAddressesDataResponse) => {

            let respIdx = 0;

            console.log('response for fetch_addresses_data: ', resp)

            for (var it of resp.items) {

                const key = addrs[respIdx];

                const info = this.addressDataCache.get(key)

                let newVal: AddrCacheEntry = {
                    data: it.info,
                    address: info?.address,
                    lastUpdated: new Date(),
                    fetched: true
                };

                this.addressDataCache.set(key, newVal);

                respIdx += 1;
            }

            return resp;
        });
    }

    public fetchAddressesStateFromHistory(addrs: string[]): Promise<ContentResponse[]> {

        let chromeObject = window.chrome;

        return chromeObject.runtime.sendMessage({
            "smetana": true,
            "command": "fetch_addresses_state",
            "address": addrs,
        }).then((resp: ContentResponse[]) => {

            console.log('got a response from background worker :', resp)

            for (var it of resp) {

                let raccinfo: RawAccountInfo = {
                    context_slot: it.LastData?.context_slot as number,
                    data: it.LastData?.data as Uint8Array,
                    executable: false,
                    lamports: it.LastData?.lamports as number,
                    owner: ""
                };

                let newVal: AddrCacheEntry = {
                    data: raccinfo,
                    address: it.Address,
                    lastUpdated: new Date(),
                    fetched: true
                };
                this.addressDataCache.set(it.Address.address, newVal);
            }

            return resp;
        });
    }
}

export const PageContext = new ContentContext();