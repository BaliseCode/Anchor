<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet">
    <title>@yield('title')</title>
    <style media="screen">
    body {
        font-family: 'Nunito', sans-serif;
    }
    .centeredContent {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        width: 100%;
        padding: 5%;
        box-sizing: border-box;
        text-align: center;
    }
    h1 {
        font-weight: 400;
        line-height: 1.1;

        font-size: 33vmin;
    }
    h1 small {
        font-size: 26px;
        display: block;
    }
    </style>
</head>
<body>
    @yield('body')
</body>
</html>
