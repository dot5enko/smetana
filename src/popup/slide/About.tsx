import { useExtensionContext } from "../components/context/ExtensionContext";
import { MenuEntry } from "../components/menu/MenuEntry";

export function AboutPage() {
    const { setSlideRoute } = useExtensionContext();
    return <MenuEntry onClick={() => setSlideRoute("")} >About</MenuEntry>
}