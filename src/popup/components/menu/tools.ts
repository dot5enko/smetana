export function minutesReadable(minutes: number): string {
    if (minutes < 60) {
        return minutes + " minute";
    } else {
        let hours = minutes / 60;
        return hours + " hour";
    }
}


export function timeNow(): number {
    return new Date().getTime()/1000;
}