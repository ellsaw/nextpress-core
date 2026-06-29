import { IPost } from "@/entities/post/post.interface";
import { ITerm } from "@/entities/term/term.interface";
import { IUser } from "@/entities/user/user.interface";
import { JSX } from "react";

type GetFields<T> =
    T extends { fields: readonly any[] } ? T['fields']
    : T extends { sub_fields: readonly any[] } ? T['sub_fields']
    : never;

/**
 * Represents the properties passed to a Nextpress ACF component.
 *
 * @template T - The expected type of the mapped ACF fields.
 */
export type FieldProps<LayoutT> =
    LayoutT extends { fields: readonly any[] } | { sub_fields: readonly any[] }
        ? ResolvedFields<GetFields<LayoutT>>
    : never;

/**
 * An array of ACF field configurations to a strongly-typed object representing the resolved data structure.
 * It iterates over the array, using the `name` property of each field as the object key, and determines the expected value type using the `MapFieldType` utility.
 *
 * @template Fields - A readonly array of ACF field configuration objects.
 */
type ResolvedFields<Fields extends readonly any[]> = {
    [F in Fields[number] as F['name']]: MapFieldType<F>
};

/**
 * Maps an array of ACF Flexible Content layouts to a union type representing the resolved layout blocks.
 * For each layout, it checks for the presence of `fields` or `sub_fields`, and resolves to a specific object
 * structure containing the layout's React component and its deeply resolved field content.
 *
 * @template Layouts - A readonly array of ACF Flexible Content layout configuration objects.
 */
type ResolvedFlexibleContent<Layouts extends readonly any[]> = {
    [L in Layouts[number] as L['name']]: L extends { name: infer Name } & ({ fields: readonly any[] } | { sub_fields: readonly any[] })
        ? {
            Component: () => Promise<JSX.Element>,
            content: ResolvedFields<GetFields<L>>
        }[]
    : never
}[Layouts[number]['name']];


type MapFieldType<Field> =
    Field extends { type: 'color_picker' }
        ? string | null
    : Field extends { type: 'date_picker' }
        ? string | null
    : Field extends { type: 'date_time_picker' }
        ? string | null
    : Field extends { type: 'google_map' }
        ? ACFGoogleMapsObject | null
    : Field extends { type: 'icon_picker' }
        ? Field extends { return_format: 'string' }
            ? string | null
        : Field extends { return_format: 'array' }
            ? ACFIconObject | null
        : ACFIconObject | null
    : Field extends { type: 'time_picker' }
        ? string | null
    : Field extends { type: 'email' }
        ? string | null
    : Field extends { type: 'number' }
        ? number | null
    : Field extends { type: 'password' }
        ? string | null
    : Field extends { type: 'range' }
        ? number | null
    : Field extends { type: 'text' }
        ? string | null
    : Field extends { type: 'textarea' }
        ? string | null
    : Field extends { type: 'button_group' }
        ? Field extends { return_format: 'array' }
            ? ACFChoiceObject | null
        : string | null
    : Field extends { type: 'checkbox' }
        ? Field extends { return_format: 'array' }
            ? ACFChoiceObject[]
        : string[]
    : Field extends { type: 'radio' }
        ? Field extends { return_format: 'array' }
            ? ACFChoiceObject | null
        : string | null
    : Field extends { type: 'select' }
        ? Field extends { multiple: 1 }
            ? Field extends { return_format: 'array' }
                ? ACFChoiceObject[]
            : string[]
        : Field extends { return_format: 'array' }
            ? ACFChoiceObject | null
        : string | null
    : Field extends { type: 'true_false' }
        ? boolean
    : Field extends { type: 'file' }
        ? number | null
    : Field extends { type: 'gallery' }
        ? number[]
    : Field extends { type: 'image' }
        ? number | null
    : Field extends { type: 'oembed' }
        ? string | null
    : Field extends { type: 'wysiwyg' }
        ? string | null
    : Field extends { type: 'link' }
        ? Field extends { return_format: 'url' }
            ? string | null
        : Field extends { return_format: 'array' }
            ? ACFLinkObject | null
        : ACFLinkObject
    : Field extends { type: 'page_link' }
        ? Field extends { multiple: 1 }
            ? string[]
        : string | null
    : Field extends { type: 'post_object' }
        ? Field extends { multiple: 1 }
            ? Field extends { return_format: 'object' }
                ? IPost[]
            : number[]
        : Field extends { return_format: 'object' }
            ? IPost | null
        : number | null
    : Field extends { type: 'relationship' }
        ? Field extends { return_format: 'object' }
            ? IPost[] | null
        : number[] | null
    : Field extends { type: 'taxonomy' }
        ? Field extends { multiple: 1 }
            ? Field extends { return_format: 'object' }
                ? ITerm[]
            : number[]
        : Field extends { return_format: 'object' }
            ? ITerm | null
        : number | null
    : Field extends { type: 'user' }
        ? Field extends { multiple: 1 }
            ? Field extends { return_format: 'object' }
                ? IUser[]
            : number[]
        : Field extends { return_format: 'object' }
            ? IUser | null
        : number | null
    : Field extends { type: 'group' } & ({ fields: readonly any[] } | { sub_fields: readonly any[] })
        ? ResolvedFields<GetFields<Field>> | null
    : Field extends { type: 'repeater' } & ({ fields: readonly any[] } | { sub_fields: readonly any[] })
        ? ResolvedFields<GetFields<Field>>[] | null
    : Field extends { type: 'flexible_content'; layouts: readonly any[] }
        ? ResolvedFlexibleContent<Field['layouts']> | null
    : Field extends { fields: readonly any[] } | { sub_fields: readonly any[] }
        ? ResolvedFields<GetFields<Field>>
    : never;

type ACFIconObject = {
    type: string,
    value: string
}

type ACFLinkObject = {
    title: string,
    url: string,
    target: string
}

type ACFChoiceObject = {
    label?: string
    value?: string,
}

type ACFGoogleMapsObject = {
    address: string;
    lat: string | number;
    lng: string | number;
    zoom: string | number;
    place_id: string;
    name: string;
    street_number: string | number;
    street_name: string;
    street_name_short: string;
    city: string;
    state: string;
    state_short: string;
    post_code: string | number;
    country: string;
    country_short: string;
}
