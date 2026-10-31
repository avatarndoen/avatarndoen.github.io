# GitHub portfolio

Public repository: https://github.com/avatarndoen/avatarndoen.github.io
Public website: https://avatarndoen.github.io/

October 28, 2026: applicant explicitly approved public upload of the website, downloadable CV and portfolio PDF, displayed contact details, and editable source. Main commit: 1e69c8d88cb44d3412bd6c0a3ec22a2098ececcb. All 341 uploaded files verified against remote Git blob checksums.

The repository contains both editable Markdown/source and generated root pages for GitHub Pages. A local checkout is retained under 99 Agent Workspace/Temporary Files/Portfolio GitHub Upload. Local canonical edits remain in this Website folder; copy changed sources into the checkout, run node scripts/publish.mjs, and verify before updating GitHub.

Live verification completed: the public URL renders the portfolio homepage in the browser.

PDF refresh commit: 35cf00de9a2ef643a2138d5c03b1eea5c7880c99. CV includes the live website link; portfolio uses the October 28 22:51 Word export. Release hashes are in docs/DOWNLOADS.json.

October 29, 2026: applicant asks to keep the portfolio out of search engines while allowing link access. All 10 HTML pages now include robots noindex, nofollow, noimageindex. Commit bbd9b8b1804333ef77886d72fce3300135bee4f4. This is advisory search exclusion, not authentication; public repository files and direct PDFs remain publicly accessible and are not covered by HTML meta tags. No robots.txt crawl block was added because compliant crawlers must read the noindex directive.

October 29: hand Home preview corrected from two copies of the same Word photograph to one photograph and one CAD design view. Commit 0fb7efa915081b91732314a0ba7d4da0740882b2. Source image files preserved.

October 29 LOCAL ONLY: About layout redesigned in canonical scripts/build.mjs and site/revision.css. Desktop/mobile checks passed; no GitHub upload made. Applicant requested local review first. Local review preview: http://127.0.0.1:4191/about.html (review server session 13533). Source text ABOUT.md unchanged.

October 29: applicant approved the local About redesign and requested upload. Published four changed files in commit 6b7f4694c5be662d6003600b984c1ab604b53930. This supersedes the local-only review status above.

October 29: fixed the suspected mixed-version About layout by fingerprinting CSS and JavaScript asset filenames on all 10 pages. Commit 14820740c06057eed291e318decf1afb21a70b0a. Build checks now require all four versioned assets. No content rewrite.

October 29: removed the two About links below Education; split deLabo and Japan internship into separate spaced lines; removed the obsolete top-right CVT Home image. Published in commit ac243546609e58985e17280290880fce7a920067.

October 29: experience entries now show company and role before dates/locations, per applicant correction. Commit e6f8fa0b65feca56a90809805faf19560e8c6bcc.

October 29: refreshed the CV download with the one-page edition featuring a larger bold blue underlined Portfolio — click to view projects link. Download manifest updated; published commit 0d2287f0c15f08ba9bce8c6a25a5bb7be9561f31. Website build/reference checks passed.

October 29 correction: CV uses bold black Portfolio: avatarndoen.github.io with visible clickable URL, replacing the blue call-to-action. Published commit 99476272cf60708f70c10054fd1e29935c3350c3; download manifest refreshed and build/reference checks passed.

October 29: phone-only layout fixes completed locally in site/revision.css, limited to screen widths at or below 700px. Improved stacked layouts, About portrait/education, touch targets, contents scrolling, and video controls. All 10 pages checked at 320, 390, 430, 600, 700, 701, 1024 and 1440px without horizontal overflow; all 10 desktop screenshots at 1440px are byte-identical to baseline. Menu, Escape, project anchor and video carousel checks passed. Build/reference checks passed. Previous CSS archived under 90 Archive/Portfolio/Website Before Phone Fix 2026-10-29/. Local publication checkout refreshed. External upload blocked by automatic approval review pending explicit applicant approval; live site remains unchanged.

October 29: applicant explicitly approved publication of the completed phone fixes. Published commit 35c240ddb7a6f1c91270b424a321aabeba27aa00. GitHub Pages deployment 40726727273 succeeded; live homepage returned HTTP 200 and references revision.2a61f87b8f10.css. This supersedes the pending-upload status above. Desktop appearance remains unchanged, verified by all 10 baseline screenshot comparisons.
