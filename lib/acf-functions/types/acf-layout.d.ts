type TransformACFLayout<T> = T extends any
    ? Omit<T, 'key' | 'sub_fields'> &
        ('sub_fields' extends keyof T ? { sub_fields: NextpressField[] } : [])
    : never;

/** ACF Layout without key constraints to allow key generation */
type NextpressLayout = TransformACFLayout<ACFLayout>

/**
 * Represents a layout within an ACF Flexible Content field.
 */
type ACFLayout = {
    key: string,
    name: string,
    label: string,
    display: 'table' | 'block' | 'row',
    sub_fields: ACFField[],
    min?: string,
    max?: string
}
