<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email</title>
    <style>
        body,
        html {
            margin: 0;
            padding: 0;
            height: 100%;
        }

        body {
            font-family: Arial, sans-serif;
            background: linear-gradient(to top, rgb(0, 0, 0), #5c0000);
            color: white;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100vh;
            overflow: hidden;
        }

        .button:hover {
            background-color: black;
            color: white;
            transition: 1s !important;
        }

        .button {
            background-color: #8C0303;
            border: 2px solid white;
            border-radius: 10px;
            color: white;
            padding: 15px 32px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            cursor: pointer;
            margin: auto;
        }
    </style>
</head>

<body>
    <h1>Spotitube</h1>
    <h2>Good News {{ $user->name }}</h2>
    <p style="text-align: center">Dear <span style="font-weight: bold">{{ $user->name }}</span>,
        Your Account has been UnBanned</p>
</body>

</html>
