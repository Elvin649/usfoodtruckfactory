<?php
/** Ends the admin session and clears its cookie. */

declare(strict_types=1);

require __DIR__ . '/_boot.php';

boot_session();

$_SESSION = [];

if (ini_get('session.use_cookies')) {
    $p = session_get_cookie_params();
    setcookie(session_name(), '', [
        'expires'  => time() - 42000,
        'path'     => $p['path'],
        'domain'   => $p['domain'],
        'secure'   => $p['secure'],
        'httponly' => $p['httponly'],
        'samesite' => 'Strict',
    ]);
}

session_destroy();

header('Location: index.php');
exit;
