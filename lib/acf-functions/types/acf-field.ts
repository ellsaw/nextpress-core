import { NextpressLayout, ACFLayout } from "./acf-layout";

type TransformACFField<T> = T extends any
    ? Omit<T, 'key' | 'layouts' | 'sub_fields'> & {
        key?: never;
        layouts?: 'layouts' extends keyof T ? NextpressLayout[] : undefined;
        sub_fields?: 'sub_fields' extends keyof T ? NextpressField[] : undefined;
    }
    : never;

/** ACF Field without key constraints to allow key generation */
export type NextpressField = TransformACFField<ACFField>;

/**
 * Represents a single Advanced Custom Fields (ACF) Field configuration.
 */
export type ACFField =
    | {
        /**
         * Unique identifier for the field with field_ prefix (e.g. 'field_abc123')
         */
        key: string
        /**
         * The label displayed for this field
         */
        label: string
        /**
         * The field name/meta_key used to save and load data (empty for layout fields like tab, accordion)
         */
        name: string
        /**
         * Accessible label for screen readers
         */
        "aria-label"?: string
        /**
         * The type of field
         */
        type: "color_picker"
        /**
         * Instructions for content editors
         */
        instructions?: string
        /**
         * Whether the field is required
         */
        required?: boolean | number
        /**
         * Conditional logic rules for field visibility. False/0/empty string to disable, or array of rule groups.
         */
        conditional_logic?: boolean | number | string | unknown[]
        /**
         * Wrapper element settings
         */
        wrapper?: {
            /**
             * Width of the field wrapper (e.g. '50' for 50%)
             */
            width?: string
            /**
             * CSS class(es) for the field wrapper
             */
            class?: string
            /**
             * HTML ID for the field wrapper
             */
            id?: string
        }
        /**
         * Order of the field within its parent
         */
        menu_order?: number
        /**
         * Parent field or field group key/ID
         */
        parent?: string | number
        /**
         * Parent layout key for flexible content sub-fields
         */
        parent_layout?: string
        default_value?: DefaultValue
        /**
         * Enable alpha/opacity selector for RGBA colors
         */
        enable_opacity?: boolean | number
        /**
         * Source for custom color palette (empty for default)
         */
        custom_palette_source?: string
        /**
         * Custom palette colors as comma-separated hex values
         */
        palette_colors?: string
        /**
         * Display the color wheel picker interface
         */
        show_color_wheel?: boolean | number
        /**
         * Value returned (hex string or RGBA array)
         */
        return_format?: "string" | "array"
    }
    | {
        /**
         * Unique identifier for the field with field_ prefix (e.g. 'field_abc123')
         */
        key: string
        /**
         * The label displayed for this field
         */
        label: string
        /**
         * The field name/meta_key used to save and load data (empty for layout fields like tab, accordion)
         */
        name: string
        /**
         * Accessible label for screen readers
         */
        "aria-label"?: string
        /**
         * The type of field
         */
        type: "date_picker"
        /**
         * Instructions for content editors
         */
        instructions?: string
        /**
         * Whether the field is required
         */
        required?: boolean | number
        /**
         * Conditional logic rules for field visibility. False/0/empty string to disable, or array of rule groups.
         */
        conditional_logic?: boolean | number | string | unknown[]
        /**
         * Wrapper element settings
         */
        wrapper?: {
            /**
             * Width of the field wrapper (e.g. '50' for 50%)
             */
            width?: string
            /**
             * CSS class(es) for the field wrapper
             */
            class?: string
            /**
             * HTML ID for the field wrapper
             */
            id?: string
        }
        /**
         * Order of the field within its parent
         */
        menu_order?: number
        /**
         * Parent field or field group key/ID
         */
        parent?: string | number
        /**
         * Parent layout key for flexible content sub-fields
         */
        parent_layout?: string
        /**
         * Date format shown to user in field UI
         */
        display_format?: string
        /**
         * Date format returned by get_field()
         */
        return_format?: string
        first_day?: FirstDay
        default_to_current_date?: DefaultToCurrentDate
    }
    | {
        /**
         * Unique identifier for the field with field_ prefix (e.g. 'field_abc123')
         */
        key: string
        /**
         * The label displayed for this field
         */
        label: string
        /**
         * The field name/meta_key used to save and load data (empty for layout fields like tab, accordion)
         */
        name: string
        /**
         * Accessible label for screen readers
         */
        "aria-label"?: string
        /**
         * The type of field
         */
        type: "date_time_picker"
        /**
         * Instructions for content editors
         */
        instructions?: string
        /**
         * Whether the field is required
         */
        required?: boolean | number
        /**
         * Conditional logic rules for field visibility. False/0/empty string to disable, or array of rule groups.
         */
        conditional_logic?: boolean | number | string | unknown[]
        /**
         * Wrapper element settings
         */
        wrapper?: {
            /**
             * Width of the field wrapper (e.g. '50' for 50%)
             */
            width?: string
            /**
             * CSS class(es) for the field wrapper
             */
            class?: string
            /**
             * HTML ID for the field wrapper
             */
            id?: string
        }
        /**
         * Order of the field within its parent
         */
        menu_order?: number
        /**
         * Parent field or field group key/ID
         */
        parent?: string | number
        /**
         * Parent layout key for flexible content sub-fields
         */
        parent_layout?: string
        /**
         * Date/time format shown to user in field UI
         */
        display_format?: string
        /**
         * Date/time format returned by get_field()
         */
        return_format?: string
        first_day?: FirstDay
        default_to_current_date?: DefaultToCurrentDate
    }
    | {
        /**
         * Unique identifier for the field with field_ prefix (e.g. 'field_abc123')
         */
        key: string
        /**
         * The label displayed for this field
         */
        label: string
        /**
         * The field name/meta_key used to save and load data (empty for layout fields like tab, accordion)
         */
        name: string
        /**
         * Accessible label for screen readers
         */
        "aria-label"?: string
        /**
         * The type of field
         */
        type: "google_map"
        /**
         * Instructions for content editors
         */
        instructions?: string
        /**
         * Whether the field is required
         */
        required?: boolean | number
        /**
         * Conditional logic rules for field visibility. False/0/empty string to disable, or array of rule groups.
         */
        conditional_logic?: boolean | number | string | unknown[]
        /**
         * Wrapper element settings
         */
        wrapper?: {
            /**
             * Width of the field wrapper (e.g. '50' for 50%)
             */
            width?: string
            /**
             * CSS class(es) for the field wrapper
             */
            class?: string
            /**
             * HTML ID for the field wrapper
             */
            id?: string
        }
        /**
         * Order of the field within its parent
         */
        menu_order?: number
        /**
         * Parent field or field group key/ID
         */
        parent?: string | number
        /**
         * Parent layout key for flexible content sub-fields
         */
        parent_layout?: string
        /**
         * Map height in pixels (empty uses default 400)
         */
        height?: string
        /**
         * Initial map center latitude (empty uses default)
         */
        center_lat?: string
        /**
         * Initial map center longitude (empty uses default)
         */
        center_lng?: string
        /**
         * Initial map zoom level (empty uses default 14)
         */
        zoom?: string
    }
    | {
        /**
         * Unique identifier for the field with field_ prefix (e.g. 'field_abc123')
         */
        key: string
        /**
         * The label displayed for this field
         */
        label: string
        /**
         * The field name/meta_key used to save and load data (empty for layout fields like tab, accordion)
         */
        name: string
        /**
         * Accessible label for screen readers
         */
        "aria-label"?: string
        /**
         * The type of field
         */
        type: "icon_picker"
        /**
         * Instructions for content editors
         */
        instructions?: string
        /**
         * Whether the field is required
         */
        required?: boolean | number
        /**
         * Conditional logic rules for field visibility. False/0/empty string to disable, or array of rule groups.
         */
        conditional_logic?: boolean | number | string | unknown[]
        /**
         * Wrapper element settings
         */
        wrapper?: {
            /**
             * Width of the field wrapper (e.g. '50' for 50%)
             */
            width?: string
            /**
             * CSS class(es) for the field wrapper
             */
            class?: string
            /**
             * HTML ID for the field wrapper
             */
            id?: string
        }
        /**
         * Order of the field within its parent
         */
        menu_order?: number
        /**
         * Parent field or field group key/ID
         */
        parent?: string | number
        /**
         * Parent layout key for flexible content sub-fields
         */
        parent_layout?: string
        /**
         * Icon library source (all or specific library)
         */
        library?: string
        /**
         * Available tabs for icon selection
         */
        tabs?: unknown[]
        /**
         * Value returned (string or structured data)
         */
        return_format?: 'string' | 'array'
        /**
         * Default icon value with type and value properties
         */
        default_value?: {
            /**
             * Icon type (dashicons, media_library, url)
             */
            type?: string | null
            /**
             * Icon value (icon class, attachment ID, or URL)
             */
            value?: string | null
            [k: string]: unknown
        }
    }
    | {
        /**
         * Unique identifier for the field with field_ prefix (e.g. 'field_abc123')
         */
        key: string
        /**
         * The label displayed for this field
         */
        label: string
        /**
         * The field name/meta_key used to save and load data (empty for layout fields like tab, accordion)
         */
        name: string
        /**
         * Accessible label for screen readers
         */
        "aria-label"?: string
        /**
         * The type of field
         */
        type: "time_picker"
        /**
         * Instructions for content editors
         */
        instructions?: string
        /**
         * Whether the field is required
         */
        required?: boolean | number
        /**
         * Conditional logic rules for field visibility. False/0/empty string to disable, or array of rule groups.
         */
        conditional_logic?: boolean | number | string | unknown[]
        /**
         * Wrapper element settings
         */
        wrapper?: {
            /**
             * Width of the field wrapper (e.g. '50' for 50%)
             */
            width?: string
            /**
             * CSS class(es) for the field wrapper
             */
            class?: string
            /**
             * HTML ID for the field wrapper
             */
            id?: string
        }
        /**
         * Order of the field within its parent
         */
        menu_order?: number
        /**
         * Parent field or field group key/ID
         */
        parent?: string | number
        /**
         * Parent layout key for flexible content sub-fields
         */
        parent_layout?: string
        /**
         * Time format shown to user in field UI
         */
        display_format?: string
        /**
         * Time format returned by get_field()
         */
        return_format?: string
    }
    | {
        /**
         * Unique identifier for the field with field_ prefix (e.g. 'field_abc123')
         */
        key: string
        /**
         * The label displayed for this field
         */
        label: string
        /**
         * The field name/meta_key used to save and load data (empty for layout fields like tab, accordion)
         */
        name: string
        /**
         * Accessible label for screen readers
         */
        "aria-label"?: string
        /**
         * The type of field
         */
        type: "email"
        /**
         * Instructions for content editors
         */
        instructions?: string
        /**
         * Whether the field is required
         */
        required?: boolean | number
        /**
         * Conditional logic rules for field visibility. False/0/empty string to disable, or array of rule groups.
         */
        conditional_logic?: boolean | number | string | unknown[]
        /**
         * Wrapper element settings
         */
        wrapper?: {
            /**
             * Width of the field wrapper (e.g. '50' for 50%)
             */
            width?: string
            /**
             * CSS class(es) for the field wrapper
             */
            class?: string
            /**
             * HTML ID for the field wrapper
             */
            id?: string
        }
        /**
         * Order of the field within its parent
         */
        menu_order?: number
        /**
         * Parent field or field group key/ID
         */
        parent?: string | number
        /**
         * Parent layout key for flexible content sub-fields
         */
        parent_layout?: string
        default_value?: DefaultValue
        placeholder?: Placeholder
        prepend?: Prepend
        append?: Append
    }
    | {
        /**
         * Unique identifier for the field with field_ prefix (e.g. 'field_abc123')
         */
        key: string
        /**
         * The label displayed for this field
         */
        label: string
        /**
         * The field name/meta_key used to save and load data (empty for layout fields like tab, accordion)
         */
        name: string
        /**
         * Accessible label for screen readers
         */
        "aria-label"?: string
        /**
         * The type of field
         */
        type: "number"
        /**
         * Instructions for content editors
         */
        instructions?: string
        /**
         * Whether the field is required
         */
        required?: boolean | number
        /**
         * Conditional logic rules for field visibility. False/0/empty string to disable, or array of rule groups.
         */
        conditional_logic?: boolean | number | string | unknown[]
        /**
         * Wrapper element settings
         */
        wrapper?: {
            /**
             * Width of the field wrapper (e.g. '50' for 50%)
             */
            width?: string
            /**
             * CSS class(es) for the field wrapper
             */
            class?: string
            /**
             * HTML ID for the field wrapper
             */
            id?: string
        }
        /**
         * Order of the field within its parent
         */
        menu_order?: number
        /**
         * Parent field or field group key/ID
         */
        parent?: string | number
        /**
         * Parent layout key for flexible content sub-fields
         */
        parent_layout?: string
        default_value?: DefaultValueNumeric
        /**
         * Minimum value (empty string for unlimited)
         */
        min?: number | string
        /**
         * Maximum value (empty string for unlimited)
         */
        max?: number | string
        /**
         * Step increment (empty string for default, 'any' for no restriction)
         */
        step?: number | string
        placeholder?: Placeholder
        prepend?: Prepend
        append?: Append
    }
    | {
        /**
         * Unique identifier for the field with field_ prefix (e.g. 'field_abc123')
         */
        key: string
        /**
         * The label displayed for this field
         */
        label: string
        /**
         * The field name/meta_key used to save and load data (empty for layout fields like tab, accordion)
         */
        name: string
        /**
         * Accessible label for screen readers
         */
        "aria-label"?: string
        /**
         * The type of field
         */
        type: "password"
        /**
         * Instructions for content editors
         */
        instructions?: string
        /**
         * Whether the field is required
         */
        required?: boolean | number
        /**
         * Conditional logic rules for field visibility. False/0/empty string to disable, or array of rule groups.
         */
        conditional_logic?: boolean | number | string | unknown[]
        /**
         * Wrapper element settings
         */
        wrapper?: {
            /**
             * Width of the field wrapper (e.g. '50' for 50%)
             */
            width?: string
            /**
             * CSS class(es) for the field wrapper
             */
            class?: string
            /**
             * HTML ID for the field wrapper
             */
            id?: string
        }
        /**
         * Order of the field within its parent
         */
        menu_order?: number
        /**
         * Parent field or field group key/ID
         */
        parent?: string | number
        /**
         * Parent layout key for flexible content sub-fields
         */
        parent_layout?: string
        placeholder?: Placeholder
        prepend?: Prepend
        append?: Append
    }
    | {
        /**
         * Unique identifier for the field with field_ prefix (e.g. 'field_abc123')
         */
        key: string
        /**
         * The label displayed for this field
         */
        label: string
        /**
         * The field name/meta_key used to save and load data (empty for layout fields like tab, accordion)
         */
        name: string
        /**
         * Accessible label for screen readers
         */
        "aria-label"?: string
        /**
         * The type of field
         */
        type: "range"
        /**
         * Instructions for content editors
         */
        instructions?: string
        /**
         * Whether the field is required
         */
        required?: boolean | number
        /**
         * Conditional logic rules for field visibility. False/0/empty string to disable, or array of rule groups.
         */
        conditional_logic?: boolean | number | string | unknown[]
        /**
         * Wrapper element settings
         */
        wrapper?: {
            /**
             * Width of the field wrapper (e.g. '50' for 50%)
             */
            width?: string
            /**
             * CSS class(es) for the field wrapper
             */
            class?: string
            /**
             * HTML ID for the field wrapper
             */
            id?: string
        }
        /**
         * Order of the field within its parent
         */
        menu_order?: number
        /**
         * Parent field or field group key/ID
         */
        parent?: string | number
        /**
         * Parent layout key for flexible content sub-fields
         */
        parent_layout?: string
        default_value?: DefaultValueNumeric
        /**
         * Minimum value (empty string for unlimited)
         */
        min?: number | string
        /**
         * Maximum value (empty string for unlimited)
         */
        max?: number | string
        /**
         * Step increment (empty string for default, 'any' for no restriction)
         */
        step?: number | string
        placeholder?: Placeholder
        prepend?: Prepend
        append?: Append
    }
    | {
        /**
         * Unique identifier for the field with field_ prefix (e.g. 'field_abc123')
         */
        key: string
        /**
         * The label displayed for this field
         */
        label: string
        /**
         * The field name/meta_key used to save and load data (empty for layout fields like tab, accordion)
         */
        name: string
        /**
         * Accessible label for screen readers
         */
        "aria-label"?: string
        /**
         * The type of field
         */
        type: "text"
        /**
         * Instructions for content editors
         */
        instructions?: string
        /**
         * Whether the field is required
         */
        required?: boolean | number
        /**
         * Conditional logic rules for field visibility. False/0/empty string to disable, or array of rule groups.
         */
        conditional_logic?: boolean | number | string | unknown[]
        /**
         * Wrapper element settings
         */
        wrapper?: {
            /**
             * Width of the field wrapper (e.g. '50' for 50%)
             */
            width?: string
            /**
             * CSS class(es) for the field wrapper
             */
            class?: string
            /**
             * HTML ID for the field wrapper
             */
            id?: string
        }
        /**
         * Order of the field within its parent
         */
        menu_order?: number
        /**
         * Parent field or field group key/ID
         */
        parent?: string | number
        /**
         * Parent layout key for flexible content sub-fields
         */
        parent_layout?: string
        default_value?: DefaultValue
        maxlength?: Maxlength
        placeholder?: Placeholder
        prepend?: Prepend
        append?: Append
    }
    | {
        /**
         * Unique identifier for the field with field_ prefix (e.g. 'field_abc123')
         */
        key: string
        /**
         * The label displayed for this field
         */
        label: string
        /**
         * The field name/meta_key used to save and load data (empty for layout fields like tab, accordion)
         */
        name: string
        /**
         * Accessible label for screen readers
         */
        "aria-label"?: string
        /**
         * The type of field
         */
        type: "textarea"
        /**
         * Instructions for content editors
         */
        instructions?: string
        /**
         * Whether the field is required
         */
        required?: boolean | number
        /**
         * Conditional logic rules for field visibility. False/0/empty string to disable, or array of rule groups.
         */
        conditional_logic?: boolean | number | string | unknown[]
        /**
         * Wrapper element settings
         */
        wrapper?: {
            /**
             * Width of the field wrapper (e.g. '50' for 50%)
             */
            width?: string
            /**
             * CSS class(es) for the field wrapper
             */
            class?: string
            /**
             * HTML ID for the field wrapper
             */
            id?: string
        }
        /**
         * Order of the field within its parent
         */
        menu_order?: number
        /**
         * Parent field or field group key/ID
         */
        parent?: string | number
        /**
         * Parent layout key for flexible content sub-fields
         */
        parent_layout?: string
        default_value?: DefaultValue
        maxlength?: Maxlength
        rows?: Rows
        placeholder?: Placeholder
        new_lines?: NewLines
    }
    | {
        /**
         * Unique identifier for the field with field_ prefix (e.g. 'field_abc123')
         */
        key: string
        /**
         * The label displayed for this field
         */
        label: string
        /**
         * The field name/meta_key used to save and load data (empty for layout fields like tab, accordion)
         */
        name: string
        /**
         * Accessible label for screen readers
         */
        "aria-label"?: string
        /**
         * The type of field
         */
        type: "url"
        /**
         * Instructions for content editors
         */
        instructions?: string
        /**
         * Whether the field is required
         */
        required?: boolean | number
        /**
         * Conditional logic rules for field visibility. False/0/empty string to disable, or array of rule groups.
         */
        conditional_logic?: boolean | number | string | unknown[]
        /**
         * Wrapper element settings
         */
        wrapper?: {
            /**
             * Width of the field wrapper (e.g. '50' for 50%)
             */
            width?: string
            /**
             * CSS class(es) for the field wrapper
             */
            class?: string
            /**
             * HTML ID for the field wrapper
             */
            id?: string
        }
        /**
         * Order of the field within its parent
         */
        menu_order?: number
        /**
         * Parent field or field group key/ID
         */
        parent?: string | number
        /**
         * Parent layout key for flexible content sub-fields
         */
        parent_layout?: string
        default_value?: DefaultValue
        placeholder?: Placeholder
    }
    | {
        /**
         * Unique identifier for the field with field_ prefix (e.g. 'field_abc123')
         */
        key: string
        /**
         * The label displayed for this field
         */
        label: string
        /**
         * The field name/meta_key used to save and load data (empty for layout fields like tab, accordion)
         */
        name: string
        /**
         * Accessible label for screen readers
         */
        "aria-label"?: string
        /**
         * The type of field
         */
        type: "button_group"
        /**
         * Instructions for content editors
         */
        instructions?: string
        /**
         * Whether the field is required
         */
        required?: boolean | number
        /**
         * Conditional logic rules for field visibility. False/0/empty string to disable, or array of rule groups.
         */
        conditional_logic?: boolean | number | string | unknown[]
        /**
         * Wrapper element settings
         */
        wrapper?: {
            /**
             * Width of the field wrapper (e.g. '50' for 50%)
             */
            width?: string
            /**
             * CSS class(es) for the field wrapper
             */
            class?: string
            /**
             * HTML ID for the field wrapper
             */
            id?: string
        }
        /**
         * Order of the field within its parent
         */
        menu_order?: number
        /**
         * Parent field or field group key/ID
         */
        parent?: string | number
        /**
         * Parent layout key for flexible content sub-fields
         */
        parent_layout?: string
        choices?: Choices
        default_value?: DefaultValue
        return_format?: ReturnFormatChoice
        /**
         * Layout direction for button choices
         */
        layout?: "vertical" | "horizontal"
        allow_null?: AllowNull
    }
    | {
        /**
         * Unique identifier for the field with field_ prefix (e.g. 'field_abc123')
         */
        key: string
        /**
         * The label displayed for this field
         */
        label: string
        /**
         * The field name/meta_key used to save and load data (empty for layout fields like tab, accordion)
         */
        name: string
        /**
         * Accessible label for screen readers
         */
        "aria-label"?: string
        /**
         * The type of field
         */
        type: "checkbox"
        /**
         * Instructions for content editors
         */
        instructions?: string
        /**
         * Whether the field is required
         */
        required?: boolean | number
        /**
         * Conditional logic rules for field visibility. False/0/empty string to disable, or array of rule groups.
         */
        conditional_logic?: boolean | number | string | unknown[]
        /**
         * Wrapper element settings
         */
        wrapper?: {
            /**
             * Width of the field wrapper (e.g. '50' for 50%)
             */
            width?: string
            /**
             * CSS class(es) for the field wrapper
             */
            class?: string
            /**
             * HTML ID for the field wrapper
             */
            id?: string
        }
        /**
         * Order of the field within its parent
         */
        menu_order?: number
        /**
         * Parent field or field group key/ID
         */
        parent?: string | number
        /**
         * Parent layout key for flexible content sub-fields
         */
        parent_layout?: string
        choices?: Choices
        default_value?: DefaultValueMulti
        return_format?: ReturnFormatChoice
        layout?: LayoutChoice
        /**
         * Show a toggle all checkbox (1 for yes, 0 for no)
         */
        toggle?: number
        /**
         * Allow custom values to be added (1 for yes, 0 for no)
         */
        allow_custom?: number
        /**
         * Save custom values to the field choices (1 for yes, 0 for no)
         */
        save_custom?: number
        /**
         * Text for the add custom choice button (translatable)
         */
        custom_choice_button_text?: string
    } | {
        /**
         * Unique identifier for the field with field_ prefix (e.g. 'field_abc123')
         */
        key: string
        /**
         * The label displayed for this field
         */
        label: string
        /**
         * The field name/meta_key used to save and load data (empty for layout fields like tab, accordion)
         */
        name: string
        /**
         * Accessible label for screen readers
         */
        "aria-label"?: string
        /**
         * The type of field
         */
        type: "radio"
        /**
         * Instructions for content editors
         */
        instructions?: string
        /**
         * Whether the field is required
         */
        required?: boolean | number
        /**
         * Conditional logic rules for field visibility. False/0/empty string to disable, or array of rule groups.
         */
        conditional_logic?: boolean | number | string | unknown[]
        /**
         * Wrapper element settings
         */
        wrapper?: {
            /**
             * Width of the field wrapper (e.g. '50' for 50%)
             */
            width?: string
            /**
             * CSS class(es) for the field wrapper
             */
            class?: string
            /**
             * HTML ID for the field wrapper
             */
            id?: string
        }
        /**
         * Order of the field within its parent
         */
        menu_order?: number
        /**
         * Parent field or field group key/ID
         */
        parent?: string | number
        /**
         * Parent layout key for flexible content sub-fields
         */
        parent_layout?: string
        choices?: Choices
        default_value?: DefaultValue
        return_format?: ReturnFormatChoice
        layout?: LayoutChoice
        allow_null?: AllowNull
        /**
         * Add an other choice with text input (1 for yes, 0 for no)
         */
        other_choice?: number
        /**
         * Save other choice values to the field choices (1 for yes, 0 for no)
         */
        save_other_choice?: number
    }
    | {
        /**
         * Unique identifier for the field with field_ prefix (e.g. 'field_abc123')
         */
        key: string
        /**
         * The label displayed for this field
         */
        label: string
        /**
         * The field name/meta_key used to save and load data (empty for layout fields like tab, accordion)
         */
        name: string
        /**
         * Accessible label for screen readers
         */
        "aria-label"?: string
        /**
         * The type of field
         */
        type: "select"
        /**
         * Instructions for content editors
         */
        instructions?: string
        /**
         * Whether the field is required
         */
        required?: boolean | number
        /**
         * Conditional logic rules for field visibility. False/0/empty string to disable, or array of rule groups.
         */
        conditional_logic?: boolean | number | string | unknown[]
        /**
         * Wrapper element settings
         */
        wrapper?: {
            /**
             * Width of the field wrapper (e.g. '50' for 50%)
             */
            width?: string
            /**
             * CSS class(es) for the field wrapper
             */
            class?: string
            /**
             * HTML ID for the field wrapper
             */
            id?: string
        }
        /**
         * Order of the field within its parent
         */
        menu_order?: number
        /**
         * Parent field or field group key/ID
         */
        parent?: string | number
        /**
         * Parent layout key for flexible content sub-fields
         */
        parent_layout?: string
        choices?: Choices
        default_value?: DefaultValueMulti
        return_format?: ReturnFormatChoice
        multiple?: Multiple
        allow_null?: AllowNull
        placeholder?: Placeholder
        /**
         * Use enhanced Select2 UI (1 for yes, 0 for no)
         */
        ui?: number
        /**
         * Use AJAX to lazy load choices (1 for yes, 0 for no)
         */
        ajax?: number
        /**
         * Allow new options to be created while editing (1 for yes, 0 for no)
         */
        create_options?: number
        /**
         * Save newly created options to the field choices (1 for yes, 0 for no)
         */
        save_options?: number
    }
    | {
        /**
         * Unique identifier for the field with field_ prefix (e.g. 'field_abc123')
         */
        key: string
        /**
         * The label displayed for this field
         */
        label: string
        /**
         * The field name/meta_key used to save and load data (empty for layout fields like tab, accordion)
         */
        name: string
        /**
         * Accessible label for screen readers
         */
        "aria-label"?: string
        /**
         * The type of field
         */
        type: "true_false"
        /**
         * Instructions for content editors
         */
        instructions?: string
        /**
         * Whether the field is required
         */
        required?: boolean | number
        /**
         * Conditional logic rules for field visibility. False/0/empty string to disable, or array of rule groups.
         */
        conditional_logic?: boolean | number | string | unknown[]
        /**
         * Wrapper element settings
         */
        wrapper?: {
            /**
             * Width of the field wrapper (e.g. '50' for 50%)
             */
            width?: string
            /**
             * CSS class(es) for the field wrapper
             */
            class?: string
            /**
             * HTML ID for the field wrapper
             */
            id?: string
        }
        /**
         * Order of the field within its parent
         */
        menu_order?: number
        /**
         * Parent field or field group key/ID
         */
        parent?: string | number
        /**
         * Parent layout key for flexible content sub-fields
         */
        parent_layout?: string
        /**
         * Default state (0 for off, 1 for on)
         */
        default_value?: number
        /**
         * Text displayed alongside the checkbox
         */
        message?: string
        /**
         * Use stylized toggle UI (1 for yes, 0 for no)
         */
        ui?: number
        /**
         * Text shown when toggle is on (empty for default 'Yes')
         */
        ui_on_text?: string
        /**
         * Text shown when toggle is off (empty for default 'No')
         */
        ui_off_text?: string
    }
    | {
        /**
         * Unique identifier for the field with field_ prefix (e.g. 'field_abc123')
         */
        key: string
        /**
         * The label displayed for this field
         */
        label: string
        /**
         * The field name/meta_key used to save and load data (empty for layout fields like tab, accordion)
         */
        name: string
        /**
         * Accessible label for screen readers
         */
        "aria-label"?: string
        /**
         * The type of field
         */
        type: "file"
        /**
         * Instructions for content editors
         */
        instructions?: string
        /**
         * Whether the field is required
         */
        required?: boolean | number
        /**
         * Conditional logic rules for field visibility. False/0/empty string to disable, or array of rule groups.
         */
        conditional_logic?: boolean | number | string | unknown[]
        /**
         * Wrapper element settings
         */
        wrapper?: {
            /**
             * Width of the field wrapper (e.g. '50' for 50%)
             */
            width?: string
            /**
             * CSS class(es) for the field wrapper
             */
            class?: string
            /**
             * HTML ID for the field wrapper
             */
            id?: string
        }
        /**
         * Order of the field within its parent
         */
        menu_order?: number
        /**
         * Parent field or field group key/ID
         */
        parent?: string | number
        /**
         * Parent layout key for flexible content sub-fields
         */
        parent_layout?: string
        return_format?: ReturnFormatMedia
        library?: Library
        min_size?: MinSize
        max_size?: MaxSize
        mime_types?: MimeTypes
    }
    | {
        /**
         * Unique identifier for the field with field_ prefix (e.g. 'field_abc123')
         */
        key: string
        /**
         * The label displayed for this field
         */
        label: string
        /**
         * The field name/meta_key used to save and load data (empty for layout fields like tab, accordion)
         */
        name: string
        /**
         * Accessible label for screen readers
         */
        "aria-label"?: string
        /**
         * The type of field
         */
        type: "gallery"
        /**
         * Instructions for content editors
         */
        instructions?: string
        /**
         * Whether the field is required
         */
        required?: boolean | number
        /**
         * Conditional logic rules for field visibility. False/0/empty string to disable, or array of rule groups.
         */
        conditional_logic?: boolean | number | string | unknown[]
        /**
         * Wrapper element settings
         */
        wrapper?: {
            /**
             * Width of the field wrapper (e.g. '50' for 50%)
             */
            width?: string
            /**
             * CSS class(es) for the field wrapper
             */
            class?: string
            /**
             * HTML ID for the field wrapper
             */
            id?: string
        }
        /**
         * Order of the field within its parent
         */
        menu_order?: number
        /**
         * Parent field or field group key/ID
         */
        parent?: string | number
        /**
         * Parent layout key for flexible content sub-fields
         */
        parent_layout?: string
        return_format?: ReturnFormatMedia
        preview_size?: PreviewSize
        library?: Library
        min_width?: MinWidth
        min_height?: MinHeight
        min_size?: MinSize
        max_width?: MaxWidth
        max_height?: MaxHeight
        max_size?: MaxSize
        mime_types?: MimeTypes
        min?: Min
        max?: Max
        /**
         * Where to insert new images (append or prepend)
         */
        insert?: "append" | "prepend"
    }
    | {
        /**
         * Unique identifier for the field with field_ prefix (e.g. 'field_abc123')
         */
        key: string
        /**
         * The label displayed for this field
         */
        label: string
        /**
         * The field name/meta_key used to save and load data (empty for layout fields like tab, accordion)
         */
        name: string
        /**
         * Accessible label for screen readers
         */
        "aria-label"?: string
        /**
         * The type of field
         */
        type: "image"
        /**
         * Instructions for content editors
         */
        instructions?: string
        /**
         * Whether the field is required
         */
        required?: boolean | number
        /**
         * Conditional logic rules for field visibility. False/0/empty string to disable, or array of rule groups.
         */
        conditional_logic?: boolean | number | string | unknown[]
        /**
         * Wrapper element settings
         */
        wrapper?: {
            /**
             * Width of the field wrapper (e.g. '50' for 50%)
             */
            width?: string
            /**
             * CSS class(es) for the field wrapper
             */
            class?: string
            /**
             * HTML ID for the field wrapper
             */
            id?: string
        }
        /**
         * Order of the field within its parent
         */
        menu_order?: number
        /**
         * Parent field or field group key/ID
         */
        parent?: string | number
        /**
         * Parent layout key for flexible content sub-fields
         */
        parent_layout?: string
        return_format?: ReturnFormatMedia
        preview_size?: PreviewSize
        library?: Library
        min_width?: MinWidth
        min_height?: MinHeight
        min_size?: MinSize
        max_width?: MaxWidth
        max_height?: MaxHeight
        max_size?: MaxSize
        mime_types?: MimeTypes
    }
    | {
        /**
         * Unique identifier for the field with field_ prefix (e.g. 'field_abc123')
         */
        key: string
        /**
         * The label displayed for this field
         */
        label: string
        /**
         * The field name/meta_key used to save and load data (empty for layout fields like tab, accordion)
         */
        name: string
        /**
         * Accessible label for screen readers
         */
        "aria-label"?: string
        /**
         * The type of field
         */
        type: "oembed"
        /**
         * Instructions for content editors
         */
        instructions?: string
        /**
         * Whether the field is required
         */
        required?: boolean | number
        /**
         * Conditional logic rules for field visibility. False/0/empty string to disable, or array of rule groups.
         */
        conditional_logic?: boolean | number | string | unknown[]
        /**
         * Wrapper element settings
         */
        wrapper?: {
            /**
             * Width of the field wrapper (e.g. '50' for 50%)
             */
            width?: string
            /**
             * CSS class(es) for the field wrapper
             */
            class?: string
            /**
             * HTML ID for the field wrapper
             */
            id?: string
        }
        /**
         * Order of the field within its parent
         */
        menu_order?: number
        /**
         * Parent field or field group key/ID
         */
        parent?: string | number
        /**
         * Parent layout key for flexible content sub-fields
         */
        parent_layout?: string
        /**
         * Maximum width of embedded content in pixels (empty for default)
         */
        width?: string
        /**
         * Maximum height of embedded content in pixels (empty for default)
         */
        height?: string
    }
    | {
        /**
         * Unique identifier for the field with field_ prefix (e.g. 'field_abc123')
         */
        key: string
        /**
         * The label displayed for this field
         */
        label: string
        /**
         * The field name/meta_key used to save and load data (empty for layout fields like tab, accordion)
         */
        name: string
        /**
         * Accessible label for screen readers
         */
        "aria-label"?: string
        /**
         * The type of field
         */
        type: "wysiwyg"
        /**
         * Instructions for content editors
         */
        instructions?: string
        /**
         * Whether the field is required
         */
        required?: boolean | number
        /**
         * Conditional logic rules for field visibility. False/0/empty string to disable, or array of rule groups.
         */
        conditional_logic?: boolean | number | string | unknown[]
        /**
         * Wrapper element settings
         */
        wrapper?: {
            /**
             * Width of the field wrapper (e.g. '50' for 50%)
             */
            width?: string
            /**
             * CSS class(es) for the field wrapper
             */
            class?: string
            /**
             * HTML ID for the field wrapper
             */
            id?: string
        }
        /**
         * Order of the field within its parent
         */
        menu_order?: number
        /**
         * Parent field or field group key/ID
         */
        parent?: string | number
        /**
         * Parent layout key for flexible content sub-fields
         */
        parent_layout?: string
        default_value?: DefaultValue
        /**
         * Which editor tabs to show (all, visual only, or text only)
         */
        tabs?: "all" | "visual" | "text"
        /**
         * Toolbar configuration (full or basic)
         */
        toolbar?: string
        /**
         * Show media upload button (1 for yes, 0 for no)
         */
        media_upload?: number
        /**
         * Delay TinyMCE initialization until field is clicked (1 for yes, 0 for no)
         */
        delay?: number
    }
    | {
        /**
         * Unique identifier for the field with field_ prefix (e.g. 'field_abc123')
         */
        key: string
        /**
         * The label displayed for this field
         */
        label: string
        /**
         * The field name/meta_key used to save and load data (empty for layout fields like tab, accordion)
         */
        name: string
        /**
         * Accessible label for screen readers
         */
        "aria-label"?: string
        /**
         * The type of field
         */
        type: "accordion"
        /**
         * Instructions for content editors
         */
        instructions?: string
        /**
         * Whether the field is required
         */
        required?: boolean | number
        /**
         * Conditional logic rules for field visibility. False/0/empty string to disable, or array of rule groups.
         */
        conditional_logic?: boolean | number | string | unknown[]
        /**
         * Wrapper element settings
         */
        wrapper?: {
            /**
             * Width of the field wrapper (e.g. '50' for 50%)
             */
            width?: string
            /**
             * CSS class(es) for the field wrapper
             */
            class?: string
            /**
             * HTML ID for the field wrapper
             */
            id?: string
        }
        /**
         * Order of the field within its parent
         */
        menu_order?: number
        /**
         * Parent field or field group key/ID
         */
        parent?: string | number
        /**
         * Parent layout key for flexible content sub-fields
         */
        parent_layout?: string
        /**
         * Display this accordion as open on page load
         */
        open?: number
        /**
         * Allow this accordion to open without closing others
         */
        multi_expand?: number
        endpoint?: Endpoint
    }| {
        /**
         * Unique identifier for the field with field_ prefix (e.g. 'field_abc123')
         */
        key: string
        /**
         * The label displayed for this field
         */
        label: string
        /**
         * The field name/meta_key used to save and load data (empty for layout fields like tab, accordion)
         */
        name: string
        /**
         * Accessible label for screen readers
         */
        "aria-label"?: string
        /**
         * The type of field
         */
        type: "flexible_content"
        /**
         * Instructions for content editors
         */
        instructions?: string
        /**
         * Whether the field is required
         */
        required?: boolean | number
        /**
         * Conditional logic rules for field visibility. False/0/empty string to disable, or array of rule groups.
         */
        conditional_logic?: boolean | number | string | unknown[]
        /**
         * Wrapper element settings
         */
        wrapper?: {
            /**
             * Width of the field wrapper (e.g. '50' for 50%)
             */
            width?: string
            /**
             * CSS class(es) for the field wrapper
             */
            class?: string
            /**
             * HTML ID for the field wrapper
             */
            id?: string
        }
        /**
         * Order of the field within its parent
         */
        menu_order?: number
        /**
         * Parent field or field group key/ID
         */
        parent?: string | number
        /**
         * Parent layout key for flexible content sub-fields
         */
        parent_layout?: string
        /**
         * Available layout configurations
         */
        layouts?: ACFLayout[]
        /**
         * Minimum number of layouts (empty for no limit)
         */
        min?: number | string
        /**
         * Maximum number of layouts (empty for no limit)
         */
        max?: number | string
        /**
         * Text label for the add row button
         */
        button_label?: string
    }
    | {
        /**
         * Unique identifier for the field with field_ prefix (e.g. 'field_abc123')
         */
        key: string
        /**
         * The label displayed for this field
         */
        label: string
        /**
         * The field name/meta_key used to save and load data (empty for layout fields like tab, accordion)
         */
        name: string
        /**
         * Accessible label for screen readers
         */
        "aria-label"?: string
        /**
         * The type of field
         */
        type: "group"
        /**
         * Instructions for content editors
         */
        instructions?: string
        /**
         * Whether the field is required
         */
        required?: boolean | number
        /**
         * Conditional logic rules for field visibility. False/0/empty string to disable, or array of rule groups.
         */
        conditional_logic?: boolean | number | string | unknown[]
        /**
         * Wrapper element settings
         */
        wrapper?: {
            /**
             * Width of the field wrapper (e.g. '50' for 50%)
             */
            width?: string
            /**
             * CSS class(es) for the field wrapper
             */
            class?: string
            /**
             * HTML ID for the field wrapper
             */
            id?: string
        }
        /**
         * Order of the field within its parent
         */
        menu_order?: number
        /**
         * Parent field or field group key/ID
         */
        parent?: string | number
        /**
         * Parent layout key for flexible content sub-fields
         */
        parent_layout?: string
        sub_fields?: SubFields
        /**
         * Visual layout style for rendering fields
         */
        layout?: "block" | "table" | "row"
    }
    | {
        /**
         * Unique identifier for the field with field_ prefix (e.g. 'field_abc123')
         */
        key: string
        /**
         * The label displayed for this field
         */
        label: string
        /**
         * The field name/meta_key used to save and load data (empty for layout fields like tab, accordion)
         */
        name: string
        /**
         * Accessible label for screen readers
         */
        "aria-label"?: string
        /**
         * The type of field
         */
        type: "message"
        /**
         * Instructions for content editors
         */
        instructions?: string
        /**
         * Whether the field is required
         */
        required?: boolean | number
        /**
         * Conditional logic rules for field visibility. False/0/empty string to disable, or array of rule groups.
         */
        conditional_logic?: boolean | number | string | unknown[]
        /**
         * Wrapper element settings
         */
        wrapper?: {
            /**
             * Width of the field wrapper (e.g. '50' for 50%)
             */
            width?: string
            /**
             * CSS class(es) for the field wrapper
             */
            class?: string
            /**
             * HTML ID for the field wrapper
             */
            id?: string
        }
        /**
         * Order of the field within its parent
         */
        menu_order?: number
        /**
         * Parent field or field group key/ID
         */
        parent?: string | number
        /**
         * Parent layout key for flexible content sub-fields
         */
        parent_layout?: string
        /**
         * Message content to display
         */
        message?: string
        /**
         * Display HTML as visible text instead of rendering
         */
        esc_html?: number
        /**
         * Controls how new lines are rendered
         */
        new_lines?: "wpautop" | "br" | ""
    }
    | {
        /**
         * Unique identifier for the field with field_ prefix (e.g. 'field_abc123')
         */
        key: string
        /**
         * The label displayed for this field
         */
        label: string
        /**
         * The field name/meta_key used to save and load data (empty for layout fields like tab, accordion)
         */
        name: string
        /**
         * Accessible label for screen readers
         */
        "aria-label"?: string
        /**
         * The type of field
         */
        type: "repeater"
        /**
         * Instructions for content editors
         */
        instructions?: string
        /**
         * Whether the field is required
         */
        required?: boolean | number
        /**
         * Conditional logic rules for field visibility. False/0/empty string to disable, or array of rule groups.
         */
        conditional_logic?: boolean | number | string | unknown[]
        /**
         * Wrapper element settings
         */
        wrapper?: {
            /**
             * Width of the field wrapper (e.g. '50' for 50%)
             */
            width?: string
            /**
             * CSS class(es) for the field wrapper
             */
            class?: string
            /**
             * HTML ID for the field wrapper
             */
            id?: string
        }
        /**
         * Order of the field within its parent
         */
        menu_order?: number
        /**
         * Parent field or field group key/ID
         */
        parent?: string | number
        /**
         * Parent layout key for flexible content sub-fields
         */
        parent_layout?: string
        sub_fields?: SubFields
        min?: Min
        max?: Max
        /**
         * Visual layout style for rendering fields
         */
        layout?: "block" | "table" | "row"
        button_label?: ButtonLabel
        /**
         * Enable pagination for repeaters with many rows
         */
        pagination?: boolean | number
        /**
         * Number of rows displayed per page when pagination is enabled
         */
        rows_per_page?: number
        /**
         * Field key to use as collapsed row title
         */
        collapsed?: string
    }
    | {
        /**
         * Unique identifier for the field with field_ prefix (e.g. 'field_abc123')
         */
        key: string
        /**
         * The label displayed for this field
         */
        label: string
        /**
         * The field name/meta_key used to save and load data (empty for layout fields like tab, accordion)
         */
        name: string
        /**
         * Accessible label for screen readers
         */
        "aria-label"?: string
        /**
         * The type of field
         */
        type: "separator"
        /**
         * Instructions for content editors
         */
        instructions?: string
        /**
         * Whether the field is required
         */
        required?: boolean | number
        /**
         * Conditional logic rules for field visibility. False/0/empty string to disable, or array of rule groups.
         */
        conditional_logic?: boolean | number | string | unknown[]
        /**
         * Wrapper element settings
         */
        wrapper?: {
            /**
             * Width of the field wrapper (e.g. '50' for 50%)
             */
            width?: string
            /**
             * CSS class(es) for the field wrapper
             */
            class?: string
            /**
             * HTML ID for the field wrapper
             */
            id?: string
        }
        /**
         * Order of the field within its parent
         */
        menu_order?: number
        /**
         * Parent field or field group key/ID
         */
        parent?: string | number
        /**
         * Parent layout key for flexible content sub-fields
         */
        parent_layout?: string
    }
    | {
        /**
         * Unique identifier for the field with field_ prefix (e.g. 'field_abc123')
         */
        key: string
        /**
         * The label displayed for this field
         */
        label: string
        /**
         * The field name/meta_key used to save and load data (empty for layout fields like tab, accordion)
         */
        name: string
        /**
         * Accessible label for screen readers
         */
        "aria-label"?: string
        /**
         * The type of field
         */
        type: "tab"
        /**
         * Instructions for content editors
         */
        instructions?: string
        /**
         * Whether the field is required
         */
        required?: boolean | number
        /**
         * Conditional logic rules for field visibility. False/0/empty string to disable, or array of rule groups.
         */
        conditional_logic?: boolean | number | string | unknown[]
        /**
         * Wrapper element settings
         */
        wrapper?: {
            /**
             * Width of the field wrapper (e.g. '50' for 50%)
             */
            width?: string
            /**
             * CSS class(es) for the field wrapper
             */
            class?: string
            /**
             * HTML ID for the field wrapper
             */
            id?: string
        }
        /**
         * Order of the field within its parent
         */
        menu_order?: number
        /**
         * Parent field or field group key/ID
         */
        parent?: string | number
        /**
         * Parent layout key for flexible content sub-fields
         */
        parent_layout?: string
        /**
         * Tab placement position
         */
        placement?: "top" | "left"
        endpoint?: Endpoint
        /**
         * Whether this tab is selected by default
         */
        selected?: number
    }
    | {
        /**
         * Unique identifier for the field with field_ prefix (e.g. 'field_abc123')
         */
        key: string
        /**
         * The label displayed for this field
         */
        label: string
        /**
         * The field name/meta_key used to save and load data (empty for layout fields like tab, accordion)
         */
        name: string
        /**
         * Accessible label for screen readers
         */
        "aria-label"?: string
        /**
         * The type of field
         */
        type: "link"
        /**
         * Instructions for content editors
         */
        instructions?: string
        /**
         * Whether the field is required
         */
        required?: boolean | number
        /**
         * Conditional logic rules for field visibility. False/0/empty string to disable, or array of rule groups.
         */
        conditional_logic?: boolean | number | string | unknown[]
        /**
         * Wrapper element settings
         */
        wrapper?: {
            /**
             * Width of the field wrapper (e.g. '50' for 50%)
             */
            width?: string
            /**
             * CSS class(es) for the field wrapper
             */
            class?: string
            /**
             * HTML ID for the field wrapper
             */
            id?: string
        }
        /**
         * Order of the field within its parent
         */
        menu_order?: number
        /**
         * Parent field or field group key/ID
         */
        parent?: string | number
        /**
         * Parent layout key for flexible content sub-fields
         */
        parent_layout?: string
        /**
         * Value returned (array with url/title/target or just URL string)
         */
        return_format?: "array" | "url"
    }
    | {
        /**
         * Unique identifier for the field with field_ prefix (e.g. 'field_abc123')
         */
        key: string
        /**
         * The label displayed for this field
         */
        label: string
        /**
         * The field name/meta_key used to save and load data (empty for layout fields like tab, accordion)
         */
        name: string
        /**
         * Accessible label for screen readers
         */
        "aria-label"?: string
        /**
         * The type of field
         */
        type: "page_link"
        /**
         * Instructions for content editors
         */
        instructions?: string
        /**
         * Whether the field is required
         */
        required?: boolean | number
        /**
         * Conditional logic rules for field visibility. False/0/empty string to disable, or array of rule groups.
         */
        conditional_logic?: boolean | number | string | unknown[]
        /**
         * Wrapper element settings
         */
        wrapper?: {
            /**
             * Width of the field wrapper (e.g. '50' for 50%)
             */
            width?: string
            /**
             * CSS class(es) for the field wrapper
             */
            class?: string
            /**
             * HTML ID for the field wrapper
             */
            id?: string
        }
        /**
         * Order of the field within its parent
         */
        menu_order?: number
        /**
         * Parent field or field group key/ID
         */
        parent?: string | number
        /**
         * Parent layout key for flexible content sub-fields
         */
        parent_layout?: string
        post_type?: PostType
        taxonomy?: TaxonomyFilter
        allow_null?: AllowNull
        multiple?: Multiple
        /**
         * Allow archive URLs to be selected (1 for yes, 0 for no)
         */
        allow_archives?: number
    }
    | {
        /**
         * Unique identifier for the field with field_ prefix (e.g. 'field_abc123')
         */
        key: string
        /**
         * The label displayed for this field
         */
        label: string
        /**
         * The field name/meta_key used to save and load data (empty for layout fields like tab, accordion)
         */
        name: string
        /**
         * Accessible label for screen readers
         */
        "aria-label"?: string
        /**
         * The type of field
         */
        type: "post_object"
        /**
         * Instructions for content editors
         */
        instructions?: string
        /**
         * Whether the field is required
         */
        required?: boolean | number
        /**
         * Conditional logic rules for field visibility. False/0/empty string to disable, or array of rule groups.
         */
        conditional_logic?: boolean | number | string | unknown[]
        /**
         * Wrapper element settings
         */
        wrapper?: {
            /**
             * Width of the field wrapper (e.g. '50' for 50%)
             */
            width?: string
            /**
             * CSS class(es) for the field wrapper
             */
            class?: string
            /**
             * HTML ID for the field wrapper
             */
            id?: string
        }
        /**
         * Order of the field within its parent
         */
        menu_order?: number
        /**
         * Parent field or field group key/ID
         */
        parent?: string | number
        /**
         * Parent layout key for flexible content sub-fields
         */
        parent_layout?: string
        post_type?: PostType
        taxonomy?: TaxonomyFilter
        allow_null?: AllowNull
        multiple?: Multiple
        /**
         * Value returned (WP_Post object or post ID)
         */
        return_format?: "object" | "id"
        /**
         * Use enhanced Select2 UI (1 for yes, 0 for no)
         */
        ui?: number
        bidirectional_target?: BidirectionalTarget
    }
    | {
        /**
         * Unique identifier for the field with field_ prefix (e.g. 'field_abc123')
         */
        key: string
        /**
         * The label displayed for this field
         */
        label: string
        /**
         * The field name/meta_key used to save and load data (empty for layout fields like tab, accordion)
         */
        name: string
        /**
         * Accessible label for screen readers
         */
        "aria-label"?: string
        /**
         * The type of field
         */
        type: "relationship"
        /**
         * Instructions for content editors
         */
        instructions?: string
        /**
         * Whether the field is required
         */
        required?: boolean | number
        /**
         * Conditional logic rules for field visibility. False/0/empty string to disable, or array of rule groups.
         */
        conditional_logic?: boolean | number | string | unknown[]
        /**
         * Wrapper element settings
         */
        wrapper?: {
            /**
             * Width of the field wrapper (e.g. '50' for 50%)
             */
            width?: string
            /**
             * CSS class(es) for the field wrapper
             */
            class?: string
            /**
             * HTML ID for the field wrapper
             */
            id?: string
        }
        /**
         * Order of the field within its parent
         */
        menu_order?: number
        /**
         * Parent field or field group key/ID
         */
        parent?: string | number
        /**
         * Parent layout key for flexible content sub-fields
         */
        parent_layout?: string
        post_type?: PostType
        taxonomy?: TaxonomyFilter
        min?: Min
        max?: Max
        /**
         * Enabled filters for the relationship field UI
         */
        filters?: unknown[]
        /**
         * Additional elements to display (e.g., 'featured_image')
         */
        elements?: unknown[]
        /**
         * Value returned (WP_Post object or post ID)
         */
        return_format?: "object" | "id"
        bidirectional_target?: BidirectionalTarget
    }
    | {
        /**
         * Unique identifier for the field with field_ prefix (e.g. 'field_abc123')
         */
        key: string
        /**
         * The label displayed for this field
         */
        label: string
        /**
         * The field name/meta_key used to save and load data (empty for layout fields like tab, accordion)
         */
        name: string
        /**
         * Accessible label for screen readers
         */
        "aria-label"?: string
        /**
         * The type of field
         */
        type: "taxonomy"
        /**
         * Instructions for content editors
         */
        instructions?: string
        /**
         * Whether the field is required
         */
        required?: boolean | number
        /**
         * Conditional logic rules for field visibility. False/0/empty string to disable, or array of rule groups.
         */
        conditional_logic?: boolean | number | string | unknown[]
        /**
         * Wrapper element settings
         */
        wrapper?: {
            /**
             * Width of the field wrapper (e.g. '50' for 50%)
             */
            width?: string
            /**
             * CSS class(es) for the field wrapper
             */
            class?: string
            /**
             * HTML ID for the field wrapper
             */
            id?: string
        }
        /**
         * Order of the field within its parent
         */
        menu_order?: number
        /**
         * Parent field or field group key/ID
         */
        parent?: string | number
        /**
         * Parent layout key for flexible content sub-fields
         */
        parent_layout?: string
        /**
         * The taxonomy to select terms from
         */
        taxonomy?: string
        /**
         * UI type for term selection
         */
        field_type?: "checkbox" | "multi_select" | "radio" | "select"
        multiple?: Multiple
        allow_null?: AllowNull
        /**
         * Value returned (WP_Term object or term ID)
         */
        return_format?: "object" | "id"
        /**
         * Allow new terms to be created (1 for yes, 0 for no)
         */
        add_term?: number
        /**
         * Load terms assigned to post (1 for yes, 0 for no)
         */
        load_terms?: number
        /**
         * Connect selected terms to post (1 for yes, 0 for no)
         */
        save_terms?: number
        bidirectional_target?: BidirectionalTarget
    }
    | {
        /**
         * Unique identifier for the field with field_ prefix (e.g. 'field_abc123')
         */
        key: string
        /**
         * The label displayed for this field
         */
        label: string
        /**
         * The field name/meta_key used to save and load data (empty for layout fields like tab, accordion)
         */
        name: string
        /**
         * Accessible label for screen readers
         */
        "aria-label"?: string
        /**
         * The type of field
         */
        type: "user"
        /**
         * Instructions for content editors
         */
        instructions?: string
        /**
         * Whether the field is required
         */
        required?: boolean | number
        /**
         * Conditional logic rules for field visibility. False/0/empty string to disable, or array of rule groups.
         */
        conditional_logic?: boolean | number | string | unknown[]
        /**
         * Wrapper element settings
         */
        wrapper?: {
            /**
             * Width of the field wrapper (e.g. '50' for 50%)
             */
            width?: string
            /**
             * CSS class(es) for the field wrapper
             */
            class?: string
            /**
             * HTML ID for the field wrapper
             */
            id?: string
        }
        /**
         * Order of the field within its parent
         */
        menu_order?: number
        /**
         * Parent field or field group key/ID
         */
        parent?: string | number
        /**
         * Parent layout key for flexible content sub-fields
         */
        parent_layout?: string
        /**
         * Limit to specific user role (empty for all roles)
         */
        role?: string
        multiple?: Multiple
        allow_null?: AllowNull
        /**
         * Value returned (WP_User object, or user ID)
         */
        return_format?: "object" | "id"
        bidirectional_target?: BidirectionalTarget
    }

