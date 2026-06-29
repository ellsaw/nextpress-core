import { Metadata } from "next";
import { JSX } from "react/jsx-runtime";

export type TemplateResult = JSX.Element;
export type MetadataResult = Metadata;

export type RouteProps = {
    path: string[];
    metadata?: boolean;
}
