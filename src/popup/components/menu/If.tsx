
// for better readability
export function If(props: { condition?: boolean, children?: any }) {

    if (props.condition) {
        return props.children;
    } else {
        return null;
    }

}