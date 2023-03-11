// import { PublicKey } from "@solana/web3.js";
import { AddressData } from "../background/types/AddressData";

interface AddrCacheEntry {
    data?: AddressData
    lastUpdated?: Date
    fetched: boolean
}

class ContentContext {

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

            for (var it of resp) {
                let newVal: AddrCacheEntry = {
                    data: it,
                    lastUpdated: new Date(),
                    fetched: true
                };
                // this.addressDataCache.set(it.key, newVal);
            }

            return resp;
        });
    }

    public fetchAddressesStateFromHistory(addrs: string[]): Promise<AddressData[]> {

        let chromeObject = (window as any).chrome;

        return chromeObject.runtime.sendMessage({
            "smetana": true,
            "command": "fetch_addresses_state",
            "address": addrs,
        }).then((resp: AddressData[]) => {

            console.log('got a response from background worker :', resp)

            for (var it of resp) {
                let newVal: AddrCacheEntry = {
                    data: it,
                    lastUpdated: new Date(),
                    fetched: true
                };
                // this.addressDataCache.set(it.key, newVal);
            }

            return resp;
        });
    }
}

export default new ContentContext();


