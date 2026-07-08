import type { NextConfig } from "next";

const wpUrl = new URL(process.env.WP_SERVICE_URL ?? '');

const nextpressNextConfig: NextConfig = {
    reactCompiler: true,
    images: {
        dangerouslyAllowLocalIP: true, // Required compromise to allow cross fetching within docker container
        remotePatterns: [
            {
                protocol: wpUrl.protocol.replace(':', '') === 'https' ? 'https' : 'http',
                hostname: wpUrl.hostname,
                port: wpUrl.port || undefined,
                pathname: '/wp-content/uploads/**',
            },
        ],
        qualities: [25, 50, 75, 100],
    },
    allowedDevOrigins: [process.env.DOMAIN_NAME ?? ''],
};

export default nextpressNextConfig;
