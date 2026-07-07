<?php

namespace Nextpress;

/**
 * Block updates and notifications ONLY for WordPress Core and Secure Custom Fields.
 * Allows translations, other plugins, and themes to update normally.
 */

// Block updates and notifications only for WordPress Core
add_filter('pre_site_transient_update_core', function($transient) {
    if (!\is_object($transient)) {
        $transient = new \stdClass();
    }

    $transient->updates = [];
    $transient->response = [];

    if (!isset($transient->version_checked)) {
        global $wp_version;
        $transient->version_checked = isset($wp_version) ? $wp_version : '';
    }

    if (!isset($transient->last_checked)) {
        $transient->last_checked = time();
    }

    return $transient;
});

// Intercept Plugin update checks specifically for Secure Custom Fields
add_filter('site_transient_update_plugins', function($transient) {
    if (!\is_object($transient) || !isset($transient->response)) {
        return $transient;
    }

    // The target slug for Secure Custom Fields
    $scf_slug = 'secure-custom-fields/secure-custom-fields.php';

    // If an update is waiting for SCF, strip it out of the notification loop
    if (property_exists($transient, 'response') && is_array($transient->response) && isset($transient->response[$scf_slug])) {
        unset($transient->response[$scf_slug]);
    }

    return $transient;
});

// Block automatic background updates for Core and SCF
add_filter('auto_update_core', '__return_false');
add_filter('auto_update_plugin', function($update, $item) {
    if (\is_object($item) && isset($item->plugin) && $item->plugin === 'advanced-custom-fields/acf.php') {
        return false;
    }
    return $update;
}, 10, 2);
