import { Box, Flex, HTMLChakraProps, useCounter, keyframes } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { MenuEntry, MenuEntryProps } from "./MenuEntry";

export interface WindowProps extends HTMLChakraProps<'div'> {
    config: AppWindowConfig
}

export enum MenuEntryType {
    Label,
    Submenu,
    Action,
    Select,
    TextInput
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
}

const AnimationDuration = 150;

const fademove = keyframes`
    50% {
        transform: translateX(30px);
        opacity: 0;
    }
    100% {
        transform: translateX(0px);
        opacity: 1;
    }
`

export function AppWindow(props: WindowProps) {

    let { children, ...rest } = props

    const [activeWindow, setActiveWindow] = useState<AppWindowConfig>(props.config);
    const [opacity, setOpacity] = useState(0);
    const [display, setDisplay] = useState("none");
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

            switch (menuItem.type) {
                case MenuEntryType.Action: {
                    menuEntryParams.onClick = menuItem._config;
                } break;
                case MenuEntryType.Submenu: {
                    menuEntryParams.submenu = true;
                    menuEntryParams.onClick = () => {
                        setActiveWindow(menuItem.children as AppWindowConfig);
                    }
                } break;
                default: {
                    console.warn(`unable to handle menu item type: ${menuItem.type}`);
                }
            }

            items.push(<MenuEntry key={keyIdx} {...menuEntryParams}>{menuItem.label}</MenuEntry>)
            keyIdx += 1;
        }

        return items;
    }

    const [content, setContent] = useState(renderMenu());

    useEffect(() => {

        increment();

        setTimeout(() => {
            setContent(renderMenu())
        }, AnimationDuration)

    }, [activeWindow]);

    return <Box width="100%" position="relative" overflow={"hidden"}>
        <Flex
            {...rest}
            direction="column"
            gap="5px"
            animation={anim}
        >{content}</Flex>
    </Box>
}