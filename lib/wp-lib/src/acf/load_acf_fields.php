<?php

namespace Nextpress\ACF;

/**
 * Loads ACF field groups remotely from the fronend API service.
 *
 * @return void
 */

function load_acf_fields_from_api(): void {
    $nextjs_service_url = getenv_docker('NEXTJS_SERVICE_URL', '');
    $api_key = getenv_docker('CROSS_CONTAINER_API_KEY', '');
    if (!$nextjs_service_url || !\is_scalar($nextjs_service_url) || !\is_scalar($api_key)) return;

    $response = wp_remote_get($nextjs_service_url . '/api/field-groups', [
        'headers' => [
            'Authorization' => 'api-key ' . $api_key,
            'Content-Type' => 'application/json'
        ]
    ]);

    if (!is_wp_error($response)) {
        $body = wp_remote_retrieve_body($response);
        $field_groups_data = json_decode($body, true);
        if (!\is_array($field_groups_data)) return;

        foreach ($field_groups_data as $field_group) {
            if (!\is_array($field_group)) continue;

            acf_add_local_field_group($field_group);
        }
    }
}
