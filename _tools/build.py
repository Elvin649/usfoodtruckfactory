#!/usr/bin/env python3
"""
US Food Truck Factory — static page builder.

Wraps each body fragment in `_tools/bodies/*.html` with the shared header,
footer and <head>, and writes plain HTML to the project root.

The generated .html files are the deliverable — they need no server, no build
step and no dependencies. This script only exists so the header/footer stay in
sync across pages. Run it after editing anything in _tools/.

    python _tools/build.py
"""

import io
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BODIES = os.path.join(ROOT, '_tools', 'bodies')

# ---------------------------------------------------------------- site config
SITE = {
    'name':    'US Food Truck Factory',
    'origin':  'https://usfoodtruckfactory.com',
    'email':   'info@usfoodtruckfactory.com',
    'street':  '12105 Acton Ln',
    'city':    'Waldorf',
    'state':   'MD',
    'zip':     '20601',
}
SITE['address'] = '{street}, {city}, {state} {zip}'.format(**SITE)

# Social profiles. Paste the real profile URL over the TODO placeholder and
# re-run this script — the icon then appears in the footer automatically.
# Entries left as TODO are skipped, so the footer never shows a dead link.
TODO = 'TODO'

SOCIAL = [
    ('Facebook',  TODO,                                          'i-facebook'),
    ('Instagram', TODO,                                          'i-instagram'),
    ('YouTube',   TODO,                                          'i-youtube'),
    ('TikTok',    TODO,                                          'i-tiktok'),
]

# key, label, href
NAV = [
    ('home',     'Home',       'index.html'),
    ('services', 'Services',   'services.html'),
    ('builds',   'Our Builds', 'builds.html'),
    ('parts',    'Parts',      'parts.html'),
    ('about',    'About Us',   'about.html'),
    ('contact',  'Contact',    'contact.html'),
]

FOOTER_LINKS = [
    ('Home',       'index.html'),
    ('About Us',   'about.html'),
    ('Our Builds', 'builds.html'),
    ('Services',   'services.html'),
    ('Parts',      'parts.html'),
    ('Contact',    'contact.html'),
]

# file -> (nav key, <title>, meta description)
PAGES = [
    ('index.html', 'home',
     'US Food Truck Factory | Custom Food Trucks &amp; Concession Trailers in Maryland',
     'Turnkey custom food trucks, concession trailers and mobile kitchens designed and '
     'fabricated in Waldorf, Maryland. 660+ builds, 25+ years experience, shipped to all 50 states.'),

    ('services.html', 'services',
     'Services | Custom Builds, Remodels &amp; Repairs | US Food Truck Factory',
     'Custom food truck build-ups, concession trailer fabrication, full remodels and same-day '
     'repairs. From step vans to school buses to box trucks.'),

    ('builds.html', 'builds',
     'Our Builds | Food Truck &amp; Trailer Gallery | US Food Truck Factory',
     'Browse food trucks, concession trailers and mobile kitchens built by US Food Truck Factory, '
     'inside and out.'),

    ('parts.html', 'parts',
     'Food Truck Parts &amp; Equipment | US Food Truck Factory',
     'Commercial kitchen equipment for food trucks and trailers: ranges, fryers, prep tables, '
     'hoods, sinks and generators.'),

    ('about.html', 'about',
     'About Us | 25+ Years of Mobile Kitchen Fabrication | US Food Truck Factory',
     'Fabricators, electricians, technicians and installers building code-compliant mobile '
     'kitchens in Waldorf, Maryland since 1999.'),

    ('contact.html', 'contact',
     'Contact Us | US Food Truck Factory',
     'Send us a message. Our team is standing by to answer your questions '
     'about custom food trucks, trailers and repairs.'),

    ('quote.html', 'quote',
     'Get a Free Quote | US Food Truck Factory',
     'Tell us about your build and get a free, no-obligation quote on a custom food truck, '
     'concession trailer or mobile kitchen.'),
    ('404.html', '',
     'Page Not Found | US Food Truck Factory',
     'That page could not be found. Browse our services, builds and contact details instead.'),
]

# ------------------------------------------------------------------- partials


def head(page, title, desc):
    canonical = SITE['origin'] + ('/' if page == 'index.html' else '/' + page)
    og_image = SITE['origin'] + '/assets/images/hero-bbq-truck.jpg'
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<link rel="canonical" href="{canonical}">

<meta property="og:type" content="website">
<meta property="og:site_name" content="{SITE['name']}">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:url" content="{canonical}">
<meta property="og:image" content="{og_image}">
<meta name="twitter:card" content="summary_large_image">

<meta name="theme-color" content="#0E3164">
<link rel="icon" href="assets/images/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="assets/images/apple-touch-icon.png">

<link rel="preload" as="font" type="font/woff2" crossorigin
      href="assets/fonts/inter-variable-latin.woff2">
<link rel="preload" as="font" type="font/woff2" crossorigin
      href="assets/fonts/poppins-700-latin.woff2">
