import { getThemeMods } from "@/services/get-theme-mods";
import { getBlogname } from "@/services/metadata/get-blogname";
import { RenderAttachmentImage } from "./render-attachment-image";

type Props = {
    className?: string
}

/**
 * Renders the custom site logo defined in the WordPress Customizer.
 *
 * Fallback: Renders the text-based Site Title if no custom logo is assigned in WordPress.
 */
export async function RenderTheLogo({ className }: Props) {
    const logoId = Number(await getThemeMods('custom_logo')) ?? 0;

    return (
        <div className={className}>
            {logoId ?
                <RenderAttachmentImage className="h-full w-full object-contain object-center" attachmentId={logoId} sizes="512px"/>
            : <span className="text-4xl font-bold">{await getBlogname()}</span>}
        </div>
    )
}
