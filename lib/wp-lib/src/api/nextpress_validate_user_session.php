<?php

namespace Nextpress;

use WP_Error;
use WP_REST_Request;
use WP_REST_Response;

add_action('rest_api_init', function() {
    register_rest_route(
        'nextpress/v1',
        '/validate-user-session/',
        [
            'methods' => 'GET',
            'callback' => __NAMESPACE__ . '\handle_validate_user_session_response',
            'permission_callback' => __NAMESPACE__ . '\validate_validate_user_session',
            'args' => [
                'user_hash' => [
                    'type' => 'string',
                    'required' => true,
                    'sanitize_callback' => 'sanitize_text_field',
                ]
            ]
        ]
    );
});

/**
 * Permission callback to validate the API key and the user session hash.
 *
 * This function intercepts the request before it reaches the main callback. It performs two critical security checks:
 * 1. Server-to-Server Authentication: Verifies that the `Authorization: api-key <key>` header matches the expected `CROSS_CONTAINER_API_KEY` Docker environment variable.
 * 2. Session Validation: Uses WordPress's native `wp_validate_auth_cookie()` to verify the provided `user_hash` parameter.
 *
 * If validation succeeds, it injects the `validated_user_id` parameter into the request object so it can be consumed by the main callback without re-querying the database.
 *
 * @since 1.0.0
 * @access public
 *
 * @param WP_REST_Request $request The incoming REST API request object.
 * @return bool|WP_Error Returns `true` if the API key and session hash are valid. Returns a `WP_Error` (401 status) if either check fails.
 */
function validate_validate_user_session(WP_REST_Request $request): bool | WP_Error {
    $api_key = getenv_docker('CROSS_CONTAINER_API_KEY', '');
    $auth_header = $request->get_header('Authorization');

    $passed_key = '';
    if (!empty($auth_header) && preg_match('/api-key\s(\S+)/', $auth_header, $matches)) {
        $passed_key = $matches[1];
    }

    if (!\is_string($api_key) || empty($api_key) || !hash_equals($api_key, $passed_key)) {
        return new WP_Error('rest_forbidden', __('Unauthorized API Key.'), ['status' => 401]);
    }

    $passed_hash = (string) (\is_scalar($request->get_param('user_hash')) ? $request->get_param('user_hash') : '');

    $user_id = !empty($passed_hash)
        ? wp_validate_auth_cookie($passed_hash, 'logged_in')
        : wp_validate_auth_cookie('', 'logged_in');

    if (!$user_id) {
        return new WP_Error('rest_cookie_invalid', __('Invalid session hash.'), ['status' => 401]);
    }

    $request->set_param('validated_user_id', $user_id);

    return true;
}

/**
 * Handles the GET request for validating a user session hash.
 *
 * This function serves as the primary callback for the `/nextpress/v1/validate-user-session/` endpoint.
 * It relies on the `validated_user_id` parameter, which is set by the `validate_validate_user_session` permission callback upon successful authentication.
 *
 * ### API Endpoint Information
 * - URL: `/wp-json/nextpress/v1/validate-user-session/`
 * - Method: `GET`
 * - Auth Required: Yes (via `Authorization` header)
 *
 * ### Request Headers
 * - `Authorization`: `api-key <CROSS_CONTAINER_API_KEY>`
 *
 * ### Request Parameters
 * - `user_hash` (string): The hashed session cookie value to validate.
 *
 * ### Success Response
 * - Code: 200 OK
 * - Content: * ```json
 * {
 *  "success": true,
 *  "user_id": 123
 * }
 * ```
 *
 * ### Error Responses (Handled by permission callback)
 * - Code: 401 Unauthorized (`rest_forbidden`) - Missing or invalid API key.
 * - Code: 401 Unauthorized (`rest_cookie_invalid`) - Invalid session hash.
 *
 * @since 1.0.0
 * @access public
 *
 * @param WP_REST_Request $request The incoming REST API request object containing the `validated_user_id`.
 * @return WP_REST_Response Response object containing the success status and the validated user ID.
 */
function handle_validate_user_session_response(WP_REST_Request $request): WP_REST_Response {
    $user_id = $request->get_param('validated_user_id');

    return new WP_REST_Response([
        'success' => true,
        'user_id' => $user_id
    ], 200);
}
