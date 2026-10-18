# HotelPro

HotelPro is a rich, image-led hotel booking demo with guest registration, room browsing, reservations, and an admin console. The selected version is the `main` branch. The former `classic` branch has been deleted.

## Run locally

1. Install Node.js 20.19+ or 22.12+.
2. Copy `.env.example` to `server/.env` and set `MONGO_URI` to a MongoDB replica-set connection string and `JWT_SECRET` to a random secret with at least 32 characters. MongoDB Atlas supports the transaction used to prevent simultaneous overbooking. Never commit `.env`.
3. Set `CLIENT_ORIGIN` to the frontend origin (default `http://localhost:5173`).
4. In `server`, run `npm ci` then `npm start`.
5. In `client`, run `npm ci`, set `VITE_API_URL=http://localhost:8001/api` in a local `.env`, then run `npm run dev`.

The server adds the starter inventory only when those room numbers are missing. Public registration always creates customer accounts and cannot assign admin privileges. To enable the dedicated admin sign-in, set `ADMIN_EMAIL=admin@gmail.com` and `ADMIN_PASSWORD_HASH` in the backend environment. Generate the hash locally with the installed `bcryptjs` package at cost 12 (for example, `node -e "console.log(require('./server/node_modules/bcryptjs').hashSync('YOUR_STRONG_PASSWORD', 12))"`), then store only the resulting hash in the backend environment. Do not use a weak example password or commit a plaintext password or hash. On startup, the backend creates or updates that configured account as an administrator. Admin sign-in is available at `/admin-login`; admin API access remains enforced by signed backend tokens and admin-only middleware.

## Payments

Online payment processing is not configured. The app does not request or store card numbers, expiry dates, or CVV values. Confirming a booking records it with `paymentStatus: "not_configured"`; it does not charge the guest. Add a payment provider and verify its signed server-side callbacks before representing any booking as paid.

## Checks

- Backend tests: `cd server && npm test`
- Frontend lint: `cd client && npm run lint`
- Frontend production build: `cd client && npm run build`

Live login, booking, and cancellation flows require a reachable MongoDB replica set. Payment flows require a payment provider, which is currently not implemented.
