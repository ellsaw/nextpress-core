<?php

namespace Nextpress;

use WP_Admin_Bar;
use WP_Post;
use WP_Error;
use WP_Query;
use WP_REST_Request;
use WP_REST_Response;
use WP_Rewrite;
use WP_Scripts;
use WP_Styles;

add_action('rest_api_init', function() {
    register_rest_route(
        'nextpress/v1',
        '/get-admin-bar/',
        [
            'methods' => 'GET',
            'callback' => __NAMESPACE__ . '\handle_get_admin_bar_response',
            'permission_callback' => __NAMESPACE__ . '\validate_get_admin_bar',
            'args' => [
                'user_id' => [
                    'type' => 'integer',
                    'required' => true,
                    'sanitize_callback' => 'absint',
                ],
                'path' => [
                    'type' => 'string',
                    'required' => false,
                    'sanitize_callback' => 'sanitize_text_field',
                ]
            ]
        ]
    );
});

/**
 * Permission callback to validate the API key for the get-admin-bar REST route.
 *
 * This function ensures that requests to the admin bar endpoint are securely authenticated using server-to-server authentication. It verifies that the `Authorization: api-key <key>`
 * header matches the expected `CROSS_CONTAINER_API_KEY` defined in the Docker environment.
 *
 * @since 1.0.0
 * @access public
 *
 * @param WP_REST_Request $request The incoming REST API request object.
 * @return bool|WP_Error Returns `true` if the API key is valid. Returns a `WP_Error` (401 status) if authorization fails.
 */
function validate_get_admin_bar(WP_REST_Request $request): bool | WP_Error {
    $api_key = getenv_docker('CROSS_CONTAINER_API_KEY', '');
    $auth_header = $request->get_header('Authorization');

    $passed_key = '';
    if (!empty($auth_header) && preg_match('/api-key\s(\S+)/', $auth_header, $matches)) {
        $passed_key = $matches[1];
    }

    if (!\is_string($api_key) || empty($api_key) || !hash_equals($api_key, $passed_key)) {
        return new WP_Error('rest_forbidden', __('Unauthorized API Key.'), ['status' => 401]);
    }

    return true;
}

/**
 * Handles the GET request to generate and return the WordPress admin bar HTML and assets.
 *
 * This function acts as the primary callback for the `/nextpress/v1/get-admin-bar/` endpoint.
 * Because REST API requests do not run the standard WordPress frontend loop, this function artificially constructs the main query (`WP_Query`), global objects, and context based
 * on the provided `path`. This ensures that context-sensitive admin bar items (like "Edit Post") point to the correct URLs.
 *
 * ### API Endpoint Information
 * - URL: `/wp-json/nextpress/v1/get-admin-bar/`
 * - Method: `GET`
 * - Auth Required: Yes (via `Authorization` header)
 *
 * ### Request Headers
 * - `Authorization`: `api-key <CROSS_CONTAINER_API_KEY>`
 *
 * ### Request Parameters
 * - `user_id` (integer|required): The ID of the authenticated user to generate the admin bar for.
 * - `path` (string|optional): The frontend path/URL being viewed. Used to figure out the current queried object.
 *
 * ### Success Response
 * - Code: 200 OK
 * - Content:
 * ```json
 * {
 *  "success": true,
 *  "html": "<div id=\"wpadminbar\" class=\"...\">...</div>",
 *  "assets": {
 *      "css": {
 *          "admin_bar": "[https://yoursite.com/wp-includes/css/admin-bar.min.css](https://yoursite.com/wp-includes/css/admin-bar.min.css)",
 *          "dashicons": "[https://yoursite.com/wp-includes/css/dashicons.min.css](https://yoursite.com/wp-includes/css/dashicons.min.css)"
 *      },
 *      "js": {
 *          "admin_bar": "[https://yoursite.com/wp-includes/js/admin-bar.min.js](https://yoursite.com/wp-includes/js/admin-bar.min.js)"
 *      }
 *  }
 * }
 * ```
 *
 * ### Error Responses
 * - Code: 400 Bad Request (`Empty user`) - Missing or invalid `user_id` parameter.
 * - Code: 401 Unauthorized (`rest_forbidden`) - Missing or invalid API key (handled by permission callback).
 *
 * @since 1.0.0
 * @access public
 *
 * @param WP_REST_Request $request The incoming REST API request object containing the path and user_id.
 * @return WP_REST_Response Response object containing success status, generated HTML, and required CSS/JS assets.
 */
