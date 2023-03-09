import { useExtensionContext } from "../components/context/ExtensionContext";
import { MenuEntry } from "../components/menu/MenuEntry";

export function AboutPage() {
    const { toggleSlide } = useExtensionContext();
    return <MenuEntry onClick={() => toggleSlide("")} >About</MenuEntry>
}