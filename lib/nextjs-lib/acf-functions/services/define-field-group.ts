import { NextpressFieldGroup } from "../types/acf-field-group";

/**
 * Defines field group configuration and applies typing.
 *
 * @param {T} layout - Field group configuration object.
 * @returns {T} Passed field group configuration object.
 */
export function defineFieldGroup<const T extends NextpressFieldGroup>(layout: T): T {
    return layout;
}
