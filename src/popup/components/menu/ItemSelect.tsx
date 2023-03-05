import { Box, Text, HTMLChakraProps, Spacer, Icon, Flex } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { MdCheckCircle } from "react-icons/md";
import { MenuItemBasicElement } from "./MenuItemBasicElement";

export interface ItemSelectorProps<T> extends HTMLChakraProps<'div'> {
    options: T[],
    value: T[]
    isMultiselect?: boolean,
    onSelectorValueChange?(selected: T[]): void,
    elementRenderer?(item: T): JSX.Element,
    label: string
}

export function ItemSelector<T>(props: ItemSelectorProps<T>) {

    const [selected, setSelected] = useState(props.value);
    const [selectedChanges, setChanges] = useState(0);

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

            return (<MenuItemBasicElement
                key={idx}
                borderTopRadius={borderTop}
                borderBottomRadius={borderBottom}
                onClick={onClickHandler}
                height="65px"
            >
                <Flex>
                    <>{renderedItem}</>
                    {selected.includes(it) ? <>
                        <Spacer />
                        <Box>
                            <Icon color="green.300" as={MdCheckCircle} />
                        </Box>
                    </> : null}
                </Flex>
            </MenuItemBasicElement>)
        })

        return <Box>
            <Text fontSize="14px" color="gray.200" padding="10px">{props.label}</Text>
            <>
                {inner}
            </>
        </Box>
    }, [selectedChanges, selected, props.options]);

    return result;
}