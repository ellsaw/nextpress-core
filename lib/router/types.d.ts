import { Metadata } from "next";

type TemplateResult = JSX.Element;
type MetadataResult = Metadata;

type RouteProps = {
    path: string[];
    metadata?: boolean;
}
