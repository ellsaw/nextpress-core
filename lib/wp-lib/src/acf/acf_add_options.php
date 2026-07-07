<?php

namespace Nextpress\ACF;

/**
 * Registers a custom global ACF options page for App Options.
 *
 * @return void
 */
function acf_add_options(): void {
    \acf_add_options_page([
        'page_title' => "App Options",
        'menu_title' => "App Options",
        'menu_slug' => "app_options",
        'capability' => "manage_options",
        'redirect' => false,
    ]);
}
