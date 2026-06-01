# The Chronicle — Auth Testing Playbook

This app uses **Emergent Managed Google OAuth**. For end-to-end testing without going through a real Google account, a **dev auth bypass** is provided.

## Dev Auth Bypass (Testing Agent / Local Testing)

A simple endpoint allows creating a session for any email when `DEV_AUTH_BYPASS=true` is set in `/app/backend/.env`.

### POST `/api/auth/dev-login`

Body:
```json
{
  "email": "any-test-user@example.com",
  "name": "Test User",
  "picture": "https://i.pravatar.cc/150?u=test"
}
```

Response: `{ "user_id": "...", "email": "...", "name": "...", "picture": "...", "is_admin": bool }`

This endpoint:
- Creates or updates the user in `users` collection.
- Issues a `session_token` (UUID), stored in `user_sessions` with 7-day expiry.
- Sets an HTTP-only cookie `session_token`.
- Returns user info + admin flag (matched against `ADMIN_EMAIL` in `.env`).

### To test admin features:

Use `email = "admin@example.com"` (the value of `ADMIN_EMAIL` in `.env`).

```bash
curl -X POST "$BACKEND/api/auth/dev-login" \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"email": "admin@example.com", "name": "Admin Test"}'
```

Then reuse the cookie:
```bash
curl -X GET "$BACKEND/api/auth/me" -b cookies.txt
curl -X GET "$BACKEND/api/admin/comments" -b cookies.txt
```

### To test in a Playwright browser:

```python
import requests, json
r = requests.post(f"{BACKEND_URL}/api/auth/dev-login", json={"email": "admin@example.com", "name": "Admin"})
token = r.cookies.get("session_token")

await page.context.add_cookies([{
    "name": "session_token",
    "value": token,
    "domain": <preview-domain>,
    "path": "/",
    "httpOnly": True,
    "secure": True,
    "sameSite": "None",
}])
await page.goto(f"{FRONTEND_URL}/admin")
```

OR pass the `session_token` as `Authorization: Bearer <token>` for API tests.

## Endpoints that require auth

- `GET /api/auth/me` — returns current user
- `POST /api/auth/logout` — deletes session, clears cookie
- `GET /api/bookmarks` — user's saved articles
- `POST /api/bookmarks/{slug}` — toggle bookmark on article
- `DELETE /api/bookmarks/{slug}` — explicit unbookmark
- `GET /api/admin/comments` — list all comments (admin only)
- `POST /api/admin/comments/{id}/hide` — hide a comment (admin only)
- `POST /api/admin/comments/{id}/unhide` — unhide (admin only)
- `DELETE /api/admin/comments/{id}` — delete (admin only)
- `POST /api/admin/upload-image` — upload image (admin only)
- All `POST/PUT/DELETE /api/articles*` — admin only

## Production Notes

Before deploying:
1. Set `DEV_AUTH_BYPASS="false"` to disable the dev login endpoint.
2. Set `ADMIN_EMAIL` to your real Google account email.
3. Verify that the real Emergent OAuth flow works via `/login` button.
