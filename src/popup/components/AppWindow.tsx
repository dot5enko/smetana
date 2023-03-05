import { Box, Flex, HTMLChakraProps, useCounter, keyframes, Spacer, Icon, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { MdKeyboardBackspace } from "react-icons/md";
import { ItemSelector, ItemSelectorProps } from "./menu/ItemSelect";
import { MenuEntry, MenuEntryProps } from "./menu/MenuEntry";
import { MenuEntryType } from "./menu/MenuEntryType";
import { MenuItemBasicElement } from "./menu/MenuItemBasicElement";

export interface WindowProps extends HTMLChakraProps<'div'> {
    config: AppWindowConfig
}

export interface AppMenuEntry {
    type: MenuEntryType,
    children?: AppWindowConfig,
    label: string
    _config: any
}

export interface AppWindowConfig {
    title: string
    entries: AppMenuEntry[]
    parent?: AppWindowConfig
}

const AnimationDuration = 150;

const fademove = keyframes`
    50% {
        transform: translateX(5px);
        opacity: 0;
    }
    100% {
        transform: translateX(0px);
        opacity: 1;
    }
`

export function AppWindow(props: WindowProps) {

    let { children, ...rest } = props;

    const [activeWindow, setActiveWindow] = useState<AppWindowConfig>(props.config);

    const { increment, value: counterValue } = useCounter();
    const [anim, setAnim] = useState("");

    const spinAnimation = `${fademove} 0.3s linear`;

    function showTransitionEffect() {
        setAnim(spinAnimation);
    }

    useEffect(() => {
        if (counterValue > 1) {
            showTransitionEffect();
        }
    }, [counterValue])

    function renderMenu() {
        let items = [];
        let keyIdx = 0;

        for (let menuItem of activeWindow.entries) {

            let menuEntryParams: MenuEntryProps = {}

            let isMenu = true;

            switch (menuItem.type) {

                case MenuEntryType.Select: {
                    isMenu = false;

                    let selectorProps: ItemSelectorProps<any> = menuItem._config as ItemSelectorProps<any>;
                    selectorProps.onSelectorValueChange = (val: any) => {

                        // will it change reference ?
                        menuItem._config.value = val;

                        // go back on value change
                        setActiveWindow(activeWindow.parent as AppWindowConfig)
                    }

                    let styledSelect = <ItemSelector {...selectorProps} />;

                    items.push(styledSelect);

                } break;
                case MenuEntryType.Action: {
                    menuEntryParams.onClick = menuItem._config;
                } break;
                case MenuEntryType.Submenu: {
                    menuEntryParams.submenu = true;
                    menuEntryParams.onClick = () => {
                        let newWindow = menuItem.children as AppWindowConfig;
                        newWindow.parent = activeWindow;
                        setActiveWindow(newWindow);
                    }
                } break;
                default: {
                    console.warn(`unable to handle menu item type: ${menuItem.type}`);
                }
            }
            if (isMenu) {
                items.push(<MenuEntry key={keyIdx} {...menuEntryParams}>{menuItem.label}</MenuEntry>)
            }
            keyIdx += 1;
        }

        return <>{items}</>;
    }

    const [content, setContent] = useState(renderMenu());

    useEffect(() => {

        increment();

        setTimeout(() => {
            setContent(renderMenu())
        }, AnimationDuration)

    }, [activeWindow]);

    return <Box width="100%" position="relative" overflow={"hidden"} padding="0px 5px">
        <Box>
            <Box padding="15px 0px" height="80px">
                <Flex>
                    {activeWindow.parent ? <Box
                        cursor="pointer"
                        border="1px solid gray"
                        padding="10px 15px"
                        borderRadius="6px"
                        onClick={() => {
                            setActiveWindow(activeWindow.parent as AppWindowConfig)
                        }}
                    ><Icon as={MdKeyboardBackspace} /></Box> : null}
                    <Flex alignItems="center" paddingLeft="20px">
                        <Text>{activeWindow.title}</Text>
                    </Flex>
                    <Spacer />
                </Flex>
            </Box>
            <Flex
                {...rest}
                direction="column"
                gap="5px"
                animation={anim}
            >{content}</Flex>
        </Box>
    </Box>
}