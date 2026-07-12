import { NextpressField, ACFField } from "../types/acf-field";
import { ACFFieldGroup, NextpressFieldGroup } from "../types/acf-field-group";
import { NextpressLayout, ACFLayout } from "../types/acf-layout";

/**
 * Class representing ACF builder.
 */
export class ACFBuilder {
    /** Array of ACF field groups. */
    private fieldGroups: ACFFieldGroup[] = [];

    private fieldKeyMap: Map<string, string>;

    public constructor() {
        this.fieldKeyMap = new Map();
    };

    /**
     * Gets built field groups.
     *
     * @returns {ACFFieldGroup[]} Array of field groups.
     */
    public getFieldGroups(): ACFFieldGroup[] {
        return this.fieldGroups;
    }

    /**
     * Converts field groups to JSON string.
     *
     * @returns {string} JSON string representation of field groups.
     */
    public toJSON(): string {
        return JSON.stringify(this.fieldGroups);
    }

    /**
     * Registers and processes Nextpress field groups.
     *
     * @param {NextpressFieldGroup[]} fieldGroups - Array of field groups to register.
     * @returns {this} Current instance.
     */
    public registerFieldGroups(fieldGroups: NextpressFieldGroup[]): this {
        let keyedFieldGroups: ACFFieldGroup[] = [];

        // Run twice to double check conditionals
        for (let i = 0; i < 2; i++) {
            keyedFieldGroups = fieldGroups.map(fieldGroup => ({
                ...fieldGroup,
                key: `group_${this.formatKeySuffix(fieldGroup.title)}`,
                fields: this.setFieldKeys(fieldGroup.fields, fieldGroup.title),
            }));
        }

        this.fieldGroups = [...this.fieldGroups, ...keyedFieldGroups];

        return this;
    }

    /**
     * Sets keys for fields based on parent name.
     *
     * @param {NextpressField[]} fields - Array of fields to process.
     * @param {string} parentName - Parent string name.
     * @returns {ACFField[]} Array of fields with generated keys.
     */
    private setFieldKeys(fields: NextpressField[], parentName: string): ACFField[] {
        return fields.map(field => {
            const keySuffix = this.formatKeySuffix(`${parentName}_${field.name}`);

            const childFields = field.sub_fields
                ? this.setFieldKeys(field.sub_fields, keySuffix)
                : undefined;

            const childLayouts = field.layouts
                ? this.setLayoutKeys(field.layouts, keySuffix)
                : undefined;

            const key = `field_${keySuffix}`;

            this.fieldKeyMap.set(field.name, key);

            if (field.conditional_logic) {
                field.conditional_logic = field.conditional_logic.map((group) => {
                    return group.map((cl) => {
                        const resolvedKey = this.fieldKeyMap.get(cl.field);

                        return {
                            ...cl,
                            field: resolvedKey !== undefined ? resolvedKey : cl.field
                        };
                    });
                });
            }

            return {
                ...field,
                key,
                sub_fields: childFields,
                layouts: childLayouts,
            }
        });
    }

    /**
     * Sets keys for layouts based on parent name.
     *
     * @param {NextpressLayout[]} layouts - Array of layouts to process.
     * @param {string} parentName - Parent string name.
     * @returns {ACFLayout[]} Array of layouts with generated keys.
     */
    private setLayoutKeys(layouts: NextpressLayout[], parentName: string): ACFLayout[] {
        return layouts.map(layout => {
            const keySuffix = this.formatKeySuffix(`${parentName}_${layout.name}`);

            const childFields = layout.sub_fields
                ? this.setFieldKeys(layout.sub_fields, `${parentName}_${layout.name}`)
                : undefined;

            return {
                ...layout,
                key: `layout_${keySuffix}`,
                sub_fields: childFields || [],
            }
        })
    }

    /**
     * Formats suffix string.
     *
     * @param {string} suffix - Suffix to format.
     * @returns {string} Formatted string.
     */
    private formatKeySuffix(suffix: string): string {
        return suffix.replace(/[\s-]+/g, '_').toLowerCase();
    }
}
