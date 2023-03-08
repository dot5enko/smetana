export type ColorVariantType = 'warning' | 'default' | 'success' | 'error' | 'info'
export type SizeVariantType = 'sm' | "md" | 'lg' | 'xs'

export interface ColorVariantStyle {
    hover: {
        backgroundColor: string,
        color: string
    },
    style: {
        backgroundColor: string,
        color: string
    }
}

export function getVariantStyle(actionVariant: ColorVariantType) {

    let result: ColorVariantStyle = {
        hover: {
            backgroundColor: "",
            color: "white"
        },
        style: {
            backgroundColor: "",
            color: "white"
        }
    }

    switch (actionVariant) {

        case 'error':
            result.style.backgroundColor = "#ec404b";
            result.hover.backgroundColor = "#E81A27";

            break;
        case 'warning':

            result.style.backgroundColor = "#ff570a";
            result.hover.backgroundColor = "#E34800";
            break;
        case 'success':
            result.style.backgroundColor = "#788D04"
            result.hover.backgroundColor = "#647503";

            break;
        case 'info':
            result.style.backgroundColor = "#428dff"
            result.hover.backgroundColor = "#1472FF";
            break;

        default: {

            result.style.backgroundColor = "#363A46"
            result.style.color = "whiteAlpha.600"

            result.hover.backgroundColor = "#1E2027"
            result.hover.color = "whiteAlpha.900"

        } break;
    }

    return result
}

export interface SizeVariant {
    minHeight: any
    fontSize: any
    padding: any
}

export function getSizeVariant(variant?: SizeVariantType): SizeVariant {

    let heightVal = "65px"
    let font = "16px"
    let padding = "10px 20px"

    switch (variant) {
        case 'lg':
            heightVal = "95px"
            font = "24px"
            break;
        case 'sm':
            heightVal = "45px"
            font = "14px"
            padding = "8px 16px";
            break;
        case 'xs':
            heightVal = "25px"
            font = "14px"
            padding = "8px 16px";
            break;
        default:
            heightVal = "65px"
            font = "16px"
            padding = "10px 20px";
            break;
    }

    return { minHeight: heightVal, fontSize: font, padding };
}