<?php

add_action('phpmailer_init', function($phpmailer) {
    if (WP_DEBUG) {
        $phpmailer->isSMTP();
        $phpmailer->Host       = 'mailpit';
        $phpmailer->Port       = 1025;
        $phpmailer->SMTPAuth   = false;
        $phpmailer->From       = 'wordpress@test.local';
        $phpmailer->FromName   = 'WordPress';
    }
});

add_filter('wp_mail_from', function($_original_email_address) {
    return 'wordpress@test.local';
});

