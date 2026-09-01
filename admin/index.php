<?php
/**
 * Admin panel — login, submission list, submission detail.
 *
 * One controller so /admin is the only URL anyone needs to remember.
 */

declare(strict_types=1);

require __DIR__ . '/_boot.php';

boot_session();

// No account yet? The install step has to run first.
if (!admin_exists()) {
    header('Location: setup.php');
    exit;
}

header('X-Frame-Options: DENY');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');

$error  = '';
$notice = '';

/* =========================================================================
   Login
   ====================================================================== */
if (!is_logged_in()) {

    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST') {
        $ip = client_ip();

        if (!csrf_ok($_POST['csrf'] ?? null)) {
            $error = 'Your session expired. Please try again.';
        } elseif (is_locked_out($ip)) {
            $error = 'Too many failed attempts. Try again in 15 minutes.';
        } else {
            $account = admin_account();
            $email   = trim((string)($_POST['email'] ?? ''));
            $pass    = (string)($_POST['password'] ?? '');

            $emailOk = hash_equals(strtolower($account['email']), strtolower($email));
            $passOk  = password_verify($pass, $account['hash']);

            if ($emailOk && $passOk) {
                session_regenerate_id(true);          // block session fixation
                $_SESSION['admin_email'] = $account['email'];
                $_SESSION['csrf']        = bin2hex(random_bytes(32));
                clear_login_attempts($ip);
                header('Location: index.php');
                exit;
            }

            record_failed_login($ip);
            $left = MAX_LOGIN_ATTEMPTS - attempts_recent($ip);
            // Deliberately vague: naming which half was wrong would let someone
            // confirm the admin address.
            $error = 'Email or password is incorrect.'
                   . ($left > 0 && $left <= 2 ? " {$left} attempt(s) left." : '');
        }
    }

    $token = csrf_token();
    ?><!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Sign in · US Food Truck Factory</title>
<link rel="icon" href="../assets/images/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="admin.css">
</head>
<body>
<div class="login-shell">
  <form class="login-card" method="post" autocomplete="on">
    <h1>US Food Truck Factory</h1>
    <p class="sub">Sign in to view enquiries.</p>

    <?php if ($error): ?>
      <p class="notice notice--err"><?= e($error) ?></p>
    <?php endif; ?>

    <div class="field">
      <label for="email">Email</label>
      <input type="email" id="email" name="email" required autocomplete="username"
             value="<?= e((string)($_POST['email'] ?? '')) ?>">
    </div>

    <div class="field">
      <label for="password">Password</label>
      <input type="password" id="password" name="password" required
             autocomplete="current-password">
    </div>

    <input type="hidden" name="csrf" value="<?= e($token) ?>">
    <button class="btn btn--block" type="submit">Sign in</button>
  </form>
</div>
</body>
</html><?php
    exit;
}

/* =========================================================================
   Signed in
   ====================================================================== */

/* --- actions ----------------------------------------------------------- */
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST') {
    if (!csrf_ok($_POST['csrf'] ?? null)) {
        $error = 'Your session expired. Please try that again.';
    } else {
        $id     = (int)($_POST['id'] ?? 0);
        $action = (string)($_POST['action'] ?? '');

        if ($id > 0 && $action === 'delete') {
            db()->prepare('DELETE FROM submissions WHERE id = ?')->execute([$id]);
            header('Location: index.php?deleted=1');
            exit;
        }
        if ($id > 0 && $action === 'unread') {
            db()->prepare('UPDATE submissions SET is_read = 0 WHERE id = ?')->execute([$id]);
            header('Location: index.php');
            exit;
        }
    }
}
if (isset($_GET['deleted'])) {
    $notice = 'Enquiry deleted.';
}

$filter = ($_GET['filter'] ?? '') === 'unread' ? 'unread' : 'all';
$viewId = (int)($_GET['id'] ?? 0);

$unreadCount = (int)db()->query('SELECT COUNT(*) c FROM submissions WHERE is_read = 0')
                        ->fetch()['c'];
$totalCount  = (int)db()->query('SELECT COUNT(*) c FROM submissions')->fetch()['c'];

/* --- detail view ------------------------------------------------------- */
$row = null;
if ($viewId > 0) {
    $stmt = db()->prepare('SELECT * FROM submissions WHERE id = ?');
    $stmt->execute([$viewId]);
    $row = $stmt->fetch() ?: null;

    if ($row && (int)$row['is_read'] === 0) {
        db()->prepare('UPDATE submissions SET is_read = 1 WHERE id = ?')->execute([$viewId]);
        $row['is_read'] = 1;
        $unreadCount = max(0, $unreadCount - 1);
    }
}

/* --- list view --------------------------------------------------------- */
$rows = [];
if (!$row) {
    $sql = 'SELECT id, created_at, source, name, email, phone, message, is_read
            FROM submissions'
         . ($filter === 'unread' ? ' WHERE is_read = 0' : '')
         . ' ORDER BY created_at DESC, id DESC LIMIT 300';
    $rows = db()->query($sql)->fetchAll();
}

