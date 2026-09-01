/* ==========================================================================
   US Food Truck Factory — SVG sprite
   Injects <symbol> definitions once, so pages can reference them with
   <svg class="icon"><use href="#i-truck"></use></svg>
   Works from file:// as well as http(s) — nothing is fetched.
   ========================================================================== */
(function () {
  'use strict';

  var SPRITE = [
    '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"',
    ' style="position:absolute;width:0;height:0;overflow:hidden">',

    /* ------------------------------------------------------- BRAND / TRUST */
    '<symbol id="i-flag-usa" viewBox="0 0 48 48">',
      /* 6 stripe bands over a 40x26 field; the top three are interrupted by the
         canton, exactly as on the real flag — the old icon ran every stripe
         straight through the star field, which is what made it read as noise */
      '<path d="M4 11h40v26H4z"/>',
      '<path d="M20 15.3h24M20 19.7h24M4 24h40M4 28.3h40M4 32.7h40"/>',
      '<path class="accent" d="M4 11h16v13H4z"/>',
      '<path class="accent" d="M7.5 14.5h.01M12 14.5h.01M16.5 14.5h.01'
        + 'M9.75 17.5h.01M14.25 17.5h.01'
        + 'M7.5 20.5h.01M12 20.5h.01M16.5 20.5h.01"/>',
    '</symbol>',

    '<symbol id="i-shield-check" viewBox="0 0 48 48">',
      '<path class="accent" d="M24 4l17 6v13c0 11-7.6 18.4-17 21C14.6 41.4 7 34 7 23V10z"/>',
      '<path d="M16 23.5l5.5 5.5L33 18"/>',
    '</symbol>',

    '<symbol id="i-turnkey" viewBox="0 0 48 48">',
      '<path class="accent" d="M31.5 6.5a7.5 7.5 0 00-9.8 9.8L8.4 29.6a3.5 3.5 0 105 5l13.3-13.3a7.5 7.5 0 009.8-9.8l-4.6 4.6-4.4-1.1-1.1-4.4z"/>',
      '<path d="M17.5 8.5l-6 6 4 4M13 12.5L9 8.5"/>',
      '<path d="M30 30l9 9M27 27l3 3"/>',
    '</symbol>',

    /* --------------------------------------------------------- SERVICE SET */
    '<symbol id="i-food-truck" viewBox="0 0 48 48">',
      '<path class="accent" d="M4 32V13h26v19z"/>',
      '<path d="M30 20h7l6 7v5h-13z"/>',
      '<path class="accent" d="M8 17h13v8H8z"/>',
      '<path d="M4 17l-1 3"/>',
      '<circle cx="14" cy="36" r="4"/><circle cx="35" cy="36" r="4"/>',
      '<path d="M18 36h13M4 36h6M39 36h4"/>',
    '</symbol>',

    '<symbol id="i-trailer" viewBox="0 0 48 48">',
      '<path class="accent" d="M8 32V12h30v20z"/>',
      '<path d="M13 17h12v8H13z"/>',
      '<path class="accent" d="M29 17h5v15h-5z"/>',
      '<path d="M8 32H3M38 32h7"/>',
      '<circle cx="15" cy="36" r="3.5"/><circle cx="25" cy="36" r="3.5"/>',
      '<path d="M8 24l-5 3"/>',
    '</symbol>',

    '<symbol id="i-repair" viewBox="0 0 48 48">',
      '<path class="accent" d="M20 6a7 7 0 00-9 9L4 22a3 3 0 104 4l7-7a7 7 0 009-9l-4 4-4-1-1-4z"/>',
      '<path d="M12 26v16h32V26z"/>',
      '<path d="M28 26v16M20 33h.01M36 33h.01"/>',
      '<path class="accent" d="M36 26v-6a4 4 0 018 0"/>',
    '</symbol>',

    /* --------------------------------------------------------- PROCESS SET */
    '<symbol id="i-consult" viewBox="0 0 48 48">',
      '<path class="accent" d="M13 6h16a3 3 0 013 3v8a3 3 0 01-3 3h-9l-5 4v-4h-2a3 3 0 01-3-3V9a3 3 0 013-3z"/>',
      '<path d="M31 15h6a3 3 0 013 3v6a3 3 0 01-3 3v3l-4-3h-4"/>',
      '<circle class="accent" cx="12" cy="31" r="5"/>',
      '<path class="accent" d="M4 44v-2a8 8 0 0116 0v2"/>',
      '<circle cx="36" cy="33" r="4.5"/>',
      '<path d="M29 44v-2a7 7 0 0114 0v2"/>',
    '</symbol>',

    '<symbol id="i-design" viewBox="0 0 48 48">',
      '<path class="accent" d="M16 6H9a3 3 0 00-3 3v30a3 3 0 003 3h30a3 3 0 003-3v-7"/>',
      '<path d="M38.5 5.5a4.6 4.6 0 016.5 6.5L25 32l-9 3 3-9z"/>',
      '<path class="accent" d="M35 9l5 5"/>',
    '</symbol>',

    '<symbol id="i-build" viewBox="0 0 48 48">',
      '<path class="accent" d="M18 8a8 8 0 00-10.6 10.6L4 22a3.5 3.5 0 105 5l3.4-3.4A8 8 0 0023 13l-4.5 4.5-4.2-1.1-1.1-4.2z"/>',
      '<path d="M30 6l12 12-4 4-12-12z"/>',
      '<path d="M26 14L10 30a4 4 0 105.6 5.6L31 19"/>',
    '</symbol>',

    '<symbol id="i-deliver" viewBox="0 0 48 48">',
      '<path class="accent" d="M14 32V14h16v18z"/>',
      '<path d="M30 20h6l6 7v5h-12z"/>',
      '<circle cx="21" cy="36" r="3.5"/><circle cx="35" cy="36" r="3.5"/>',
      '<path d="M25 36h6"/>',
      '<path class="accent" d="M10 18H3M10 24H6M10 30H3"/>',
    '</symbol>',

    /* ----------------------------------------------------------- STATS SET */
    '<symbol id="i-custom-builds" viewBox="0 0 48 48">',
      '<circle class="accent" cx="24" cy="24" r="20"/>',
      '<path d="M10 28V17h16v11z"/>',
      '<path d="M26 21h5l4 5v2h-9z"/>',
      '<path d="M13 20h8v5h-8z"/>',
      '<circle cx="17" cy="31" r="2.6"/><circle cx="31" cy="31" r="2.6"/>',
    '</symbol>',

    '<symbol id="i-experience" viewBox="0 0 48 48">',
      '<circle class="accent" cx="24" cy="24" r="20"/>',
      '<path d="M24 12l3.8 7.8 8.6 1.2-6.2 6 1.5 8.5L24 31.5 16.3 35.5l1.5-8.5-6.2-6 8.6-1.2z"/>',
      '<path class="accent" d="M12 34l1.5 3 3 1.5-3 1.5L12 43l-1.5-3-3-1.5 3-1.5zM36 8l1.2 2.4 2.4 1.2-2.4 1.2L36 16l-1.2-2.4-2.4-1.2 2.4-1.2z"/>',
    '</symbol>',

    '<symbol id="i-states" viewBox="0 0 48 48">',
      '<circle class="accent" cx="24" cy="24" r="20"/>',
      '<path d="M8 20l4-3 5 1 4-3 6 2 5-3 6 2 2 5-3 4 1 5-5 3-6-1-5 3-6-2-5 2-2-5 3-4z"/>',
    '</symbol>',

    /* ----------------------------------------------------------- EQUIPMENT */
    '<symbol id="i-burner" viewBox="0 0 48 48">',
      '<rect x="6" y="10" width="36" height="28" rx="3"/>',
      '<circle class="accent" cx="16" cy="20" r="5"/><circle class="accent" cx="32" cy="20" r="5"/>',
      '<path class="accent" d="M12 31h8M28 31h8"/>',
    '</symbol>',

    '<symbol id="i-fryer" viewBox="0 0 48 48">',
      '<path d="M8 14h32v24a4 4 0 01-4 4H12a4 4 0 01-4-4z"/>',
      '<path class="accent" d="M14 22h20v14H14z"/>',
      '<path d="M34 14V8h8"/>',
      '<path class="accent" d="M8 18h32"/>',
    '</symbol>',

    '<symbol id="i-fridge" viewBox="0 0 48 48">',
      '<rect x="11" y="5" width="26" height="38" rx="3"/>',
      '<path d="M11 20h26"/>',
      '<path class="accent" d="M16 12v5M16 26v6"/>',
    '</symbol>',

    '<symbol id="i-hood" viewBox="0 0 48 48">',
      '<path d="M6 20l8-12h20l8 12z"/>',
      '<path class="accent" d="M6 20h36v6H6z"/>',
      '<path class="accent" d="M14 32v8M24 32v8M34 32v8"/>',
    '</symbol>',

    '<symbol id="i-sink" viewBox="0 0 48 48">',
      '<path d="M5 22h38v14a4 4 0 01-4 4H9a4 4 0 01-4-4z"/>',
      '<path class="accent" d="M18 22V12a5 5 0 0110 0"/>',
      '<path d="M17 22v18M31 22v18"/>',
    '</symbol>',

    '<symbol id="i-generator" viewBox="0 0 48 48">',
      '<rect x="5" y="14" width="38" height="22" rx="3"/>',
      '<path class="accent" d="M22 19l-5 8h6l-3 7 9-9h-6l4-6z"/>',
      '<path d="M12 36v5M36 36v5"/>',
    '</symbol>',

    '<symbol id="i-prep-table" viewBox="0 0 48 48">',
      '<path d="M4 16h40v8H4z"/>',
      '<path class="accent" d="M10 16v-4h10v4M28 16v-4h10v4"/>',
      '<path d="M8 24v18M40 24v18M8 33h32"/>',
    '</symbol>',

    /* -------------------------------------------------------------- UI SET */
    '<symbol id="i-phone" viewBox="0 0 24 24">',
      '<path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1 1 .4 1.9.7 2.8a2 2 0 01-.5 2.1L8.1 9.9a16 16 0 006 6l1.3-1.2a2 2 0 012.1-.5c.9.3 1.8.6 2.8.7a2 2 0 011.7 2z"/>',
    '</symbol>',
    '<symbol id="i-mail" viewBox="0 0 24 24">',
      '<path d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z"/><path d="M22 6l-10 7L2 6"/>',
    '</symbol>',
    '<symbol id="i-pin" viewBox="0 0 24 24">',
      '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>',
    '</symbol>',
    '<symbol id="i-clock" viewBox="0 0 24 24">',
      '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    '</symbol>',
    '<symbol id="i-check" viewBox="0 0 24 24">',
      '<path d="M20 6L9 17l-5-5"/>',
    '</symbol>',
    '<symbol id="i-check-circle" viewBox="0 0 24 24">',
      '<circle cx="12" cy="12" r="10"/><path d="M8 12.5l2.5 2.5L16 9"/>',
    '</symbol>',
    '<symbol id="i-arrow-left" viewBox="0 0 24 24">',
      '<path d="M19 12H5M12 19l-7-7 7-7"/>',
    '</symbol>',
    '<symbol id="i-arrow-right" viewBox="0 0 24 24">',
      '<path d="M5 12h14M12 5l7 7-7 7"/>',
    '</symbol>',
    '<symbol id="i-chevron-right" viewBox="0 0 24 24">',
      '<path d="M9 18l6-6-6-6"/>',
    '</symbol>',
    '<symbol id="i-chevron-down" viewBox="0 0 24 24">',
      '<path d="M6 9l6 6 6-6"/>',
    '</symbol>',
    '<symbol id="i-star" viewBox="0 0 24 24">',
      '<path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.9L12 17.8 5.8 21l1.2-6.9-5-4.9 6.9-1z" fill="currentColor" stroke="none"/>',
    '</symbol>',
    '<symbol id="i-quote" viewBox="0 0 24 24">',
      '<path d="M10 11H5a3 3 0 010-6h1a4 4 0 014 4v8a4 4 0 01-4 4M21 11h-5a3 3 0 010-6h1a4 4 0 014 4v8a4 4 0 01-4 4"/>',
    '</symbol>',
    '<symbol id="i-tag" viewBox="0 0 24 24">',
      '<path d="M20.6 13.4l-7.2 7.2a2 2 0 01-2.8 0l-8-8A2 2 0 012 11.2V4a2 2 0 012-2h7.2a2 2 0 011.4.6l8 8a2 2 0 010 2.8z"/><path d="M7 7h.01"/>',
    '</symbol>',
    '<symbol id="i-gauge" viewBox="0 0 24 24">',
      '<path d="M3 17a9 9 0 1118 0"/><path d="M12 17l4-5"/>',
    '</symbol>',
    '<symbol id="i-fire" viewBox="0 0 24 24">',
      '<path d="M12 2s5 5 5 9a5 5 0 01-10 0c0-1.5.7-2.8 1.5-3.8C9 8.5 12 6 12 2z"/><path d="M12 22a6 6 0 006-6c0-1.4-.5-2.7-1.3-3.7"/>',
    '</symbol>',

    /* -------------------------------------------------------------- SOCIAL */
    '<symbol id="i-facebook" viewBox="0 0 24 24">',
      '<path fill="currentColor" stroke="none" d="M22 12a10 10 0 10-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.7l-.4 2.9h-2.3v7A10 10 0 0022 12z"/>',
    '</symbol>',
    '<symbol id="i-instagram" viewBox="0 0 24 24">',
      '<rect x="2.5" y="2.5" width="19" height="19" rx="5.5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.6" cy="6.4" r="1.1" fill="currentColor" stroke="none"/>',
    '</symbol>',
    '<symbol id="i-youtube" viewBox="0 0 24 24">',
      '<path fill="currentColor" stroke="none" d="M23 12s0-3.6-.5-5.3a2.9 2.9 0 00-2-2C18.7 4.2 12 4.2 12 4.2s-6.7 0-8.5.5a2.9 2.9 0 00-2 2C1 8.4 1 12 1 12s0 3.6.5 5.3a2.9 2.9 0 002 2c1.8.5 8.5.5 8.5.5s6.7 0 8.5-.5a2.9 2.9 0 002-2C23 15.6 23 12 23 12zM9.8 15.4V8.6l5.9 3.4z"/>',
    '</symbol>',
    '<symbol id="i-tiktok" viewBox="0 0 24 24">',
      '<path fill="currentColor" stroke="none" d="M16.6 2h-3.2v14a2.6 2.6 0 11-2.6-2.6c.3 0 .5 0 .8.1v-3.3a6 6 0 00-.8-.1A5.9 5.9 0 1016.7 16V9.2a7.2 7.2 0 004.3 1.4V7.3a4.3 4.3 0 01-4.4-4.3z"/>',
    '</symbol>',

    '</svg>'
  ].join('');

  function inject() {
    if (document.getElementById('usftf-sprite')) return;
    var holder = document.createElement('div');
    holder.id = 'usftf-sprite';
    holder.setAttribute('aria-hidden', 'true');
    holder.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
    holder.innerHTML = SPRITE;
    document.body.insertBefore(holder, document.body.firstChild);
  }

  if (document.body) inject();
  else document.addEventListener('DOMContentLoaded', inject);
})();
