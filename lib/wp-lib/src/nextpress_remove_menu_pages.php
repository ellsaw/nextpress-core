<?php

add_action('admin_menu', function() {
    remove_menu_page('edit-comments.php');
    remove_submenu_page('options-general.php', 'options-permalink.php');
    remove_menu_page('themes.php');

    // Create a brand new top-level menu item for Customize
    add_menu_page(
        'Customize',                           // Page title
        'Customize',                           // Menu title
        'edit_theme_options',                  // Capability required to see it
        'customize.php',                       // Direct link to the Customizer
        '',                                    // No function needed for an existing file
        'dashicons-admin-appearance',          // Keeps the original brush icon from image_d5e315.png
        60                                     // Positions it right where Appearance used to be
    );
});

/* Hides the entire active theme control row in the Customizer */
add_action('customize_controls_print_styles', function() {
    ?>
    <style>
        #accordion-section-themes, #accordion-section-custom_css {
            display: none !important;
        }
    </style>
    <script>
        document.title = "<?php echo esc_js(get_bloginfo('name')); ?>";
    </script>
    <?php
});
