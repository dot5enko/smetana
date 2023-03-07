import { Box, Flex, HTMLChakraProps, Icon, Spacer, Text } from "@chakra-ui/react";
import { useState } from "react";
import { MdArrowDropDown, MdArrowDropUp, MdKeyboardArrowRight } from "react-icons/md";
import { DataTypeField, moveDown, moveUp } from "../../../background/types/DataTypeField";
import { MenuItemBasicElement } from "../menu/MenuItemBasicElement";

export interface DataTypeFieldProps extends HTMLChakraProps<'div'> {
    item: DataTypeField
    onMoved?(): void
    movable?: boolean
}

interface ArrowBoxProps extends HTMLChakraProps<'div'> {
    boxActive: boolean
}

function ArrowBox(props: ArrowBoxProps) {

    const { boxActive, children, ...rest } = props;

    return <Box
        textAlign="center"
        border={boxActive ? "1px solid gray" : ""}
        borderRadius="4px"
        height="25px"
        width="25px"
        {...rest}
    >
        {boxActive ? children : null}
    </Box>
}

export function DataTypeField(props: DataTypeFieldProps) {

    const { item, movable, onMoved, ...rest } = props;

    return <MenuItemBasicElement borderRadius={"6px"} {...rest}>
        <Flex>
            <Box>
                <Flex>
                    <Text fontWeight="bold" color={"white"}>{item.label}</Text>
                    {item.optional ? <Text fontSize="xs" color="red">*</Text> : null}
                </Flex>
                <Text fontSize={"sm"} color="green.300">{item.field_type}</Text>
            </Box>
            <Spacer />
            <Flex direction={"column"} gap="5px" marginRight="10px">
                <ArrowBox boxActive={movable as boolean} onClick={(e) => {
                    if (movable) {
                        e.stopPropagation();

                        moveUp(item.id as number).then(() => {
                            if (props.onMoved) {
                                props.onMoved()
                            }
                        }).catch((e) => console.warn("unable to move field:", e.message));
                    }
                }}>
                    <Icon as={MdArrowDropUp}></Icon>
                </ArrowBox>
                <ArrowBox boxActive={movable as boolean} onClick={(e) => {
                    if (movable) {
                        e.stopPropagation();
                        moveDown(item.id as number).then(() => {
                            if (props.onMoved) {
                                props.onMoved()
                            }
                        }).catch((e) => console.warn("unable to move field:", e.message))
                    }
                }}>
                    <Icon as={MdArrowDropDown}></Icon>
                </ArrowBox>
            </Flex>
            <Box alignSelf="center">
                {!movable ? <Icon as={MdKeyboardArrowRight} /> : null}
            </Box>
        </Flex>
    </MenuItemBasicElement >
}