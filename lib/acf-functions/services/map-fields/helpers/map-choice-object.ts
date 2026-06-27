import { ACFChoiceObject } from "@/acf-functions/types/components/field-props";

export function mapChoiceObject(return_format: 'array' | 'label' | 'value', value?: string, choices?: Choices): ACFChoiceObject | string | undefined {
    if (return_format === 'value') {
        return value;
    }
    if (!choices) return;

    const label = choices[value ?? ''];

    if (return_format === 'array') {
        const result: ACFChoiceObject = {
            label: label,
            value: value
        }
        return result;
    } else if (return_format === 'label') {
        return label;
    }
}