<link rel="stylesheet" href="assets/css/fonts.css">
<link rel="stylesheet" href="assets/css/style.css">
<link rel="stylesheet" href="assets/css/components.css">

<!-- Reveal-on-scroll starts elements at opacity 0 and JavaScript brings them
     in. If the script never runs, show everything immediately rather than
     serving a blank page. -->
<noscript><style>
  .reveal {{ opacity: 1 !important; animation: none !important; }}
</style></noscript>
</head>
<body>

<a class="skip-link" href="#main">Skip to content</a>
'''


def header(active):
    items = []
    for key, label, href in NAV:
        cur = ' aria-current="page"' if key == active else ''
        items.append(f'        <li><a href="{href}"{cur}>{label}</a></li>')
    nav = '\n'.join(items)

    return f'''
<header class="site-header">
  <div class="container header-inner">
    <a class="brand" href="index.html" aria-label="{SITE['name']} &mdash; home">
      <img src="assets/images/logo.png" alt="{SITE['name']}" width="356" height="160">
    </a>

    <nav class="main-nav" id="main-nav" aria-label="Main">
      <ul>
{nav}
      </ul>
    </nav>

    <div class="header-cta">
      <a class="btn btn--primary btn--sm" href="quote.html">Get a Quote</a>
    </div>

    <button class="nav-toggle" type="button" aria-label="Open menu"
            aria-controls="main-nav" aria-expanded="false">
      <span></span>
    </button>
  </div>
</header>
'''


def footer():
    links = '\n'.join(
        f'          <li><a href="{href}">{label}</a></li>'
        for label, href in FOOTER_LINKS)

    live = [x for x in SOCIAL if x[1] != TODO]

    social = '\n'.join(
        f'''          <a href="{url}" aria-label="{name}" target="_blank" rel="noopener">
            <svg class="icon" aria-hidden="true"><use href="#{icon}"></use></svg>
          </a>'''
        for name, url, icon in live)

    # With no profile configured there is nothing to follow, so the column is
    # dropped rather than rendered empty. Add a URL in SOCIAL and it comes back.
    social_col = '' if not live else f'''
      <div class="footer-col">
        <h3>Follow Us</h3>
        <div class="social-row">
{social}
        </div>
      </div>
'''
    grid_mod = '' if live else ' footer-grid--2'

    return f'''
<footer class="site-footer">
  <div class="container">
    <div class="footer-grid{grid_mod}">

      <div class="footer-brand">
        <span class="logo-chip">
          <img src="assets/images/logo.png" alt="{SITE['name']}" width="356" height="160">
        </span>
        <p class="footer-blurb">
          Custom food trucks, concession trailers, and mobile kitchens&mdash;fabricated
          in {SITE['city']}, Maryland and delivered nationwide.
        </p>
        <ul class="footer-contact">
          <li>
            <svg class="icon" aria-hidden="true"><use href="#i-pin"></use></svg>
            <span>{SITE['address']}</span>
          </li>
          <li>
            <svg class="icon" aria-hidden="true"><use href="#i-mail"></use></svg>
            <a href="mailto:{SITE['email']}">{SITE['email']}</a>
          </li>
        </ul>
      </div>

      <div class="footer-col">
        <h3>Quick Links</h3>
        <ul class="footer-links">
{links}
        </ul>
      </div>
{social_col}
    </div>
  </div>
  <div class="footer-bottom">
    <div class="container">
      &copy; <span data-year>2026</span> {SITE['name']}. All rights reserved.
    </div>
  </div>
</footer>

<script src="assets/js/icons.js"></script>
<script src="assets/js/main.js"></script>
</body>
</html>
'''


JSONLD = '''
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "US Food Truck Factory",
  "url": "https://usfoodtruckfactory.com/",
  "image": "https://usfoodtruckfactory.com/assets/images/logo.png",
  "email": "info@usfoodtruckfactory.com",
  "priceRange": "$$$",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "12105 Acton Ln",
    "addressLocality": "Waldorf",
    "addressRegion": "MD",
    "postalCode": "20601",
    "addressCountry": "US"
  },
  "areaServed": "US",
  "description": "Custom food trucks, concession trailers and mobile kitchens fabricated in Waldorf, Maryland.",
"sameAs": []
}
</script>
'''


# ----------------------------------------------------------------- build loop
def build():
    if not os.path.isdir(BODIES):
        sys.exit('missing directory: ' + BODIES)

    written = []
    for page, active, title, desc in PAGES:
        src = os.path.join(BODIES, page)
        if not os.path.exists(src):
            print('  skip (no body):', page)
            continue

        body = io.open(src, encoding='utf-8').read().rstrip() + '\n'
        out = head(page, title, desc) + header(active) + body + footer()

        # LocalBusiness markup belongs on the home page only
        if page == 'index.html':
            out = out.replace('</head>', JSONLD.strip() + '\n</head>')

        io.open(os.path.join(ROOT, page), 'w', encoding='utf-8', newline='\n').write(out)
        written.append(page)

    print('built {} page(s): {}'.format(len(written), ', '.join(written)))


if __name__ == '__main__':
    build()