$token = csrf_token();
?><!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title><?= $row ? 'Enquiry · ' : 'Enquiries · ' ?>US Food Truck Factory</title>
<link rel="icon" href="../assets/images/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="admin.css">
</head>
<body>

<header class="topbar">
  <h1>US Food Truck Factory</h1>
  <span class="who"><?= e($_SESSION['admin_email']) ?> · <a href="logout.php">Sign out</a></span>
</header>

<main class="wrap">

<?php if ($notice): ?><p class="notice notice--ok"><?= e($notice) ?></p><?php endif; ?>
<?php if ($error):  ?><p class="notice notice--err"><?= e($error) ?></p><?php endif; ?>

<?php if ($row): ?>
  <!-- ------------------------------------------------------------ detail -->
  <p style="margin-bottom:18px"><a href="index.php">&larr; All enquiries</a></p>

  <article class="detail">
    <h2><?= e($row['name']) ?></h2>
    <p class="meta">
      <?= e(human_date($row['created_at'])) ?> ·
      <span class="pill <?= $row['source'] === 'quote' ? 'pill--quote' : '' ?>">
        <?= e($row['source'] === 'quote' ? 'Quote request' : 'Contact form') ?>
      </span>
    </p>

    <dl class="facts">
      <dt>Email</dt>
      <dd><a href="mailto:<?= e($row['email']) ?>"><?= e($row['email']) ?></a></dd>

      <dt>Phone</dt>
      <dd><?= $row['phone'] !== '' ? e($row['phone']) : '<span style="color:#7B879C">not given</span>' ?></dd>

      <?php
      $extra = json_decode((string)$row['extra'], true);
      if (is_array($extra)) {
          foreach ($extra as $k => $v) {
              $label = ucwords(str_replace('_', ' ', (string)$k));
              echo '<dt>' . e($label) . '</dt><dd>' . e((string)$v) . '</dd>';
          }
      }
      ?>
    </dl>

    <h3 style="font-size:14px;text-transform:uppercase;letter-spacing:.05em;margin-bottom:10px">Message</h3>
    <div class="message-box"><?= e($row['message']) ?></div>

    <div class="actions">
      <a class="btn btn--sm" href="mailto:<?= e($row['email']) ?>">Reply by email</a>

      <form method="post" style="display:inline">
        <input type="hidden" name="csrf" value="<?= e($token) ?>">
        <input type="hidden" name="id" value="<?= (int)$row['id'] ?>">
        <input type="hidden" name="action" value="unread">
        <button class="btn btn--ghost btn--sm" type="submit">Mark unread</button>
      </form>

      <form method="post" style="display:inline"
            onsubmit="return confirm('Delete this enquiry permanently?')">
        <input type="hidden" name="csrf" value="<?= e($token) ?>">
        <input type="hidden" name="id" value="<?= (int)$row['id'] ?>">
        <input type="hidden" name="action" value="delete">
        <button class="btn btn--danger btn--sm" type="submit">Delete</button>
      </form>
    </div>
  </article>

<?php else: ?>
  <!-- -------------------------------------------------------------- list -->
  <div class="head-row">
    <h2>Enquiries</h2>
    <span class="count"><?= $totalCount ?> total · <?= $unreadCount ?> unread</span>
  </div>

  <nav class="tabs">
    <a href="index.php" aria-current="<?= $filter === 'all' ? 'true' : 'false' ?>">All</a>
    <a href="index.php?filter=unread" aria-current="<?= $filter === 'unread' ? 'true' : 'false' ?>">
      Unread<?= $unreadCount ? ' (' . $unreadCount . ')' : '' ?>
    </a>
  </nav>

  <div class="table-wrap">
    <?php if (!$rows): ?>
      <p class="empty">
        <?= $filter === 'unread' ? 'Nothing unread.' : 'No enquiries yet.' ?>
      </p>
    <?php else: ?>
      <table>
        <thead>
          <tr>
            <th>Received</th>
            <th>Name</th>
            <th class="hide-sm">Phone</th>
            <th class="hide-sm">Email</th>
            <th class="hide-sm">Message</th>
            <th>Form</th>
          </tr>
        </thead>
        <tbody>
        <?php foreach ($rows as $r): ?>
          <tr class="<?= (int)$r['is_read'] === 0 ? 'unread' : '' ?>">
            <td class="nowrap"><?= e(human_date($r['created_at'])) ?></td>
            <td class="name">
              <a href="index.php?id=<?= (int)$r['id'] ?>"><?= e($r['name']) ?></a>
            </td>
            <td class="hide-sm nowrap"><?= $r['phone'] !== '' ? e($r['phone']) : '—' ?></td>
            <td class="hide-sm"><?= e($r['email']) ?></td>
            <td class="hide-sm"><span class="snippet"><?= e($r['message']) ?></span></td>
            <td>
              <span class="pill <?= $r['source'] === 'quote' ? 'pill--quote' : '' ?>">
                <?= e($r['source'] === 'quote' ? 'Quote' : 'Contact') ?>
              </span>
            </td>
          </tr>
        <?php endforeach; ?>
        </tbody>
      </table>
    <?php endif; ?>
  </div>
<?php endif; ?>

</main>
</body>
</html>
