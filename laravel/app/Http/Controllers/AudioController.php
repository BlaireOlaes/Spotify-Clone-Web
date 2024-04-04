<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AudioController extends Controller
{
    public function serveAudio($filename)
    {
        $path = storage_path('/public/uploads/' . $filename);

        if (!file_exists($path)) {
            abort(404);
        }

        $file = new \SplFileObject($path, 'r');

        $start = 0;
        $length = $file->getSize();

        if (isset($_SERVER['HTTP_RANGE'])) {
            list(, $range) = explode('=', $_SERVER['HTTP_RANGE'], 2);

            list($start, $rangeEnd) = explode('-', $range, 2);

            $start = (int)$start;
            $end = $rangeEnd ? (int)$rangeEnd : $length - 1;

            header('HTTP/1.1 206 Partial Content');
            header('Content-Range: bytes ' . $start . '-' . $end . '/' . $length);
        } else {
            header('HTTP/1.1 200 OK');
        }

        header('Content-Type: audio/mpeg');
        header('Accept-Ranges: bytes');
        header('Content-Length: ' . ($length - $start));

        $file->fseek($start);

        while (!$file->eof() && $file->ftell() <= $end) {
            echo $file->fread(1024);
        }
    }
}