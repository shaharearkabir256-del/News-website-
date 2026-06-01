# plan.md — The Chronicle (React + FastAPI + MongoDB)

## 1) Objectives
- Deliver and maintain **V1 of “The Chronicle”** premium news site with **verbatim master-prompt design system** (CSS variables, typography, spacing scale, dark/light mode, hover/animation behaviors).
- Provide complete editorial product flows: **browse → filter by category → search → read article → comment**.
- Provide an **admin CRUD console** to add/edit/delete articles (V1 intentionally **no auth**).
- Seed the database on startup with the **canonical dataset** used by the UI: **14 total articles** (**9 main** + **3 opinion** + **2 video**) + **breaking ticker items**.
- Ensure production-quality UX: responsive layout, loading states, accessibility basics, and stable API contracts.

---

## 2) Implementation Steps

### Phase 1 — Core Flow Build (No separate POC)
> This app is CRUD + filtering/search + comments (no external integrations/auth). Built directly.

1. **Backend foundation (FastAPI + Motor + MongoDB)**
   - Collections: `articles`, `comments`, `ticker`.
   - Pydantic models: `Article`, `ArticleCreate`, `ArticleUpdate`, `Comment`, `CommentCreate`.
   - Search implementation: regex-based search over `title/subtitle/summary/body/tags/author_name`.

2. **Seed data (required for UI fidelity)**
   - Auto-seed on backend startup when DB empty.
   - Provide `/api/seed` to reset content to the canonical set.
   - Seed includes:
     - **14 articles**: 9 main stories + 3 opinion + 2 video.
     - Hero configuration: `is_featured` + `hero_rank` (0–3).
     - Trending configuration: `is_trending` + `trending_rank` (1–5).
     - Opinion configuration: `is_opinion` + `opinion_quote`.
     - Video configuration: `is_video` + `video_duration`.
     - Breaking ticker items (7).

3. **Core API endpoints**
   - Articles: list + filter + search + detail + CRUD.
   - Comments: list/create per article.
   - Categories: list.
   - Ticker: list.
   - Seed reset: reseed canonical data.

4. **Frontend skeleton (React + Router + Axios)**
   - Routes: `/`, `/category/:slug`, `/article/:slug`, `/search`, `/admin`.
   - API wrapper client.
   - Global theme context: toggles `data-theme="dark"` on `<html>`.

5. **Design system implementation (verbatim)**
   - Implement master prompt CSS variables, typography rules, spacing scale, shadows, transitions.
   - Include Google Fonts: Playfair Display, Source Serif 4, DM Sans.

**Phase 1 user stories (core)**
1. As a visitor, I can open the homepage and see the hero + main grid populated from seeded articles.
2. As a visitor, I can click an article card and land on a full article page.
3. As a visitor, I can add a comment on an article and immediately see it in the thread.
4. As a visitor, I can toggle dark mode and the entire site palette updates smoothly.
5. As an editor, I can re-seed the database to restore the canonical dataset.

**Status:** ✅ Completed

---

### Phase 2 — V1 App Development (Full Site Sections + Pages)
1. **Homepage sections (match master prompt)**
   - Top Bar (date, social icons, subscribe CTA, theme toggle).
   - Header (logo, nav links, search icon, subscribe pill; sticky + shrink on scroll).
   - Breaking ticker (infinite scroll; pause on hover).
   - Hero (featured + 3 secondary).
   - Sticky Category Tabs (horizontal scroll on mobile).
   - Main News Grid (article cards, 4:3 media, hover lift/scale).
   - Trending Sidebar (top 5 with large faded numerals).
   - Opinion Section (3 pull-quote cards with large quote mark, category-colored left border).
   - Video Section (2 cards, 16:9, duration label, play overlay).
   - Newsletter Signup banner (**UI only**; no storage).
   - Footer (4-column grid).

2. **Category page**
   - Header + tabs retained.
   - List articles filtered by category slug.

