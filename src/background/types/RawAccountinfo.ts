export interface RawAccountInfo {
    context_slot: number
    data: Uint8Array
    executable: boolean
    lamports: number
    owner: string
}