/**
 * Default value for the field
 */
type DefaultValue = string
/**
 * Week start day (0 = Sunday, 1 = Monday, etc.)
 */
type FirstDay = number
/**
 * Set current date/time as default value (1 for yes, 0 for no)
 */
type DefaultToCurrentDate = number
/**
 * Placeholder text shown when field is empty
 */
type Placeholder = string
/**
 * Text or HTML displayed before the input
 */
type Prepend = string
/**
 * Text or HTML displayed after the input
 */
type Append = string
/**
 * Default value for numeric fields (string for empty, number for value)
 */
type DefaultValueNumeric = string | number
/**
 * Maximum character length (empty string for unlimited)
 */
type Maxlength = number | string
/**
 * Number of rows for textarea display
 */
type Rows = number | string
/**
 * How to handle new lines in output (wpautop, br, or none)
 */
type NewLines = "wpautop" | "br" | ""
/**
 * Available choices as value:label pairs (object when populated, array when empty)
 */
type Choices =
    | Record<string, string>;
/**
 * Value returned (value or label and value as array)
 */
type ReturnFormatChoice = "value" | "label" | "array"
/**
 * Allow a null/empty value to be selected (1 for yes, 0 for no)
 */
type AllowNull = number
/**
 * Default value(s) for multi-select fields (string for single, array for multiple)
 */
