# Razorpay Integration

Simple Node.js + Express demo to create and verify Razorpay payments.

## Prerequisites

- Node.js 18+
- pnpm
- Razorpay test keys

## Setup

1. Install dependencies:

```bash
pnpm install
```

2. Create a `.env` file in the root with:

```env
RAZORPAY_KEY_ID=your_test_key_id
RAZORPAY_KEY_SECRET=your_test_key_secret
PORT=3000
```

## Run

```bash
pnpm dev
```

Open `http://localhost:3000` in your browser.

## API Routes

- `POST /razorpay-payment/create-order`
- `GET /razorpay-payment/get-key`
- `POST /razorpay-payment/verify-payment`
