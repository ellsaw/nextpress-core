<?php

add_action('init', 'nextpress_disable_comments_post_types_support');
function nextpress_disable_comments_post_types_support(): void {
    $post_types = get_post_types();
    foreach ($post_types as $post_type) {
        if (post_type_supports($post_type, 'comments')) {
            remove_post_type_support($post_type, 'comments');
            remove_post_type_support($post_type, 'trackbacks');
        }
    }
}

add_filter('comments_open', '__return_false', 20);
add_filter('pings_open', '__return_false', 20);

add_filter('comments_array', '__return_empty_array', 10);
