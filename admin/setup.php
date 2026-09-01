<?php
/**
 * One-time install: creates the single admin account.
 *
 * Refuses to run once an account exists, so it cannot be used to take the
 * panel over later. Delete this file after you have signed in successfully.
 */

declare(strict_types=1);

require __DIR__ . '/_boot.php';

boot_session();

header('X-Frame-Options: DENY');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');

if (admin_exists()) {
    http_response_code(403);
    ?><!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Already installed</title><link rel="stylesheet" href="admin.css"></head>
<body><div class="login-shell"><div class="login-card">
<h1>Already set up</h1>
<p class="sub">An admin account exists, so this page is disabled.</p>
<p class="notice notice--err">
  For safety, delete <code>admin/setup.php</code> from the server.
</p>
<p><a href="index.php">Go to sign in &rarr;</a></p>
</div></div></body></html><?php
    exit;
}

$error = '';

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST') {
    $email = trim((string)($_POST['email'] ?? ''));
    $pass  = (string)($_POST['password'] ?? '');
    $again = (string)($_POST['password2'] ?? '');

    if (!csrf_ok($_POST['csrf'] ?? null)) {
        $error = 'Your session expired. Please try again.';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error = 'Enter a valid email address.';
    } elseif (strlen($pass) < 10) {
        $error = 'Use a password of at least 10 characters.';
    } elseif ($pass !== $again) {
        $error = 'The two passwords do not match.';
    } else {
        save_admin_account($email, $pass);
        session_regenerate_id(true);
        $_SESSION['admin_email'] = $email;
        $_SESSION['csrf']        = bin2hex(random_bytes(32));
        header('Location: index.php');
        exit;
    }
}

$token = csrf_token();
?><!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Set up admin · US Food Truck Factory</title>
<link rel="icon" href="../assets/images/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="admin.css">
</head>
<body>
<div class="login-shell">
  <form class="login-card" method="post" autocomplete="off">
    <h1>Create your admin account</h1>
    <p class="sub">This runs once. Afterwards the page locks itself.</p>

    <?php if ($error): ?>
      <p class="notice notice--err"><?= e($error) ?></p>
    <?php endif; ?>

    <div class="field">
      <label for="email">Your email</label>
      <input type="email" id="email" name="email" required autocomplete="username"
             value="<?= e((string)($_POST['email'] ?? '')) ?>">
    </div>

    <div class="field">
      <label for="password">Password (10+ characters)</label>
      <input type="password" id="password" name="password" required minlength="10"
             autocomplete="new-password">
    </div>

    <div class="field">
      <label for="password2">Repeat password</label>
      <input type="password" id="password2" name="password2" required minlength="10"
             autocomplete="new-password">
    </div>

    <input type="hidden" name="csrf" value="<?= e($token) ?>">
    <button class="btn btn--block" type="submit">Create account</button>

    <p class="sub" style="margin:18px 0 0">
      The password is stored only as a bcrypt hash &mdash; it is never written
      down in readable form, not even in the config file.
    </p>
  </form>
</div>
</body>
</html>
