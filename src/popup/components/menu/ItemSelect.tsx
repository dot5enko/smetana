import { Box, Text, HTMLChakraProps, Spacer, Icon, Flex } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { MdCheckCircle } from "react-icons/md";
import { MenuItemBasicElement } from "./MenuItemBasicElement";
import { ScrolledItem } from "./ScrolledItem";

export type ItemSelectorSize = 'sm' | "md" | "bg"

export interface ItemSelectorProps<T> extends HTMLChakraProps<'div'> {
    options: T[],
    value: T[]
    isMultiselect?: boolean,
    onSelectorValueChange?(selected: T[]): void,
    elementRenderer?(item: T): JSX.Element,
    label?: string,
    size?: ItemSelectorSize
    scrollAfterHeight?: number
}

export function ItemSelector<T>(props: ItemSelectorProps<T>) {

    const [selected, setSelected] = useState(props.value);
    const [selectedChanges, setChanges] = useState(0);

    useEffect(() => {
        setSelected(props.value)
    }, [props.value])

    const { size, fontSize, padding } = useMemo(() => {

        let heightVal = "65px"
        let font = "16px"
        let padding = "10px 20px"

        switch (props.size) {
            case 'bg':
                heightVal = "95px"
                font = "32px"
                break;
            case 'sm':
                heightVal = "25px"
                font = "14px"
                padding = "8px 16px";
                break;
            default:
                heightVal = "65px"
                font = "16px"
                padding = "10px 20px";
                break;
        }

        return { size: heightVal, fontSize: font, padding };
    }, [props.size]);

    useEffect(() => {
        if (selectedChanges > 0) {
            if (props.onSelectorValueChange != null) {
                props.onSelectorValueChange(selected)
            }
        }
    }, [selectedChanges])


    const itemRenderer = props.elementRenderer ? props.elementRenderer : (item: T) => {
        if (typeof item !== 'string') {
            throw new Error("no item renderer provided, and selector items are not of type string ")
        } else {
            return <Text>{item}</Text>
        }
    }

    const result = useMemo(() => {

        const toggleItem = (option: T) => {

            // todo handle single option select
            if (selected.includes(option)) {
                if (!props.isMultiselect) {
                    // cannot deselect one item
                } else {
                    // deselect
                    var newSelected = [];
                    for (var item of selected) {
                        // todo use interface for comparison. T should be subtype of comparable 
                        if (item !== option) {
                            newSelected.push(item);
                        }
                    }

                    setSelected(newSelected);
                    setChanges(selectedChanges + 1);
                }
            } else {
                // select

                let copy: T[] = [];

                if (props.isMultiselect) {
                    copy = selected;
                }

                copy.push(option);

                setSelected(copy);
                setChanges(selectedChanges + 1);
            }
        }

        const inner = props.options.map((it, idx) => {

            const renderedItem = itemRenderer(it);

            const onClickHandler = () => {
                toggleItem(it)
            }

            const isFirst = idx == 0;
            const isLast = idx == (props.options.length - 1);

            const borderTop = isFirst ? "6px" : "0px";
            const borderBottom = isLast ? "6px" : "0px";

            const borderBottomValue = isLast ? "" : "1px solid #3A3E4C";

            return (<MenuItemBasicElement
                key={idx}
                borderTopRadius={borderTop}
                borderBottomRadius={borderBottom}
                borderBottom={borderBottomValue}
                onClick={onClickHandler}
                minHeight={size}
                fontSize={fontSize}
                padding={padding}
            >
                <Flex>
                    <>{renderedItem}</>
                    {selected.includes(it) ? <>
                        <Spacer />
                        <Box>
                            <Icon fontSize={"16px"} color="green.300" as={MdCheckCircle} />
                        </Box>
                    </> : null}
                </Flex>
            </MenuItemBasicElement>)
        })

        return <Box>
            {props.label ? <Text fontSize="14px" color="gray.200" padding="10px">{props.label}</Text> : null}
            <>
                <ScrolledItem height={props.scrollAfterHeight} >
                    {inner}
                </ScrolledItem>
            </>
        </Box>
    }, [selectedChanges, selected, props.options]);

    return result;
}