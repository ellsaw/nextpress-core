import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { isAuthorized } from "./helpers";
import { acfFieldGroupAutoloader } from "@/acf-functions/core/acf-field-group-autoloader";
import { ACFBuilder } from "@/acf-functions/core/acf-builder";

/**
 * Processes GET requests to retrieve built ACF field groups.
 *
 * @returns {Promise<NextResponse>} Response containing field groups or error.
 */
export async function apiGetFieldGroups(): Promise<NextResponse> {
    if (!isAuthorized(await headers())) {
        return NextResponse.json('Unauthorized access', { status: 403 })
    }

    try {
        const fieldGroups = await acfFieldGroupAutoloader();
        const acfBuilder = new ACFBuilder().registerFieldGroups(fieldGroups);

        return NextResponse.json(acfBuilder.getFieldGroups(), { status: 200 });
    } catch (error: any) {
        console.error('Field Group API:', error.message)
        return NextResponse.json(
            { message: 'Error building ACF fields', error: String(error) },
            { status: 500 }
        );
    }
}
