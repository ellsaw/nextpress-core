import { JSX } from 'react';

/**
 * Represents a Next.js React component that consumes Nextpress ACF fields.
 *
 * @template T - The expected type of the mapped ACF fields.
 */
type NextpressComponent = {
    layout: NextpressLayout
    Component: () => Promise<JSX.Element>
}
