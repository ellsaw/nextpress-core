import "../globals/globals";
import { Metadata } from "next";
import { AuthorArchive } from "./routes/author-archive";
import { SingularPage } from "./routes/singular-page";
import { SiteFrontPage } from "./routes/site-front-page";
import { TermArchive } from "./routes/term-archive";

export type NextpressRouterProps = {
    params: Promise<{
        path: string[] | undefined;
    }>;
}

const { publicTaxonomies } = nextpressConfig;

/**
 * Generates metadata dynamically for a given request path.
 * Routes the path to the correct Nextpress routing function based on the configuration logic.
 *
 * @param {NextpressRouterProps} props - The dynamic properties for this page route.
 * @returns {Promise<Metadata>} The Metadata object for the matched route.
 */
export async function generateNextpressMetadata({ params }: NextpressRouterProps): Promise<Metadata> {
    const path = (await params).path ?? [];

    if (!path.length) {
        return await SiteFrontPage({path, metadata: true});
    }
    if (publicTaxonomies?.includes(path[0]!)) {
        return await TermArchive({path, metadata: true});
    }
    if (path[0] === 'author') {
        return await AuthorArchive({path, metadata: true});
    } else {
        return await SingularPage({path, metadata: true});
    }
}

/**
 * The main catch-all Page component that renders the layout for matched routes.
 * Routes the path to the correct Nextpress routing component to return a template.
 *
 * @param {NextpressRouterProps} props - The dynamic properties for this page route.
 * @returns {Promise<JSX.Element>} The rendered React component mapping to the matched route's template.
 */
export async function NextPressPage({ params }: NextpressRouterProps) {
    const path = (await params).path ?? [];

    if (!path.length) {
        return <SiteFrontPage path={path}/>
    }
    if (publicTaxonomies?.includes(path[0]!)) {
        return <TermArchive path={path}/>
    }
    if (path[0] === 'author') {
        return <AuthorArchive path={path}/>
    } else {
        return <SingularPage path={path}/>
    }
}

