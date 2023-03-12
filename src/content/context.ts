// import { PublicKey } from "@solana/web3.js";
import { Address, AddressData, ContentResponse } from "../background/types";

interface AddrCacheEntry {
    data?: AddressData
    address?: Address
    lastUpdated?: Date
    fetched: boolean
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
        }).then((resp: AddressData[]) => {

            let respIdx = 0;

            for (var it of resp) {

                const key = addrs[respIdx];

                const info = this.addressDataCache.get(key)

                let newVal: AddrCacheEntry = {
                    data: it,
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
                let newVal: AddrCacheEntry = {
                    data: it.LastData,
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