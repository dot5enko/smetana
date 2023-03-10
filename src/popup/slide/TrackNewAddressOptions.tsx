import { Flex, Text } from "@chakra-ui/react";
import { useState } from "react";
import { Sublabel, ActionButton, TextInput, ItemSelector, ScrolledItem } from "../components/menu";

export interface TrackNewAddressOptions {
    action(name: string, interval: number): void
}

function minutesReadable(minutes: number): string {
    if (minutes < 60) {
        return minutes + " minute";
    } else {
        let hours = minutes / 60;
        return hours + " hour";
    }
}

export function TrackNewAddressOptions(props: TrackNewAddressOptions) {

    const { action } = props;

    const [label, setLabel] = useState("");

    const values = [5, 10, 60, 360];
    const [intervalValue, setIntervalValue] = useState(60);

    return <><Flex textAlign="center" padding="5px" gap="5px" direction="column">
        <Text fontSize="xl">Track options</Text>
        {/* <Sublabel>Select label for address and data fetch interval you need</Sublabel> */}
        <TextInput
            sizeVariant="sm"
            value={label}
            placeholder="userland label for this address"
            onChange={(nval) => { setLabel(nval) }}
        />
        <Sublabel textAlign="left">Track interval</Sublabel>
        <ScrolledItem height={200}>
            <ItemSelector
                sizeVariant="xs"
                options={values}
                value={[intervalValue]}
                elementRenderer={(it) => {
                    return <>
                        <Text>{minutesReadable(it)}</Text>
                    </>
                }}
                onSelectorValueChange={(newVal) => {
                    setIntervalValue(newVal[0])
                }}
            />
        </ScrolledItem>
    </Flex>
        <ActionButton sizeVariant="md" colorVariant="info" action={() => {
            if (action) {
                action(label, intervalValue)
            }
        }} >Confirm</ActionButton>
    </>
}