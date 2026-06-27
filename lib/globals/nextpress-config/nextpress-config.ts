import nextpressConfig from "../../../../../nextpress.config";

declare global {
    var nextpressConfig: NextpressConfig
}

globalThis.nextpressConfig = nextpressConfig;
