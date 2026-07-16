import { NextpressLayout } from "../types/acf-layout";

/**
 * Defines layout configuration and applies typing.
 *
 * @param {T} layout - Layout configuration object.
 * @returns {T} Passed layout configuration object.
 */
export function defineLayout<const T extends NextpressLayout>(layout: T): T {
    return layout;
}
