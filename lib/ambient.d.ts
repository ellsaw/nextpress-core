declare module '@/nextpress.config' {
    type NextpressConfig = import('@nextpress/globals/nextpress-config/nextpress-config.interface').NextpressConfig;

    export const nextpressConfig: NextpressConfig
}

declare module '@/fonts' {
    type NextpressFont = import('@nextpress/router/types').NextpressFont;

    const fonts: NextpressFont[];
    export default fonts;
}

declare module '@/app/_templates/layout' {
    export const LayoutTemplate: ({ children }: Readonly<{children: import('react').React.ReactNode}>) => Promise<import('react').JSX.Element>;
}
