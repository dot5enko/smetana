import { Box, Flex, HTMLChakraProps, Icon } from "@chakra-ui/react"
import { MdCheck, MdCheckCircle } from "react-icons/md";
import { If } from "./If";
import { InputGenericProps } from "./InputGeneric";
import { MenuItemBasicElement } from "./MenuItemBasicElement";

export interface ColorPickerProps extends InputGenericProps<string> {
    values: string[]
}

interface ColorBlockProps {
    val: string,
    selected?: boolean,
    onClick?(e: any): void
}

export function ColorBlock(props: ColorBlockProps) {

    const { val, selected, onClick } = props;

    return <Box
        height="35px"
        width="35px"
        borderRadius="6px"
        _hover={{ opacity: 0.97 }}
        flexShrink={0}
        backgroundColor={val}
        textAlign="center"
        paddingTop="7px"
        onClick={onClick}
    >
        <If condition={selected}>
            <Icon as={MdCheckCircle} fontSize="22px" color="blackAlpha.800"></Icon>
        </If>
    </Box>
}

export const twitterColors = ['#FF6900', '#FCB900', '#7BDCB5', '#00D084', '#8ED1FC', '#0693E3', '#ABB8C3', '#EB144C', '#F78DA7', '#9900EF'];

export function ColorPicker(props: ColorPickerProps) {

    const { value, onChange, values } = props;

    return <MenuItemBasicElement>
        <Flex gap="5px" overflow={"scroll"}>
            {values.map((it, idx) => {
                return <ColorBlock key={idx} selected={value == it} val={it} onClick={() => {
                    onChange(it)
                }}></ColorBlock>
            })}
        </Flex>
    </MenuItemBasicElement>
}