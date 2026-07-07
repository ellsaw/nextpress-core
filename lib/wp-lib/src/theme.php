<?php

namespace Nextpress;

/**
 * Handles operations that should occur upon switching themes.
 *
 * @return void
 */
function nextpress_switch_theme(): void
{
    nextpress_migrate_paths();
}

/**
 * Sets up theme defaults and registers support for various WordPress features.
 *
 * @return void
 */
function nextpress_setup_theme(): void
{
    // Adds support for the Custom Logo feature, allowing site administrators to easily upload and manage a site logo through the WordPress Customizer.
    add_theme_support('custom-logo');

    // Enables support for Featured Images
    // This allows users to attach a main image to posts, pages, or custom post types.
    add_theme_support('post-thumbnails');

    // Disables the default, out-of-the-box block patterns that come bundled with WordPress.
    remove_theme_support('core-block-patterns');
}
