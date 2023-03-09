export interface AddressData {

    // for simlicity its type is string
    key : string,
    
    // user added this address to favourites
    starred: boolean

    // user given label to this address
    label: string

    lastDataTime: Date
    lastData: Buffer
}