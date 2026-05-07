# CampusNest

CampusNest is a full-stack MERN listing platform for college students. The MVP targets Thakur College, Kandivali, Mumbai and helps students discover nearby PG/Hostel and Mess/Tiffin services, with verified login for Campus AI and owner submissions.

## Features

- Public browsing for PG/Hostel and Mess/Tiffin listings
- Thakur College focused college page
- Search, filters, sorting, skeleton states, empty states and responsive listing cards
- Listing details with gallery, FAQs, facilities, PG/Mess-specific fields and WhatsApp contact
- Login-protected step-by-step owner submission form
- OTP-verified contact page for users to message the admin
- Email OTP signup/login for protected user actions
- Campus AI Help Bot with 1 free answer after signup and paid credit packs
- Razorpay Test Mode billing for AI message credits
- Admin JWT login
- Admin dashboard with listing and submission stats
- Admin listing CRUD with approve, reject, verify, feature and delete actions
- Cloudinary image uploads
- Optional OpenAI helper APIs for admin content and Campus AI answers, with template fallback when no API key is configured

## Tech Stack

Frontend: Vite, React JavaScript, Tailwind CSS, React Router DOM, Axios, Lucide React, Framer Motion, React Hook Form, React Hot Toast, clsx and date-fns.

Backend: Node.js, Express.js, MongoDB Atlas, Mongoose, JWT, bcryptjs, cookie-parser, cors, dotenv, multer, Cloudinary, express-validator, slugify, helmet, express-rate-limit, compression, morgan and nodemon.

## Folder Structure

```txt
campusnest/
  client/   Vite + React JavaScript app
  server/   Node.js + Express JavaScript API
  README.md
```

The source folders follow the requested component, page, controller, route, model, middleware and utility structure.

## Setup Commands

```bash
cd server
npm install
cp .env.example .env
npm run seed:college
npm run seed:admin
npm run seed:samples
npm run dev
```

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

Client runs on `http://localhost:5173`. Server runs on `http://localhost:5000`.

## Client Env Guide

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=CampusNest
VITE_DEFAULT_COLLEGE_SLUG=thakur-college
```

## Server Env Guide

```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_atlas_url
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

OPENAI_API_KEY=your_openai_api_key_optional
OPENAI_CHATBOT_MODEL=gpt-4.1-mini

RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_test_key_secret
RAZORPAY_WEBHOOK_SECRET=your_test_webhook_secret

BREVO_API_KEY=optional_for_real_email_otp
CONTACT_FROM_EMAIL=noreply@yourdomain.com
CONTACT_FROM_NAME=CampusNest

ADMIN_NAME=Nikhil
ADMIN_EMAIL=admin@campusnest.online
ADMIN_PASSWORD=admin12345
```

## MongoDB Atlas

Create a MongoDB Atlas cluster, add your IP address to Network Access, create a database user, copy the connection string and set `MONGO_URI` in `server/.env`.

## Cloudinary

Create a Cloudinary account, copy cloud name, API key and API secret into `server/.env`. Admin and owner image upload routes return Cloudinary secure URLs.

## Campus AI Help Bot

Public pages include a floating `Campus AI` widget powered by `POST /api/chatbot/ask`. Users must login first. Every verified account gets 1 free AI answer. After that, users can buy message credits:

- Starter: Rs. 19 for 10 AI messages
- Value: Rs. 49 for 35 AI messages
- Power: Rs. 99 for 100 AI messages

Request:

```json
{
  "message": "Boys PG under 9000",
  "currentPage": "/college/thakur-college/pg",
  "currentListingSlug": "optional-listing-slug"
}
```

The chatbot only answers CampusNest-related questions about PGs, Mess/Tiffin, rent, budget, facilities, food, distance and move-in planning near Thakur College. It searches approved MongoDB listings and returns concise answers, related listings and suggested actions.

If `OPENAI_API_KEY` is configured, the backend sends only the user message and top relevant listing summaries to OpenAI for a short answer. If `OPENAI_API_KEY` is missing or a placeholder, the bot still works using template-based fallback answers. The bot never guarantees availability and always reminds users to confirm rent, menu, availability and facilities directly with the owner.

## Razorpay Test Mode

Create a Razorpay account and use Test Mode while building. In the Razorpay dashboard:

1. Switch to Test Mode.
2. Generate API keys.
3. Add `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` to `server/.env`.
4. Add a test webhook pointing to your backend route:

```txt
http://localhost:5000/api/billing/webhook
```

For local webhook testing, use a public tunnel such as ngrok and set the webhook to:

```txt
https://your-ngrok-url.ngrok-free.app/api/billing/webhook
```

Subscribe to `payment.captured` and `order.paid`, then copy the webhook secret into `RAZORPAY_WEBHOOK_SECRET`.

The frontend verifies checkout success with `/api/billing/verify`, and the webhook also safely grants credits after payment. In production, replace test keys with live keys after Razorpay Live Mode/KYC approval.

## Contact OTP

The public Contact page uses `POST /api/contact/otp` to send a 6 digit email OTP that expires in 10 minutes, then `POST /api/contact/messages` to save the verified message for admin review.

For real OTP email delivery, create a Brevo account and add `BREVO_API_KEY`, `CONTACT_FROM_EMAIL`, and `CONTACT_FROM_NAME` to `server/.env`, then restart the API server. Without Brevo keys, development mode still generates a `devOtp` in the API response so the flow can be tested locally.

## Optional OpenAI

Set `OPENAI_API_KEY` in `server/.env` to enable admin AI helper buttons and richer Campus AI Help Bot responses. If it is missing, admin helpers return a clear unavailable message and Campus AI uses fallback templates.

`OPENAI_CHATBOT_MODEL` is optional. It defaults to `gpt-4.1-mini`.

## Seeding

```bash
cd server
npm run seed:college
npm run seed:admin
npm run seed:samples
```

Seeded admin defaults come from env:

- Email: `admin@campusnest.online`
- Password: `admin12345`

Change these before production.

## Running Locally

Start the API first:

```bash
cd server
npm run dev
```

Start the client in another terminal:

```bash
cd client
npm run dev
```

Open `http://localhost:5173`.

## Admin Login

Go to `http://localhost:5173/admin/login`, sign in with the seeded admin credentials, and the JWT is stored in localStorage as `campusnest_admin_token`.

## Deployment Guide

- Frontend: deploy `client` to Vercel or Netlify.
- Backend: deploy `server` to Render or Railway.
- Database: use MongoDB Atlas.
- Images: use Cloudinary.
- Set `CLIENT_URL` on the backend to your deployed frontend URL.
- Set `VITE_API_BASE_URL` on the frontend to your deployed backend API URL plus `/api`.

## Common Troubleshooting

CORS error: confirm `CLIENT_URL` in server env exactly matches the client origin.

MongoDB connection error: confirm Atlas username, password, database URL and IP allowlist.

Cloudinary upload error: confirm all three Cloudinary env values are set and valid.

Admin login error: run `npm run seed:admin`, confirm `JWT_SECRET` is set, and use the same email/password from env.
