# Auth Next.js

A Next.js 16 authentication project with MongoDB, JWT cookies, email verification, and forgot-password reset emails through Mailtrap.

## Features

- User signup with hashed passwords
- Email verification link
- Login with JWT stored in an HTTP-only cookie
- Protected profile routes
- Logout
- Forgot password email
- Reset password with token link
- Toast notifications for success and error messages

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- MongoDB with Mongoose
- bcryptjs for password hashing
- jsonwebtoken for login tokens
- Nodemailer with Mailtrap for email testing
- Tailwind CSS

## Project Structure

```text
src/app/
  api/users/
    signup/route.ts
    verifyemail/route.ts
    login/route.ts
    logout/route.ts
    me/route.ts
    forgotpassword/route.ts
    resetpassword/route.ts
  signup/page.tsx
  verifyemail/page.tsx
  login/page.tsx
  profile/page.tsx
  forgotpassword/page.tsx
  resetpassword/page.tsx

src/helpers/
  mailer.ts
  getDataFromToken.ts

src/models/
  userModel.js

src/dbConfig/
  dbConfig.ts

src/proxy.ts
```

## Environment Variables

Create a `.env` file in the project root.

```env
MONGO_URI="your-mongodb-connection-string"
TOKEN_SECRET="change-this-local-dev-secret"
DOMAIN="http://localhost:3000"

MAIL_HOST="sandbox.smtp.mailtrap.io"
MAIL_PORT="2525"
MAIL_USER="your-mailtrap-smtp-username"
MAIL_PASSWORD="your-mailtrap-smtp-password"
MAIL_FROM="Auth App <no-reply@example.com>"
MAIL_SECURE="false"
```

Use the SMTP credentials from your Mailtrap inbox. After editing `.env`, restart the dev server.

## Installation

```bash
npm install
```

## Run Locally

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Build

```bash
npm run build
```

## Auth Flow

### Signup and Verify Email

1. Open `/signup`.
2. Create an account.
3. The app saves the user in MongoDB.
4. The app sends a verification email to Mailtrap.
5. Open Mailtrap and click the verification link.
6. The link opens `/verifyemail?token=...`.
7. The app marks the user as verified.
8. Login at `/login`.

### Login

1. Open `/login`.
2. Enter email and password.
3. The app creates a JWT.
4. The JWT is saved in an HTTP-only `token` cookie.
5. The app redirects to `/profile`.

### Forgot Password

1. Open `/login`.
2. Click `Forgot password?`.
3. Enter the account email on `/forgotpassword`.
4. The app sends a reset password email to Mailtrap.
5. Open Mailtrap and click the reset link.
6. The link opens `/resetpassword?token=...`.
7. Enter a new password.
8. Login again with the new password.

## Routes

### Pages

- `/signup` - create account
- `/verifyemail` - verify email token from Mailtrap link
- `/login` - login
- `/profile` - protected profile page
- `/profile/[id]` - dynamic user profile page
- `/forgotpassword` - request password reset email
- `/resetpassword` - reset password from email token

### API Routes

- `POST /api/users/signup`
- `POST /api/users/verifyemail`
- `POST /api/users/login`
- `GET /api/users/logout`
- `GET /api/users/me`
- `POST /api/users/forgotpassword`
- `POST /api/users/resetpassword`

## Route Protection

Next.js 16 uses `proxy.ts` instead of the older `middleware.ts` name. This project protects private pages in:

```text
src/proxy.ts
```

Public pages:

- `/login`
- `/signup`
- `/verifyemail`
- `/forgotpassword`
- `/resetpassword`

Protected pages:

- `/`
- `/profile`
- `/profile/[id]`

## Common Problems

### Mailtrap does not receive email

Check that `.env` has:

```env
MAIL_HOST
MAIL_PORT
MAIL_USER
MAIL_PASSWORD
DOMAIN
```

Then restart:

```bash
npm run dev
```

### Login fails with token error

Make sure `TOKEN_SECRET` is not empty.

### Verify or reset link does not work

Make sure `DOMAIN` matches your local server:

```env
DOMAIN="http://localhost:3000"
```

Also check that the route is lowercase:

```text
/verifyemail
/resetpassword
```

## Notes

This project uses Next.js 16. In this version, Middleware has been renamed to Proxy, so use `src/proxy.ts`.
