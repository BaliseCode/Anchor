<?php
// LOAD COMPOSER AUTO LOADER
include('vendor/autoload.php');

// LOAD EVERYTHING IN content
$files=glob(__DIR__."/app/content/*.php");
foreach ($files as $file) {
    require_once($file);
}
