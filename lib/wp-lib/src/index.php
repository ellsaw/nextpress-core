<?php

namespace Nextpress;

\defined('ABSPATH') or die;

require_once __DIR__ . '/api/nextpress_validate_user_session.php';
require_once __DIR__ . '/api/nextpress_get_admin_bar.php';
require_once __DIR__ . '/nextpress_save_path.php';
require_once __DIR__ . '/nextpress_revalidate_frontend.php';
require_once __DIR__ . '/nextpress_remove_menu_pages.php';
require_once __DIR__ . '/nextpress_remove_comments.php';
require_once __DIR__ . '/nextpress_disable_core_depency_updates.php';
require_once __DIR__ . '/nextpress_dev_mailer_setup.php';
require_once __DIR__ . '/theme.php';

require_once __DIR__ . '/acf/acf.php';

add_action('after_setup_theme', fn() => nextpress_setup_theme());

add_action('after_switch_theme', fn() => nextpress_switch_theme());

add_action('save_post', fn(int $_post_id, \WP_Post $post, bool $_update) => nextpress_save_post_path($post), 10, 3 );
add_action('saved_term', fn(int $term_id, int $_tt_id, string $taxonomy) => nextpress_save_term_path($term_id, $taxonomy), 10, 3);

add_action('admin_init', fn() => nextpress_revalidate_frontend());
