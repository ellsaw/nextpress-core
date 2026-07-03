import { nextpressConfig } from "@/nextpress.config";
import { NextpressConfig } from "./nextpress-config.interface";

declare global {
    var nextpressConfig: NextpressConfig
}

globalThis.nextpressConfig = nextpressConfig;
