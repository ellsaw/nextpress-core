<?php

if (!function_exists('getenv_docker')) {
    function getenv_docker(string $env, string $default = ''): mixed {
        return '';
    }
}

if (!defined('WPINC')) {
    define('WPINC', 'wp-includes');
}
if (!defined('ABSPATH')) {
    define('ABSPATH', __DIR__ . '/');
}