type DefaultValueMulti = string | unknown[]
/**
 * Layout direction for choices (default varies by field type)
 */
type LayoutChoice = "vertical" | "horizontal"
/**
 * Allow multiple values to be selected (1 for yes, 0 for no)
 */
type Multiple = 1 | 0
/**
 * How the media value is returned (array of data, URL string, or attachment ID)
 */
type ReturnFormatMedia = "id"
/**
 * Media library source (all media or uploaded to current post only)
 */
type Library = "all" | "uploadedTo"
/**
 * Minimum file size in MB (0 for no limit)
 */
type MinSize = number
/**
 * Maximum file size in MB (0 for no limit)
 */
type MaxSize = number
/**
 * Comma-separated list of allowed MIME types (e.g., 'image/png, image/jpeg')
 */
type MimeTypes = string
/**
 * Image size for preview display in admin
 */
type PreviewSize = string
/**
 * Minimum image width in pixels (0 for no limit)
 */
type MinWidth = number
/**
 * Minimum image height in pixels (0 for no limit)
 */
type MinHeight = number
/**
 * Maximum image width in pixels (0 for no limit)
 */
type MaxWidth = number
/**
 * Maximum image height in pixels (0 for no limit)
 */
type MaxHeight = number
/**
 * Minimum number of items required (0 for no minimum)
 */
type Min = number
/**
 * Maximum number of items allowed (0 for no limit)
 */
type Max = number
/**
 * Define an endpoint for the previous accordion/tab group
 */
type Endpoint = number
/**
 * Nested fields within this field
 */
type SubFields = ACFField[]
/**
 * Text label for the add row button
 */
type ButtonLabel = string
/**
 * Limit selection to specific post types (empty for all)
 */
type PostType = unknown[]
/**
 * Limit selection to posts with specific taxonomy terms
 */
type TaxonomyFilter = unknown[]
/**
 * Target fields for bidirectional relationships
 */
type BidirectionalTarget = unknown[]
