# plan.md — The Chronicle (React + FastAPI + MongoDB)

## 1) Objectives
- Deliver a production-ready V1 of **“The Chronicle”** premium news site with **verbatim master-prompt design system** (CSS variables, typography, spacing, dark/light mode, hover/animation behaviors).
- Implement core product flows: **browse → filter by category → search → read article → comment**.
- Provide **admin CRUD** to add/edit/delete articles and manage content in MongoDB.
- Seed DB with the **exact 9 master-prompt articles** (plus their metadata needed for hero/trending/opinion/video/ticker sections).

---

## 2) Implementation Steps

### Phase 1 — Core Flow Build (No separate POC)
> This app is CRUD + filtering/search + comments (no external integrations/auth). Build directly.

1. **Backend foundation (FastAPI + Motor)**
   - Create `articles` + `comments` collections.
   - Implement Pydantic models (Article, ArticleCreate/Update, Comment, CommentCreate).
   - Add indexes: `slug` unique, `category`, text index on `title/subtitle/summary/body/tags`.

2. **Seed data (required for UI fidelity)**
   - Add `/api/seed` to upsert the **9 articles exactly** (slugs stable).
   - Ensure fields needed for layout: `category`, `tags` (breaking/exclusive/analysis/opinion), `is_featured`, `is_trending`, `is_opinion`, `is_video`, `video_url`, `hero_rank`, `trending_rank`, `ticker_text`, `views`, `published_at`, `author`.

3. **Core API endpoints**
   - Articles list with `?category`, `?search`, `?limit`, `?sort`.
   - Article detail by `slug`.
   - Comments list/create by article `slug`.
   - Admin CRUD: create/update/delete articles.

4. **Frontend skeleton (React + Router + Axios)**
   - Routes: `/`, `/category/:slug`, `/article/:slug`, `/search`, `/admin`.
   - Axios client + API wrapper.
   - Global theme context: toggles `data-theme="dark"` on `<html>`.

5. **Design system implementation (verbatim)**
   - Implement master prompt CSS variables, typography rules, spacing scale, shadows, transitions.
   - Include Google Fonts: Playfair Display, Source Serif 4, DM Sans.

**Phase 1 user stories (core)**
1. As a visitor, I can open the homepage and see the hero + main grid populated from seeded articles.
2. As a visitor, I can click an article card and land on a full article page.
3. As a visitor, I can add a comment on an article and immediately see it in the thread.
4. As a visitor, I can toggle dark mode and the entire site palette updates smoothly.
5. As an editor, I can re-seed the database to restore the canonical 9-article set.

---

### Phase 2 — V1 App Development (Full Site Sections + Pages)
1. **Homepage sections (match master prompt)**
   - Top Bar (date, social icons, subscribe CTA, theme toggle).
   - Header (logo, nav links, search icon, subscribe pill; sticky + shrink on scroll).
   - Breaking ticker (20s linear infinite; pause on hover).
   - Hero (featured + 3 secondary).
   - Sticky Category Tabs (horizontal scroll on mobile).
   - Main News Grid (article cards, 4:3 media, hover lift/scale).
   - Trending Sidebar (top 5 with large faded numerals).
   - Opinion Section (3 pull-quote cards with 80px quote mark, 4px left border).
   - Video Section (2 cards, 16:9, duration label, play overlay).
   - Newsletter Signup banner (UI only; no storage).
   - Footer (4-column grid).

2. **Category page**
   - Show same header/tabs; list articles filtered by category slug.

3. **Search page**
   - Search input + results list; URL-driven query (`/search?q=`).
   - Empty/loading/no-results states.

4. **Article detail page**
   - Full article typography (headline/subhead/body) in master style.
   - Read-progress bar.
   - Comments module (list + form).

5. **Admin page (no auth for V1)**
   - Table/list of articles.
   - Create/edit form (title, slug, category, tags, image URLs, flags like featured/opinion/video, body).
   - Delete with confirmation.

6. **Polish interactions**
   - Card hover behavior: translateY(-4px), shadow-lg, headline accent color, image scale(1.04).
   - Hero gradient overlay.
   - Responsive breakpoints for hero grid, sidebars, footer columns.

**Phase 2 user stories (V1 experience)**
1. As a visitor, I can filter by category using the sticky tabs and see the grid animate/update.
2. As a visitor, I can search for a keyword and get relevant results across titles and body.
3. As a visitor, I can read an article with a progress indicator and clear typography.
4. As a visitor, I can post a comment and see it without a page refresh.
5. As an admin, I can add a new article and instantly see it appear on the homepage/category pages.

**Phase 2 checkpoint: 1 round E2E testing**
- Run `testing_agent_v3` for: navigation, dark mode, search, category filter, article read, comments, admin CRUD.
- Fix issues before moving on.

---

### Phase 3 — Testing & Hardening
1. **Backend hardening**
   - Validate slugs unique; consistent error responses.
   - Pagination-ready list endpoints (limit/skip).
   - Sanitization/length limits for comments.

2. **Frontend hardening**
   - Robust loading skeletons and error states.
   - Ensure master CSS variables apply uniformly in all pages/components.
   - Accessibility: skip link, focus states, aria labels for toggles/menus.

3. **Performance & UX**
   - Image lazy-loading where appropriate.
   - Minimize layout shift (fixed aspect ratio wrappers).

**Phase 3 user stories (quality)**
1. As a visitor, I never see broken layouts while data is loading.
2. As a visitor, I can use keyboard navigation to reach search, tabs, and article links.
3. As a visitor, I can use the site on mobile without overflow or unreadable text.
4. As an admin, I can edit an article without losing fields due to validation errors.
5. As a visitor, I can refresh any page (deep link) and it loads correctly.

**Phase 3 checkpoint: 1 round E2E testing**
- Re-run `testing_agent_v3` after hardening fixes.

---

## 3) Next Actions
1. Extract/confirm the **exact 9 articles** content/fields from the master prompt (titles, categories, tags, featured/trending/opinion/video assignments, images, authors).
2. Implement backend: models + seed + endpoints.
3. Implement frontend: routes + global CSS variables + core components.
4. Build homepage sections and wire each to the corresponding API endpoints.
5. Build article page + comments, then admin CRUD.
6. Run E2E test pass; fix; run final E2E pass.

---

## 4) Success Criteria
- Visual output matches master prompt: fonts, colors, spacing, hover effects, ticker animation, hero overlay, trending numerals, opinion styling, dark mode.
- All pages work: Home, Category, Article, Search, Admin.
- API supports: list/filter/search, article detail, comments list/create, admin CRUD, reseed.
- Seeded 9 articles render correctly across hero/trending/opinion/video/ticker sections.
- E2E tests pass for critical flows with no console errors and responsive layout intact.
