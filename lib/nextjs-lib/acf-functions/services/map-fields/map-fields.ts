import { unserialize } from "php-serialize";
import { acfComponentAutoloader } from "../../core/acf-component-autoloader";
import { ACFGoogleMapsObject, ACFIconObject, ACFLinkObject } from "@nextpress/acf-functions/types/components/field-props";
import { NextpressField } from "@nextpress/acf-functions/types/acf-field";
import { NextpressLayout } from "@nextpress/acf-functions/types/acf-layout";
import { ACFRawValues } from "@nextpress/acf-functions/types/acf-values";
import { mapChoiceObject } from "./helpers/map-choice-object";
import { processURL } from "@nextpress/services/utilities/process-url";

const components = await acfComponentAutoloader();

/**
 * Parses PHP serialized string into JavaScript object or array.
 *
 * @param {string} [string] - PHP serialized string.
 * @returns {unknown[] | { [key: string]: unknown }} Parsed object or array.
 */
function parsePhp(string?: string): unknown[] | { [key: string]: unknown } {
    return unserialize(string ?? 'a:0:{}') ?? [];
}

/**
 * Gets array of object IDs from string value.
 *
 * @param {string} value - String value containing IDs.
 * @param {boolean} multiple - Indicates if multiple IDs are expected.
 * @returns {number[]} Array of parsed object IDs.
 */
function getObjectIDs(value: string, multiple: boolean): number[] {
    if (multiple) {
        const postValueArray = parsePhp(value);
        if (!Array.isArray(postValueArray)) return [];

        return postValueArray.map(Number).filter(Boolean);
    } else {
        return [Number(value) ?? 0]
    }
}

/**
 * Maps individual ACF field to corresponding value.
 *
 * @param {NextpressField} field - Field configuration.
 * @param {ACFRawValues} rawValues - Raw values map.
 * @returns {Promise<any>} Promise resolving to mapped value.
 */
