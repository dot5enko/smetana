export function addrFormat(val: string, prefixLength: number = 4, separator: string = '...'): string {

    let prefix = val.substring(0, prefixLength);
    let suffix = val.substring(val.length - prefixLength);

    return prefix + separator + suffix;
}