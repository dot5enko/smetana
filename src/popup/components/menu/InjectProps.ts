import React from "react";

export function InjectProps(props: any) {

    const { children, ...rest } = props;
    if (children instanceof Array) {

        let newChildren = [];

        var idx = 0;
        for (var subchildren of children) {
            newChildren.push(React.cloneElement(subchildren, { key: idx, ...rest }))
            idx += 1;
        }
        return newChildren;
    } else {
        return React.cloneElement(children, { ...rest }) as any;
    }
}