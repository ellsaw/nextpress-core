declare module '@/nextpress.config' {
    type NextpressConfig = import('nextpress/globals/nextpress-config/nextpress-config.interface').NextpressConfig;

    export const nextpressConfig: NextpressConfig
}

declare module '@/fonts' {
    type NextFont = import('next/dist/compiled/@next/font').NextFont;

    const fonts: NextFont[];
    export default fonts;
}

declare module '@/app/_templates/layout' {
    export const LayoutTemplate: ({ children }: Readonly<{children: import('react').React.ReactNode}>) => Promise<import('react').JSX.Element>;
}
