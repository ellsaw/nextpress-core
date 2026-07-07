import { JSX } from 'react';
import { NextpressLayout } from '../acf-layout';

/**
 * Represents a Next.js React component that consumes Nextpress ACF fields.
 *
 * @template T - The expected type of the mapped ACF fields.
 */
export type NextpressComponent = {
    layout: NextpressLayout
    Component: () => Promise<JSX.Element>
}
