<?php
/**
 * Form endpoint. The contact and quote forms POST here; the reply is JSON so
 * main.js can show an inline status without leaving the page.
 *
 * Stores the submission in data/submissions.sqlite, which admin/ then reads.
 */

declare(strict_types=1);

require __DIR__ . '/../admin/_boot.php';

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

function fail(int $code, string $message): void
{
    http_response_code($code);
    echo json_encode(['ok' => false, 'error' => $message]);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    fail(405, 'Method not allowed.');
}

/* --- spam gates -------------------------------------------------------- */

// The honeypot is hidden from people; only bots fill it. Answer 200 so the
// bot believes it succeeded and does not retry with a different shape.
if (trim((string)($_POST['_gotcha'] ?? '')) !== '') {
    echo json_encode(['ok' => true]);
    exit;
}

// One IP may not post more than 5 times in 10 minutes.
$ip = client_ip();
$recent = db()->prepare(
    "SELECT COUNT(*) c FROM submissions WHERE ip = ? AND created_at > datetime('now', '-10 minutes')");
$recent->execute([$ip]);
if ((int)$recent->fetch()['c'] >= 5) {
    fail(429, 'Too many messages from this connection. Please try again shortly.');
}

/* --- read + validate --------------------------------------------------- */

function field(string $key, int $max = 300): string
{
    $v = (string)($_POST[$key] ?? '');
    $v = trim(preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F]/u', '', $v) ?? '');
    return mb_substr($v, 0, $max);
}

$first   = field('first_name', 80);
$last    = field('last_name', 80);
$email   = field('email', 160);
$phone   = field('phone', 40);
$message = field('message', 4000);

$errors = [];
if ($first === '')   { $errors[] = 'First name is required.'; }
if ($last === '')    { $errors[] = 'Last name is required.'; }
if ($message === '') { $errors[] = 'Message is required.'; }
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'A valid email address is required.';
}
if ($errors) {
    fail(422, implode(' ', $errors));
}

/* --- everything else the form sent, kept for the detail view ----------- */

$core  = ['first_name', 'last_name', 'email', 'phone', 'message', '_gotcha', '_source'];
$extra = [];
foreach ($_POST as $k => $v) {
    if (in_array($k, $core, true) || !is_string($v)) {
        continue;
    }
    $clean = field($k, 300);
    if ($clean !== '') {
        $extra[mb_substr((string)$k, 0, 60)] = $clean;
    }
}

$source = field('_source', 40);
if ($source === '') {
    $source = isset($_POST['build_type']) ? 'quote' : 'contact';
}

/* --- store ------------------------------------------------------------- */

try {
    db()->prepare(
        'INSERT INTO submissions (created_at, source, name, email, phone, message, extra, ip)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    )->execute([
        gmdate('Y-m-d H:i:s'),
        $source,
        $first . ' ' . $last,
        $email,
        $phone,
        $message,
        json_encode($extra, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
        $ip,
    ]);
} catch (Throwable $err) {
    error_log('submit.php: ' . $err->getMessage());
    fail(500, 'We could not save your message. Please email us directly.');
}

echo json_encode(['ok' => true]);
