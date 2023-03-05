import { AppMenuEntry, AppWindowConfig } from "./AppWindow";
import { ItemSelectorProps } from "./menu/ItemSelect";
import { MenuEntryType } from "./menu/MenuEntryType";

// todo make builder 
export function Action(label: string, action: { (): void }) {
    const menu: AppMenuEntry = {
        type: MenuEntryType.Action,
        label: label,
        _config: action,
    };

    return menu;
}

export function Submenu(label: string, subwindowTitle: string, ...subitems: AppMenuEntry[]) {

    const subwindow: AppWindowConfig = {
        title: subwindowTitle,
        entries: subitems
    }

    const menu: AppMenuEntry = {
        type: MenuEntryType.Submenu,
        label: label,
        _config: null,
        children: subwindow
    };

    return menu;
}

export function Selector<T>(
    label: string,
    multiselect: boolean,
    selected: T[],
    onChange: { (selected: T[]): void },
    renderer?: { (item: T): JSX.Element },
    ...options: T[]
) {

    const selectorConfig: ItemSelectorProps<T> = {
        options: options,
        value: selected,
        isMultiselect: multiselect,
        elementRenderer: renderer,
        onSelectorValueChange: onChange,
        label: label,
    }

    const menu: AppMenuEntry = {
        type: MenuEntryType.Select,
        label: label,
        _config: selectorConfig,
    };

    return menu;
}