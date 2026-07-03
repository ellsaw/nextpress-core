import Image from "next/image";
import { ComponentPropsWithoutRef } from "react";

type Props = Omit<ComponentPropsWithoutRef<typeof Image>, "src" | "alt" | "height" | "width"> & {
    attachmentId: number;
    className?: string;
};

/**
 * Renders a WordPress media attachment using the Next.js Image component.
 */
export async function RenderAttachmentImage({ attachmentId, className, ...rest }: Props) {
    const image = await getPost(attachmentId);
    if (!image) return;

    const { src, alt, height, width } = image.imageAttributes;

    return (
        <Image
            src={src || ''}
            alt={alt || ''}
            height={height}
            width={width}
            className={className}
            {...rest}
        />
    );
}
