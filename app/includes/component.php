<?php

function component($name, $attr = array())
{
    $dir = get_template_directory();


    $tries = [
        $dir . '/app/components/' . $name . '.php',
        $dir . '/app/components/' . $name . '/index.php',
        $dir . '/app/components/' . $name . '/' . $name . '.php'
    ];
    foreach ($tries as $file) {
        if (file_exists($file)) {

            extract($attr);
            require($file);
            break;
        }
    }
}
