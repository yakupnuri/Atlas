# Security Guidelines

## Environment Variables

This application uses environment variables to store sensitive information. **Never commit the `.env` file to version control.**

### Setup Instructions

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your actual credentials in the `.env` file

3. The `.env` file is already in `.gitignore` and will not be committed

### Required Environment Variables

#### Database
- `MONGO_URL`: MongoDB connection string
- `DB_NAME`: Database name

#### Application
- `NEXT_PUBLIC_BASE_URL`: Your application URL
- `NEXTAUTH_URL`: NextAuth authentication URL
- `NEXTAUTH_SECRET`: Secret for NextAuth (generate with: `openssl rand -base64 32`)

#### Stripe Payment Gateway
Get your keys from [Stripe Dashboard](https://dashboard.stripe.com/apikeys):
- `STRIPE_SECRET_KEY`: Secret key (sk_test_... or sk_live_...)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Publishable key (pk_test_... or pk_live_...)
- `STRIPE_WEBHOOK_SECRET`: Webhook signing secret (whsec_...)

#### Google OAuth
Get credentials from [Google Cloud Console](https://console.cloud.google.com/):
- `GOOGLE_CLIENT_ID`: Your client ID
- `GOOGLE_CLIENT_SECRET`: Your client secret

#### Email (Optional)
- `EMAIL_FROM`: Sender email address
- `EMAIL_HOST`: SMTP host
- `EMAIL_PORT`: SMTP port
- `EMAIL_USER`: SMTP username
- `EMAIL_PASSWORD`: SMTP password

### Admin Panel API Management

You can also manage some API keys directly from the admin panel:
- Admin Panel → Settings → API Settings

Supported APIs:
- Stripe Payment Gateway
- Google OAuth
- Unsplash
- SMTP Email

### Security Best Practices

1. ✅ **DO**: Use environment variables for all secrets
2. ✅ **DO**: Keep `.env` in `.gitignore`
3. ✅ **DO**: Use different keys for development and production
4. ✅ **DO**: Rotate keys regularly
5. ✅ **DO**: Use strong, randomly generated secrets

6. ❌ **DON'T**: Commit `.env` files
7. ❌ **DON'T**: Hardcode secrets in your code
8. ❌ **DON'T**: Share secrets via email or chat
9. ❌ **DON'T**: Use production keys in development
10. ❌ **DON'T**: Expose secret keys in client-side code

### Key Format Validation

The application validates key formats:
- Stripe Test Publishable: `pk_test_...`
- Stripe Test Secret: `sk_test_...`
- Stripe Live Publishable: `pk_live_...`
- Stripe Live Secret: `sk_live_...`
- Stripe Webhook: `whsec_...`
- Google OAuth Secret: `GOCSPX-...`

### In Case of Key Exposure

If you accidentally expose a secret:

1. **Immediately** revoke/delete the exposed key from the service dashboard
2. Generate a new key
3. Update your `.env` file with the new key
4. Update production deployment with new environment variables
5. Review git history and consider using tools like [git-secrets](https://github.com/awslabs/git-secrets)

### Additional Resources

- [Stripe Security Best Practices](https://stripe.com/docs/security)
- [Google OAuth Security](https://developers.google.com/identity/protocols/oauth2/security-best-practices)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
