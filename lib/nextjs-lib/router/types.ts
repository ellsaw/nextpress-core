import { Metadata } from "next";
import { NextFont } from "next/dist/compiled/@next/font";
import { JSX } from "react";

export type TemplateResult = JSX.Element;
export type MetadataResult = Metadata;

export type RouteProps = {
    path: string[];
    metadata?: boolean;
}

export type NextpressFont = NextFont & {variable: string};
