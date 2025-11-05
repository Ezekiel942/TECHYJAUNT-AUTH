# TechyJaunt-Auth

Small README to run, test and deploy this project. It includes exact git commit/push commands and how to set environment variables for Render.

## Quick local run

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the project root (copy `.env.example` if present) and set at least:

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/here
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=7d
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=you@example.com
EMAIL_PASS=yourpassword
FLW_PUBLIC_KEY=your_flutterwave_public_key
FLW_SECRET_KEY=your_flutterwave_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

3. Start the server in development (auto-restarts with nodemon):

```bash
npm run dev
```

The server listens on `http://localhost:3000` by default.

## Testing endpoints (Postman / Thunder Client)

Example: create user (signup)

- URL: `POST http://localhost:3000/api/users/signup`
- Body (JSON):

```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}
```

If email verification is enabled, the user will be created with a verification token and `isVerified` (or similar) will be false in the DB. To bypass verification during testing, either:

- Manually update the user document in your MongoDB (set `isVerified: true` or equivalent). Or
- Use the verification route (if available) to validate the user using the token sent by email.

## Render deployment notes (fixes applied)

Problem: Render runs your app in their environment, not on your local machine. Your old `src/config/db.js` used a hard-coded `mongodb://localhost:27017/...`, which cannot connect on Render (no local MongoDB service).

Fix applied: `src/config/db.js` now reads `MONGODB_URI` (or `MONGO_URI`) from environment variables and falls back to `mongodb://localhost:27017/here` for local development. To deploy successfully on Render you must provide a reachable MongoDB URI (MongoDB Atlas, Render-managed DB, or a network-accessible MongoDB).

On Render:
1. In your service settings, set an environment variable `MONGODB_URI` to your MongoDB connection string (for Atlas it looks like `mongodb+srv://user:pass@cluster0.xxxx.mongodb.net/dbname?retryWrites=true&w=majority`).
2. Set other required env vars (see `.env` list above) in the Render dashboard (Environment > Environment Variables).
3. Redeploy.

Common Render errors:
- `connect ECONNREFUSED 127.0.0.1:27017` — means your app tried to use a local MongoDB on Render (not available). Set `MONGODB_URI` to a network DB.

## Commit & push exact commands

From the project root, run these exact commands to prepare and push a change (replace commit message as needed):

```bash
git add .
git commit -m "Fix: use env MONGODB_URI and update README for Render deploy"
git push origin main
```

If you need to create a branch and push:

```bash
git checkout -b fix/db-env
git add .
git commit -m "Fix: read DB URI from env"
git push -u origin fix/db-env
```

## What I changed and why

- `src/config/db.js` — now uses `process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/here'`.
  - Reason: Render cannot connect to `localhost:27017`. Production must use a hosted MongoDB. This preserves local dev convenience.
- Removed accidental Markdown fences from `.js` files (fixes syntax errors when Node starts).

## Verify in MongoDB

After a successful signup request, open your MongoDB (Atlas/Compass/CLI) and check the database named in `MONGODB_URI` (or `here` for local). Look in `users` collection. If a user requires verification, look for fields named `isVerified`, `emailToken`, or similar.

To manually flip verification (quick test):

1. Use MongoDB shell/Compass to set `isVerified: true` in the user's document.
2. Retry the request in Postman — the protected endpoints should now allow access.

## Final checklist before deploying to Render

- [ ] Push code to GitHub
- [ ] In Render dashboard, add `MONGODB_URI` (pointing to Atlas or other DB)
- [ ] Add other env vars (JWT_SECRET, EMAIL_*, FLW keys, etc.)
- [ ] Trigger a deploy and watch logs for `MongoDB connected` and `Server running`

If you want, I can also:

- Add a small health endpoint `/health` that returns 200 + DB status.
- Add a script to automatically create a test user on startup (dev-only).

---

If you want me to commit these README changes for you, tell me and I'll run the git commands and push.
# TechyJaunt-Auth

## What is this project?
This is a car rental app! You can see cars, rent them, and pay for your rental online. You need to sign up and log in to use it.

## What can you do here?
- **See all cars:** You can look at all the cars in the app.
- **Add a car:** If you are an admin, you can add new cars.
- **Edit or delete cars:** Admins can change car details or remove cars.
- **Search for cars:** You can find cars by name or other details.
- **Rent a car:** Pick a car, pay for it using Flutterwave, and it will be marked as rented.
- **Authentication:** You need to sign up and log in. You get a special token to use protected features.
- **Forgot password:** If you forget your password, you can ask for a reset. The app will send you an email with a code (OTP).

## How does payment work?
When you want to rent a car, you pay using Flutterwave. After you pay, the app checks if your payment was successful and marks the car as rented for you.

## How do you use the app?
1. **Sign up** with your email and password.
2. **Log in** to get your token.
3. **See cars** and pick one you like.
4. **Rent the car** and pay online.
5. **Check your email** for password reset if you forget it.

## What is still missing?
- Profile pictures for users (coming soon!)
- Email and OTP verification (coming soon!)

---
This README is written simply so anyone, even a child, can understand what this project does!
4. we would send an email. (pend)