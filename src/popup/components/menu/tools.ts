export function minutesReadable(minutes: number): string {
    if (minutes < 60) {
        return minutes + " minute";
    } else {
        let hours = minutes / 60;
        return hours + " hour";
    }
}