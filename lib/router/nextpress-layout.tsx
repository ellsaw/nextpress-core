import "@nextpress/globals/globals";
import { LayoutTemplate } from "@/app/_templates/layout";
import { cookies, draftMode } from "next/headers";
import fonts from "@/fonts";
import { getLanguageAttributes } from "@nextpress/services/metadata/get-language-attribute";
import { RenderTheAdminBar } from "@nextpress/ui/render-the-admin-bar";

const fontClasses = fonts.map(font => font.variable).join(' ');

/**
 * The layout for the application.
 * Defines the main HTML shell, handles Draft Mode validation, primes necessary global WordPress options,
 * and routes directly to the `LayoutTemplate` within the Nextpress template hierarchy.
 *
 * @param {Readonly<{children: React.ReactNode;}>} props - Component properties, wrapping the children pages.
 * @returns {Promise<JSX.Element>} The root layout of the entire app.
 */
export async function NextpressLayout({ children }: Readonly<{children: React.ReactNode;}>) {
    const draftModeEnabled = (await draftMode()).isEnabled;
    let loggedInUserId = 0;
    if (draftModeEnabled) {
        const cookieStore = await cookies();
        loggedInUserId = Number(cookieStore.get('nextpress_logged_in_user_id')?.value) || 0;
    }

    optionLoader.findAndPrime({
        column: 'optionName',
        operand: 'in',
        value: nextpressConfig.preLoadOptions || ''
    })

    const languageAttributes = await getLanguageAttributes();

    return (
        <html
            lang={languageAttributes}
            className={fontClasses}
        >
            <body className="">
                {(draftModeEnabled && (await getUser(loggedInUserId))?.showAdminBar) && <RenderTheAdminBar loggedInUserId={loggedInUserId}/>}
                <LayoutTemplate>
                    {children}
                </LayoutTemplate>
            </body>
        </html>
    );
}


