import { ResolvedFlexibleContent } from "@/acf-functions/types/components/field-props"

type Props = {
    layouts: ResolvedFlexibleContent<any>,
}

/**
 * Dynamically resolves and renders an array of mapped ACF Layout components from a resolved flexible content field.
 */
export async function RenderComponents({ layouts }: Props) {
    return layouts.map((layout, index) => <layout.Component key={index} {...layout.content}/>)
}
