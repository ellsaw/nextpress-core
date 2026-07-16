import { NextpressField } from "../types/acf-field";

/**
 * Defines layout configuration and applies typing.
 *
 * @param {T} field - Field configuration object.
 * @returns {T} Passed layout configuration object.
 */
export function defineField<const T extends NextpressField>(field: T): T {
    return field;
}
