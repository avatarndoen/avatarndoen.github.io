---
background: #f4f2eb
paper: #fffefa
ink: #24382f
muted: #62695f
accent: #a5452c
line: #d7d9ce
content_width: 1240px
---

# Visual direction

Warm paper, deep green typography, and a restrained terracotta accent. A clear reading hierarchy, consistent spacing, descriptive headings, and real project images. The name and engineering role lead the introduction; the personal headline is a supporting line. Use ordinary sans-serif labels and plain-text project topics.

The homepage has integrated contents navigation matching the individual project pages. It introduces Avatar, presents readable skills and research interests near the top, then all five notable projects with multiple PDF figures and equal prominence. It ends after three smaller, separate groups: Internship / Contract, Competition, Additional / Fun. Background, work history and publication remain on About.

Project pages explain the work through readable sections and uncropped figures. The navigation uses ordinary links and the browser’s natural scrolling.

The color and width fields above directly control the site. Detailed layout styles live in site/styles.css and site/revision.css.

Image groups fit their content: no fixed-height blank preview canvases or thumbnail size caps. Use source aspect ratios to set column proportions; a large arm photograph leads its group. Keep photographs and diagrams uncropped.

Home is the only project index. Use one sans-serif family, restrained heading sizes, readable navigation, plain GPA text, static figures without zoom, and direct links from Home to project detail pages. Keep supporting text sufficiently contrasted against the warm background. Preserve the five equally prominent notable projects and the three smaller collections.

Keep the five main project overviews text-only. The smaller entries are presented on three shared collection pages, following the PDF grouping, while their editable source folders remain separate.


## Compact contents and About emphasis — October 31, 2026

At window widths of 1000px or less, use individual section markers in a slim reserved side gutter, including on split-screen desktop. Hovering or keyboard-focusing a marker magnifies it and its neighbours and reveals that section's label; clicking or pressing Enter goes directly to it. Do not open a separate contents dialog. Keep hit areas fixed while marks animate, so page content does not shift. On phones, tapping previews a label with a Go button; holding and sliding then releasing selects a section, and dragging outside cancels. Short windows allow the marker track to scroll. Above 1000px, retain the original full sidebar.

About uses a short engineering-focus lead, then My journey, Experience, Research direction and personal background. Skills and Tools are presented on Home only. Education, thesis and publication are grouped once in Bandung; independent building belongs to Japan. Keep exact employment roles and dates in the separate Experience section. Use selective semibold emphasis rather than emphasizing whole paragraphs. Preserve Toyota/current-work and independent-project context; healthcare remains a future research direction. On narrow screens, the narrative precedes the portrait/education block.


## About journey — October 31, 2026

The About introduction is followed by an editable three-stop journey: Kupang, Bandung and Toyota, Japan. A sticky Mercator map pans and zooms with native page scrolling; place links also move to the relevant story. The journey narrative and affordability motivation adapt the applicant-supplied UCSD personal statement. Keep affordability and surgical-care access as future goals. Preserve geographical context and avoid inventing travel routes, hardship or demonstrated cost savings.

Use the sourced Natural Earth land geometry in profile/images/about-journey.svg; provenance is in docs/JOURNEY MAP SOURCES.json. Narrative copy lives in profile/JOURNEY.md. The reduced-motion version keeps all three locations in a stationary overview. Narrow layouts place the map above the story; short landscape windows use a nonsticky map.


### Content consolidation — latest October 31 revision

Group facts by purpose. The introduction establishes the engineering focus; Home presents Skills and Tools for capability scanning. Kupang, Indonesia explains background and the importance of access/affordability. Bandung, Indonesia contains the canonical degree, dates, GPA, thesis and linked publication. Toyota, Japan describes independent building alongside employment. Keep formal roles/dates in Experience and prospective goals in Research direction. Remove separate Education, Publication, What I've built, Current work, Why research and Research interests blocks from About; source records and the full interests list on Home remain intact. Country labels appear in chapter headings, map labels and place controls.


### Shared header/footer and About scope — latest October 31 revision

The applicant prefers About to focus on background and Home to hold Skills/Tools; do not repeat those blocks on About. Use the full name, Avatar Sargamantha Ndoen, in the global header. Both PDF actions use matching wording: Download portfolio (PDF) and Download CV (PDF), with downward download indicators. At 1100px and below, use the existing expandable menu so the full name stays readable. Every page ends with a consistent footer containing name/role, linked email, linked telephone and the existing Toyota, Japan location. Contact values come from the canonical links files and MAIN.md, not copied new contact records.


### Magnifying glass dock — latest October 31 instruction

The applicant clarified a macOS Dock-like interaction, replacing the earlier click-to-open contents panel. Apply a restrained translucent surface with backdrop blur and an opaque fallback; labels remain dark and readable. Hover grows the chosen mark and gently expands neighbouring marks without moving link hit areas or page content. Touch scrubbing is optional; keep a non-dragging Go action, ordinary anchor destinations and keyboard operation. Respect reduced-motion and reduced-transparency preferences. References: https://developer.apple.com/design/human-interface-guidelines/materials and https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.