function handle_get_admin_bar_response(WP_REST_Request $request): WP_REST_Response {

    // STEP 1: Set Up Global Scope and Require Classes
    // Because REST API requests do not run the standard frontend WordPress loop, many variables
    // and classes needed to render the admin bar are missing. We bring in essential global variables.
    global $post, $wp_admin_bar, $wp_query, $wp_the_query, $wp_styles, $wp_scripts, $wp_rewrite;

    // The WP_Admin_Bar class might not be loaded in a REST API context, so we manually require it.
    if (!class_exists('WP_Admin_Bar')) {
        if (file_exists(ABSPATH . WPINC . '/class-wp-admin-bar.php')) {
            require_once ABSPATH . WPINC . '/class-wp-admin-bar.php';
        }
    }

    // STEP 2: Initialize Core WordPress Objects
    // Check if the core globals exist. If they don't, create fresh instances.
    // This establishes the foundation needed to simulate a normal page load.
    $wp_admin_bar = new WP_Admin_Bar();

    if (!($wp_query instanceof WP_Query)) {
        $wp_query = new WP_Query();
    }
    if (!($wp_rewrite instanceof WP_Rewrite)) {
        $wp_rewrite = new WP_Rewrite();
    }
    if (!($wp_styles instanceof WP_Styles)) {
        $wp_styles = new WP_Styles();
    }
    if (!($wp_scripts instanceof WP_Scripts)) {
        $wp_scripts = new WP_Scripts();
    }

    // STEP 3: Authenticate the User Context
    /** @var string */
    $user_id = $request->get_param('user_id');

    if (!$user_id) {
        return new WP_REST_Response(['success' => false, 'error' => 'Empty user'], 400);
    }

    // Force WordPress to recognize the request as coming from this specific user.
    // This ensures the admin bar shows the correct personalized details and proper permission-based nodes.
    wp_set_current_user(absint($user_id));

    // STEP 4: Resolve the Requested Path
    /** @var string */
    $path = $request->get_param('path');
    $full_url = home_url((string)$path);
    $cleaned_path = trim((string)$path, '/');

    // Try to map the provided URL path to a specific WordPress post or page ID.
    $post_id = url_to_postid($full_url);
    $query_vars = [];

    if ($post_id) {
        // If it finds a match, set up the internal query variables ('p' or 'page_id').
        $target_post = get_post($post_id);
        if ($target_post) {
            $query_vars[$target_post->post_type === 'page' ? 'page_id' : 'p'] = $post_id;
        }
    } elseif ($cleaned_path === '') {
        // If the path is empty, check the WordPress reading settings to determine if the homepage is a static page or the blog archive, and set the query variables accordingly.
        $front_page_id = get_option('page_on_front');
        if ($front_page_id > 0) {
            $query_vars['page_id'] = $front_page_id;
        } else {
            $query_vars['is_home'] = 1;
        }
    }

    // STEP 5: Run the Simulated Query
    // @phpstan-ignore argument.type
    $wp_query->parse_query($query_vars);
    $posts = $wp_query->get_posts();

    // STEP 6: Establish the "Queried Object" Context
    // The WordPress admin bar relies heavily on knowing *what* is currently being viewed so it can
    // generate contextual links like "Edit Page". We manually inspect the query results and populate context.
    if ($wp_query->is_singular && !empty($posts)) {
        $post = $posts[0];

        $wp_query->queried_object = $post instanceof WP_Post ? $post : get_post($post);
        $wp_query->queried_object_id = $post instanceof WP_post ? $post->ID : $post;
    } elseif ($wp_query->is_archive || $wp_query->is_home) {
        $wp_query->queried_object = $wp_query->get_queried_object();

        if (isset($wp_query->queried_object->term_id)) {
            $wp_query->queried_object_id = is_numeric($wp_query->queried_object->term_id) ? absint($wp_query->queried_object->term_id) : 0;
        }
    }

    // STEP 7: Render and Capture the HTML
    $admin_bar_html = '';

    // Force the admin bar to display by adding a filter.
    add_filter('show_admin_bar', '__return_true', 999);

    // Initialize the standard admin bar hooks.
    _wp_admin_bar_init();
    do_action('admin_bar_init');

    // Use output buffering to intercept and capture the HTML that wp_admin_bar_render() echoes directly.
    ob_start();
        wp_admin_bar_render();
    $admin_bar_html = ob_get_clean();

    // STEP 8: Extract Required Assets
    // Load the default styles and scripts into the simulated queues so we can extract their direct URLs.
    wp_default_styles($wp_styles);
    wp_default_scripts($wp_scripts);

    // Set fallback paths for the required CSS and JS assets.
    $admin_bar_css = '/wp-includes/css/admin-bar.min.css';
    $dashicons_css = '/wp-includes/css/dashicons.min.css';
    $admin_bar_js  = '/wp-includes/js/admin-bar.min.js';

    // If WordPress has dynamically registered these assets (e.g., they have a version string),
    // extract their exact source URLs.
    if (isset($wp_styles->registered['admin-bar']->src)) {
        $admin_bar_css = $wp_styles->registered['admin-bar']->src;
    }
    if (isset($wp_styles->registered['dashicons']->src)) {
        $dashicons_css = $wp_styles->registered['dashicons']->src;
    }
    if (isset($wp_scripts->registered['admin-bar']->src)) {
        $admin_bar_js = $wp_scripts->registered['admin-bar']->src;
    }

    // Build an array of the absolute URLs to the required assets.
    $assets = [
        'css' => [
            'admin_bar' => site_url((string)$admin_bar_css),
            'dashicons' => site_url((string)$dashicons_css),
        ],
        'js' => [
            'admin_bar' => site_url((string)$admin_bar_js),
        ]
    ];

    // STEP 9: Return the Payload
    return new WP_REST_Response([
        'success' => true,
        'html'    => $admin_bar_html,
        'assets'  => $assets,
    ], 200);
}
