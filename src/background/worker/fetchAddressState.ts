import { AddressDataHandler, AddressHandler } from "../database";
import { ContentResponse, getAddrId, getTypeToDecode } from "../types";
import { ResponseSender } from "./taskHandler";

export default async (request: any, sendResponse: ResponseSender) => {

    // fetch cache from database
    let addrs = request.address;

    let response_state: ContentResponse[] = [];

    //   sync 
    let doneRequests = 0;

    for (var curidx in addrs) {

        let addrStr = addrs[curidx];

        (async (curAddrStr) => {
            try {
                const addrId = await getAddrId(curAddrStr);
                const addrInfo = await AddressHandler.getById(addrId);

                let cached = await AddressDataHandler.getTable().get({
                    address_id: addrId
                })

                // check if there is type 
                let typ = await getTypeToDecode(addrId, false);

                const totalEntries = await AddressDataHandler.getTable().where('address_id').equals(addrInfo.id as number).count();

                const responseItem: ContentResponse = {
                    Address: addrInfo,
                    LastData: cached,
                    Type: typ.typ,
                    DataCount: totalEntries
                }

                response_state.push(responseItem);

            } catch (e: any) {
                console.warn("unable to get item from indexed db:", e.message)
            }

            if (doneRequests === (addrs.length - 1)) {
                console.log('response sent')
                sendResponse(response_state)
            }

            doneRequests += 1;

        })(addrStr)
    }

}