3. **Search page**
   - URL-driven query (`/search?q=`).
   - Results grid + empty/loading states.

4. **Article detail page**
   - Full article typography.
   - Read-progress bar.
   - Comments module (list + form).
   - Editorial touches: drop-cap on first paragraph, tag chips.

5. **Admin page (no auth for V1)**
   - Table/list of articles.
   - Create/edit form with:
     - core fields: title/subtitle/summary/body/category/tags/images/authors
     - flags: featured/trending/opinion/video + corresponding rank/duration/quote fields
   - Delete with confirmation.
   - Reseed button.

6. **Polish interactions**
   - Card hover behavior (lift/shadow/image scale/headline accent color).
   - Hero gradient overlay.
   - Responsive breakpoints for hero grid, sidebars, footer columns.
   - Mobile hamburger + drawer navigation.

**Phase 2 user stories (V1 experience)**
1. As a visitor, I can filter by category using the sticky tabs and see the correct section page.
2. As a visitor, I can search for a keyword and get relevant results.
3. As a visitor, I can read an article with a progress indicator and clear typography.
4. As a visitor, I can post a comment and see it without a page refresh.
5. As an admin, I can add a new article and instantly see it appear across pages.

**Phase 2 checkpoint: 1 round E2E testing**
- Run `testing_agent_v3` for: navigation, dark mode, search, category filter, article read, comments, admin CRUD.

**Status:** ✅ Completed

---

### Phase 3 — Testing & Hardening
1. **Backend hardening**
   - Stable API responses and error handling.
   - Pagination-ready list endpoints (`limit/skip`).
   - View count auto-increment on article read.

2. **Frontend hardening**
   - Robust loading skeletons and empty states.
   - Accessibility: skip link, aria labels for toggles/menus.
   - Theme persistence via `localStorage`.

3. **Performance & UX**
   - Image lazy-loading where appropriate.
   - Fixed aspect ratio wrappers to minimize layout shift.

**Phase 3 user stories (quality)**
1. As a visitor, I never see broken layouts while data is loading.
2. As a visitor, I can use keyboard navigation to reach key actions.
3. As a visitor, I can use the site on mobile without overflow.
4. As an admin, I can edit an article without losing fields due to validation errors.
5. As a visitor, I can deep-link to any page and it loads correctly.

**Phase 3 checkpoint: 1 round E2E testing**
- `testing_agent_v3` results: **Backend 17/17 passed (100%)**; frontend flows passed; **zero critical/minor bugs**.

**Status:** ✅ Completed

---

## 3) Next Actions
> V1 is delivered. Next actions shift from “build” to “iterate” (optional Phase 4).

1. **Phase 4 (Optional) — Production enhancements**
   - **Auth / Admin protection** (login, role-based permissions).
   - **Newsletter storage** in MongoDB + double opt-in.
   - **Bookmarks / saved articles** per user.
   - **Comment moderation** (delete/hide, spam controls).
   - **Related stories** + “more from this category”.
   - **SEO/Share**: meta tags, OpenGraph/Twitter cards, JSON-LD, sitemap.
   - **Image upload** (currently URL-based).
   - **Realtime comments** via WebSockets.

2. **Operational readiness**
   - Add monitoring/logging.
   - Add backups for MongoDB.
   - Add rate limiting for public endpoints.

---

## 4) Success Criteria
- Visual output matches master prompt: fonts, colors, spacing, hover effects, ticker animation, hero overlay, trending numerals, opinion styling, dark mode.
- All pages work: Home, Category, Article, Search, Admin.
- API supports: list/filter/search, article detail, comments list/create, admin CRUD, reseed, categories, ticker.
- Canonical seed dataset renders correctly across hero/trending/opinion/video/ticker sections.
- E2E tests pass for critical flows with no console errors and responsive layout intact.

**Current status:** ✅ All success criteria met for V1.
