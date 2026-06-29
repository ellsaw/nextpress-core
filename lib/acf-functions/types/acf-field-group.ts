import { NextpressField, ACFField } from "./acf-field";

type TransformACFFieldGroup<T> = T extends any
    ? Omit<T, 'key' | 'fields'> &
        ('fields' extends keyof T ? { fields: NextpressField[] } : [])
    : never;

/** ACF Field Group without key constraints to allow key generation */
export type NextpressFieldGroup = TransformACFFieldGroup<ACFFieldGroup>

/**
 * Represents an Advanced Custom Fields (ACF) Field Group configuration.
 */
export interface ACFFieldGroup {
    /**
     * Unique identifier for the field group with group_ prefix (e.g. 'group_abc123')
     */
    key: string
    /**
     * The title/name of this entity
     */
    title: string
    /**
     * Array of field definitions. If empty array, field group appears but contains no fields.
     */
    fields: ACFField[]
    /**
     * The order of this entity in the admin menu
     */
    menu_order?: number
    /**
     * [ACF] Whether this entity is active
     */
    active?: boolean
    /**
     * [ACF Export Only] Unix timestamp of last modification
     */
    modified?: number
    /**
     * Location rules determining where this field group appears. Array of rule groups (OR logic between groups, AND logic within groups). If omitted or empty, field group won't appear on any edit screens.
     */
    location?: ACFLocationGroup[]
    /**
     * Position of the field group on the edit screen
     */
    position?: "normal" | "side" | "acf_after_title"
    /**
     * Visual style of the field group metabox
     */
    style?: "default" | "seamless"
    /**
     * Placement of field labels relative to fields
     */
    label_placement?: "top" | "left"
    /**
     * Placement of field instructions
     */
    instruction_placement?: "label" | "field"
    /**
     * Screen elements to hide when this field group is displayed
     */
    hide_on_screen?: (
        | "permalink"
        | "the_content"
        | "excerpt"
        | "custom_fields"
        | "discussion"
        | "comments"
        | "revisions"
        | "slug"
        | "author"
        | "format"
        | "page_attributes"
        | "featured_image"
        | "categories"
        | "tags"
        | "send-trackbacks"
    )[]
    /**
     * Description of the field group
     */
    description?: string
    /**
     * Whether to expose this field group's fields in the REST API
     */
    show_in_rest?: boolean | number
    /**
     * Whether to expose this field group to AI integrations
     */
    allow_ai_access?: boolean | number
    /**
     * Description that helps AI integrations understand how to use this field group
     */
    ai_description?: string
    /**
     * Alternative display title for the field group
     */
    display_title?: string
}

/**
 * Group of location rules (AND logic within group)
 */
export type ACFLocationGroup = [ACFLocationRule, ...ACFLocationRule[]]

export interface ACFLocationRule {
    /**
     * The parameter to compare (e.g. 'post_type', 'page_template', 'user_role')
     */
    param: string
    /**
     * Comparison operator
     */
    operator: "==" | "!="
    /**
     * Value to compare against
     */
    value: string
    [k: string]: unknown
}
