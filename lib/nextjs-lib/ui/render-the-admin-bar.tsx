"use client"
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { ksesPost } from "@nextpress/services/utilities/kses-post";

type Props = {
    loggedInUserId?: number
}

type AdminBarResponse = {
    html: string,
    assets: {
        css: {
            admin_bar: string,
            dashicons: string
        },
        js: {
            admin_bar: string
        }
    }
}

/**
 * Renders the WordPress admin bar for authenticated administrators browsing the Next.js frontend.
 */
export function RenderTheAdminBar({ loggedInUserId }: Props) {
    const [adminBar, setAdminBar] = useState<AdminBarResponse | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    const path = usePathname();

    useEffect(() => {
        fetch(`/api/admin-bar?user_id=${loggedInUserId}&path=${encodeURIComponent(path)}`)
            .then((request) => {
                if (!request.ok) {
                    throw new Error(`Failed to fetch admin bar: ${request.status}`);
                }
                return request.json();
            })
            .then((response) => {
                setAdminBar(response);
                setTimeout(() => setIsMounted(true), 50);
            })
            .catch((error) => {
                console.error("Failed to load admin bar", error.message);
            })
    }, [loggedInUserId, path]);

    if (!adminBar) {
        return null;
    }

    return (
        <>
            <link
                rel="stylesheet"
                href={adminBar.assets.css.admin_bar}
                precedence="high"
            />
            <link
                rel="stylesheet"
                href={adminBar.assets.css.dashicons}
                precedence="high"
            />
            <Script src={adminBar.assets.js.admin_bar}/>

            <div
                className={`fixed top-0 left-0 right-0 transform transition-all duration-300 ease-in-out ${
                    isMounted
                        ? "scale-y-100"
                        : "scale-y-0"
                }`}
            >
                {ksesPost(adminBar.html)}
            </div>
        </>
    );
}
