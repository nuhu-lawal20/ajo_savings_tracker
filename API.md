# API Documentation — Alajo

Base URL (production): `https://alajo.vercel.app`  
All routes require authentication unless marked **Public**.

---

## Authentication

Requests are authenticated via Supabase session cookies set by the Auth flow. No Bearer tokens required for browser requests. Server routes use `createClient()` which reads the cookie automatically.

---

## Circles

### `GET /api/circles`
**Auth required** | Returns all circles where the authenticated user is a member or creator.

**Response 200:**
```json
[
  {
    "id": "uuid",
    "name": "Lagos Traders Pool",
    "status": "active",
    "contribution_amount": 5000,
    "frequency": "weekly",
    "max_members": 10,
    "current_round": 3,
    "invite_code": "ALAJO-9X2P"
  }
]
```

---

### `POST /api/circles`
**Auth required** | Creates a new savings circle. Creator is auto-added as member at position 1.

**Request body:**
```json
{
  "name": "Lagos Traders Pool",
  "description": "Weekly savings group",
  "contributionAmount": 5000,
  "frequency": "weekly",
  "maxMembers": 10
}
```

**Response 201:**
```json
{
  "circle": { "id": "uuid", "invite_code": "ALAJO-9X2P", ... },
  "membership": { "payout_position": 1, ... }
}
```

---

### `POST /api/circles/join`
**Auth required** | Joins a circle using an invite code. Assigns payout position based on AI trust score tier.

**Request body:**
```json
{ "inviteCode": "ALAJO-9X2P" }
```

**Response 200:**
```json
{ "circleId": "uuid", "payoutPosition": 4 }
```

**Errors:** `400` circle full | `409` already a member | `400` circle not pending

---

### `PATCH /api/circles/[id]/start`
**Auth required (creator only)** | Activates a pending circle (status → `active`). Requires ≥2 members.

**Response 200:**
```json
{ "circle": { "status": "active", ... } }
```

---

## Contributions & Payments

### `POST /api/contributions`
**Auth required** | Creates a pending transaction and generates a unique Paystack reference for the inline popup.

**Request body:**
```json
{ "circleId": "uuid", "amount": 5000 }
```

**Response 200:**
```json
{
  "reference": "ALAJO-TX-1A2B-3C4D5E",
  "amount": 500000,
  "email": "user@example.com",
  "transactionId": "uuid"
}
```
> Amount returned in **kobo** (×100) for the Paystack popup.

---

## Webhooks

### `POST /api/webhooks/paystack`
**Public (HMAC-verified)** | Handles Paystack `charge.success` events.

1. Verifies `x-paystack-signature` header with HMAC-SHA512
2. Marks transaction `confirmed`
3. Sets `memberships.has_paid_current_round = true`
4. Recalculates AI trust score for the payer
5. If all members paid: creates payout record, advances `current_round` (or marks circle `completed`)

**Always returns `200`** (Paystack requires fast acknowledgement regardless of processing outcome).

---

## Media Upload

### `POST /api/upload`
**Auth required** | Uploads a profile photo to Cloudinary with face-crop transformation.

**Request:** `multipart/form-data` with field `file` (image/*, max 2MB)

**Response 200:**
```json
{ "url": "https://res.cloudinary.com/alajo/image/upload/v.../avatar_uuid.jpg" }
```

**Errors:** `400` wrong MIME type | `400` file too large | `500` Cloudinary error

---

## Error Format

All error responses follow:

```json
{ "error": "Human-readable error message" }
```

HTTP status codes: `400` validation | `401` unauthorized | `403` forbidden | `404` not found | `409` conflict | `429` rate limited | `500` server error