export async function mapField(field: NextpressField, rawValues: ACFRawValues): Promise<any> {
    /**
     * Basic scalar values and strings.
     * These are stored as simple strings in the database and require no complex parsing.
    */
    switch (field.type){
        case 'color_picker':
        case 'date_picker':
        case 'date_time_picker':
        case 'time_picker':
        case 'email':
        case 'password':
        case 'text':
        case 'textarea':
        case 'oembed':
        case 'wysiwyg':
        case 'file':
        case 'image':
            return rawValues.get(field.name);

        /**
         * Numeric fields.
         * Casts the raw string from the database into a strict JavaScript Number.
         */
        case 'number':
        case 'range':
            return Number(rawValues.get(field.name));

        /**
         * True/False boolean field.
         * Converts the truthy/falsy raw string/number into a strict JavaScript boolean.
         */
        case 'true_false':
            return !!rawValues.get(field.name);

        /**
         * Google Map field.
         * Deserializes the PHP array containing map data (address, lat, lng) into a structured object.
         */
        case 'google_map':
            const mapValue = parsePhp(rawValues.get(field.name));
            if (Array.isArray(mapValue)) return;

            const mapObject: ACFGoogleMapsObject = mapValue as ACFGoogleMapsObject;
            return mapObject;

        /**
         * Icon Picker field.
         * Deserializes the PHP array and respects the return format (either a raw string class or an object).
         */
        case 'icon_picker':
            const iconValue = parsePhp(rawValues.get(field.name));
            if (Array.isArray(iconValue)) return;

            const iconObject: ACFIconObject = iconValue as ACFIconObject;
            if (field.return_format === 'string') {
                return iconObject.value;
            } else {
                return iconObject;
            }

        /**
         * Button Group field.
         * Maps the selected choice value to its corresponding label/array using the choice map.
         */
        case 'button_group':
            return mapChoiceObject(field.return_format ?? 'value', rawValues.get(field.name));

        /**
         * Checkbox field.
         * Deserializes the array of selected options and maps each one to the requested return format.
         */
        case 'checkbox':
            const checkBoxValues = parsePhp(rawValues.get(field.name));
            if (!Array.isArray(checkBoxValues)) return;

            return checkBoxValues.map(value => mapChoiceObject(field.return_format ?? 'value', typeof value === 'string' ? value : undefined, field.choices));

        /**
         * Radio field.
         * Maps a single selected choice using the field's available choices.
         */
        case 'radio':
            return mapChoiceObject(field.return_format ?? 'value', rawValues.get(field.name), field.choices);

        /**
         * Select field.
         * Handles both multi-select (deserializes array) and single-select (processes raw string),
         * applying the requested return format.
         */
        case 'select':
            if (field.multiple === 1) {
                const selectValues = parsePhp(rawValues.get(field.name));
                if (!Array.isArray(selectValues)) return;

                return selectValues.map(value => mapChoiceObject(field.return_format ?? 'value', typeof value === 'string' ? value : undefined, field.choices));
            } else {
                return mapChoiceObject(field.return_format ?? 'value', rawValues.get(field.name), field.choices);
            }

        /**
         * Gallery field.
         * Deserializes the PHP array of image IDs or objects.
         */
        case 'gallery':
            const galleryValues = parsePhp(rawValues.get(field.name));
            if (!Array.isArray(galleryValues)) return;

            return galleryValues;

        /**
         * Flexible Content field.
         * Iterates over saved layout names, extracts the relevant prefixed sub-fields for each block,
         * recursively maps those sub-fields, and binds the resolved data to the correct React component.
         */
        case 'flexible_content':
            const layoutValues = parsePhp(rawValues.get(field.name));
            if (!Array.isArray(layoutValues)) return;

            const layouts = field.layouts;
            const fcRawEntries = Array.from(rawValues.entries());

            const promises = layoutValues.map(async (layoutValue, index) => {
                const layout = layouts?.find(layout => layout.name === layoutValue);

                const prefix = `${field.name}_${index}_`;
                const prefixLength = prefix.length;

                const component = components.find(comp => comp.layout.name === layout?.name);

                const subFieldEntries = fcRawEntries
                    .filter(([key]) => key.startsWith(prefix))
                    .map(([key, value]) => [key.slice(prefixLength), value] as [string, any]);

                const flexibleValues = new Map<string, any>(subFieldEntries);

                const resolvedValues = await mapLayout(layout as any, flexibleValues);

                return {
                    Component: component?.Component,
                    content: resolvedValues
                };
            });

            return Promise.all(promises);

        /**
         * Group field.
         * Strips the parent group prefix from the database keys and recursively maps the internal sub-fields.
         */
        case 'group':
            const groupValues = new Map(
                [...rawValues.entries()]
                    .filter(([key]) => key.startsWith(field.name) && key !== field.name)
                    .map(([key, value]) => {
                        const newKey = key.replace(`${field.name}_`, '');
                        return [newKey, value];
                    })
            );
            return await mapLayout(field as any, groupValues);

        /**
         * Repeater field.
         * Gets the total repeat count, then iterates to extract prefixed sub-fields for each row,
         * mapping them recursively into an array of objects.
         */
        case 'repeater':
            const repeaterRepeats = Number(rawValues.get(field.name)) || 0;
            const repeaterResults = [];

            const rRawEntries = Array.from(rawValues.entries());

            for (let index = 0; index < repeaterRepeats; index++) {
                const prefix = `${field.name}_${index}_`;
                const prefixLength = prefix.length;

                const subFieldEntries = rRawEntries
                    .filter(([key]) => key.startsWith(prefix))
                    .map(([key, value]) => [key.slice(prefixLength), value] as [string, any]);

                const repeatValues = new Map<string, any>(subFieldEntries);

                repeaterResults.push(mapLayout(field as any, repeatValues));
            }

            return Promise.all(repeaterResults);

        /**
         * Link field.
         * Deserializes link properties (title, url, target) and returns either the raw URL string or a structured object.
         */
        case 'link':
            const linkValue = parsePhp(rawValues.get(field.name));
            if (Array.isArray(linkValue)) return;

            const linkObject: ACFLinkObject = {
                title: typeof linkValue.title === 'string' ? linkValue.title : '',
                url: typeof linkValue.url === 'string' ? processURL(linkValue.url) : '',
                target: typeof linkValue.target === 'string' ? linkValue.target : '',
            }

            if (field.return_format === 'url') {
                return linkObject.url;
            } else {
                return linkObject
            }

        /**
         * Page Link field.
         * Retrieves internal post paths dynamically based on post ID, or falls back to standard external URLs.
         */
        case 'page_link':
            if (field.multiple == 1) {
                const pageLinkValue = parsePhp(rawValues.get(field.name));
                if (!Array.isArray(pageLinkValue)) return;
                const pageLinkIds = pageLinkValue.map(Number).filter(Boolean);

                const posts = await getPosts(pageLinkIds);
                const postPaths = new Map(posts.map(post => [post.ID, post.path]));

                return pageLinkValue.map(page => postPaths.has(Number(page)) ? postPaths.get(Number(page)) : processURL(page as string));
            } else {
                const pageLinkValue = rawValues.get(field.name);
                const pageLinkId = Number(rawValues.get(field.name));
                if (!pageLinkValue) return;

                return pageLinkId ? (await getPost(pageLinkId))?.path : processURL(pageLinkValue);
            }

        /**
         * Post Object field.
         * Returns either the raw Post IDs or uses the Entity Loader to fetch and return the complete post models.
         */
        case 'post_object':
            const postObjectIds: number[] = getObjectIDs(rawValues.get(field.name) ?? '', !!field.multiple)

            if (field.return_format === 'id') {
                return field.multiple ? postObjectIds : postObjectIds[0];
            } else {
                postLoader.prime(postObjectIds);
                const posts = await Promise.all(postObjectIds.map(id => getPost(id)));
                return field.multiple ? posts : posts[0];
            }

        /**
         * Relationship field.
         * Extracts multiple selected IDs from a PHP array, returning them directly or fetching the associated post models.
         */
        case 'relationship':
            const relationshipArray = parsePhp(rawValues.get(field.name));
            if (!Array.isArray(relationshipArray)) return [];

            const relationshipIds = relationshipArray.map(Number).filter(Boolean);

            if (field.return_format === 'id') {
                return relationshipIds;
            } {
                postLoader.prime(relationshipIds);
                return await Promise.all(relationshipIds.map(id => getPost(id)));
            }

        /**
         * Taxonomy field.
         * Parses selected Term IDs and optionally fetches the complete taxonomy Term objects from the database.
         */
        case 'taxonomy':
            const termObjectIds = parsePhp(rawValues.get(field.name))
            if (!Array.isArray(termObjectIds)) return [];

            const termIds = termObjectIds.map(Number).filter(Boolean);

            if (field.return_format === 'id') {
                return field.multiple ? termIds : termIds[0];
            } else {
                const terms = await Promise.all(termIds.map(id => getTerm(id)));
                return field.multiple ? terms : terms[0];
            }

        /**
         * User field.
         * Extracts User IDs and returns either the raw IDs or fetches and returns the full User entity objects.
         */
        case 'user':
            const userObjectIds: number[] = getObjectIDs(rawValues.get(field.name) ?? '', !!field.multiple)

            if (field.return_format === 'id') {
                return field.multiple ? userObjectIds : userObjectIds[0];
            } else {
                const users = await Promise.all(userObjectIds.map(id => getUser(id)));
                return field.multiple ? users : users[0];
            }
        }

    return undefined;
}

/**
 * Maps layout configuration to values object.
 *
 * @param {NextpressLayout} layout - Layout configuration.
 * @param {ACFRawValues} rawValues - Raw values map.
 * @returns {Promise<{ [key: string]: any }>} Promise resolving to layout values object.
 */
export async function mapLayout(layout: NextpressLayout, rawValues: ACFRawValues)  {
    const values: { [key: string]: any } = {};

    for (const subField of layout.sub_fields) {
        try {
            values[subField.name] = await mapField(subField, rawValues)
        } catch (error: any) {
            console.warn('Failed to map sub field: ', subField.name, error.message);
        }
    }

    return values;
}
