# Provider Payment Feature

## What's New

The assignment form now includes a **Provider Payment** field that lets you set how much the provider will receive, separate from what the client pays.

## How to Use

When assigning a provider to a booking:

1. **Select Provider** - Choose the healthcare provider
2. **Rate Per Day** - Set the daily rate for the client
3. **Number of Days** - Enter service duration
4. **Provider Payment** - Enter the amount the provider will receive

### Example

```
Rate Per Day: UGX 50,000
Number of Days: 3
─────────────────────────
Client Total: UGX 150,000  (what client pays)
Provider Payment: UGX 120,000  (what provider receives)
```

## Key Points

- **Client sees**: Total amount they need to pay (rate × days)
- **Provider sees**: Only their payment amount (not client price)
- **You control**: Both amounts independently

## Why This Matters

- Set platform commission (difference between client price and provider payment)
- Offer provider bonuses or incentives
- Adjust rates per provider based on experience
- Maintain pricing flexibility

## What Providers See

Providers will see:
- Notification: "You will receive UGX X"
- Assignment card: Shows their payment amount
- Earnings: Based on their payment amount

They do NOT see what the client paid.

## Setup Required

Before using this feature, run the database migration:

```bash
cd QNCBE
node scripts/add-provider-payment-migration.js
```

See `QNCBE/PROVIDER-PAYMENT-SETUP.md` for full setup instructions.
