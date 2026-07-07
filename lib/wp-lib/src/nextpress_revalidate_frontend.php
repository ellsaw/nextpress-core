<?php

namespace Nextpress;

/**
 * Revalidates the Next.js frontend by pinging its API.
 *
 * * @return true|\WP_Error Returns true on success, or a WP_Error object on failure.
 */
function revalidate_frontend(): true|\WP_Error {
    $nextjs_service_url = getenv_docker('NEXTJS_SERVICE_URL', '');
    $api_key = getenv_docker('CROSS_CONTAINER_API_KEY', '');

    if (!$nextjs_service_url || !\is_scalar($nextjs_service_url) || !\is_scalar($api_key)) {
        return new \WP_Error(
            'missing_credentials',
            'Next.js service URL or API key is missing or invalid.'
        );
    }

    $response = wp_remote_post($nextjs_service_url . '/api/revalidate', [
        'headers' => [
            'Authorization' => 'api-key ' . $api_key,
            'Content-Type' => 'application/json'
        ]
    ]);

    if (is_wp_error($response)) {
        return $response;
    }

    $status_code = wp_remote_retrieve_response_code($response);

    if ($status_code !== 200) {
        $error_message = wp_remote_retrieve_response_message($response);
        return new \WP_Error(
            'http_response_error',
            sprintf('Next.js API returned status code %d: %s', $status_code, $error_message),
            ['status_code' => $status_code]
        );
    }

    return true;
}

/**
 * Triggers the frontend revalidation and logs any errors that occur.
 *
 * @return void
 */
function nextpress_revalidate_frontend(): void {
    $revalidated = revalidate_frontend();

    if (is_wp_error($revalidated)) {
        error_log($revalidated->get_error_message());
    }
}
