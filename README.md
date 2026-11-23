# My Numerology Hub

This folder combines the three supplied apps under one front page.

- `index.html` is the new home screen.
- `ankmel/`, `chaldean/`, and `janmakshar/` contain the original app files.
- Each app keeps its own service worker and manifest so its offline/PWA behavior remains separate.
- The Chaldean manifest and service worker paths were changed from the old hard-coded `/chaldean-numerology/` path to relative paths so it works inside this combined project.
- Original `.git` folders were intentionally not included; initialize/push this combined folder as one new GitHub Pages repository.

Deploy the **contents** of this folder as the root of one GitHub Pages repository. Open the new site's root URL; the three app tiles launch the corresponding app.
