# Networkk Contact Form API

A simple, production-ready contact form API using Resend for email delivery.

## Features

✅ **Contact Form Only** - Simplified to just the essential contact functionality  
✅ **Resend Integration** - Reliable email delivery service  
✅ **Rate Limiting** - 5 requests per 15 minutes per IP  
✅ **Auto-Reply** - Confirmation emails to users  
✅ **Validation** - Comprehensive input validation  
✅ **Health Checks** - System monitoring endpoint  

## Quick Setup

### 1. Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# Required
RESEND_API_KEY=your_resend_api_key_here
FROM_EMAIL=support@networkk.in
TO_EMAIL=support@networkk.in

# Optional
SYSTEM_AUTH_TOKEN=your_secure_token
```

### 2. Get Resend API Key

1. Sign up at [resend.com](https://resend.com)
2. Go to API Keys section
3. Create a new API key
4. Add it to your `.env` file

### 3. Test the API

```bash
# Start development server
pnpm dev

# Test contact form
curl -X POST http://localhost:4321/api/contact-new \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com", 
    "company": "Example Corp",
    "jobTitle": "CEO",
    "service": "executive-search",
    "message": "Test message",
    "consent": "true"
  }'

# Check health
curl http://localhost:4321/api/health
```

## API Endpoints

### POST /api/contact-new
Contact form submission with email notifications.

**Required fields:**
- `name` - Full name (min 2 chars)
- `email` - Valid email address  
- `company` - Company name (min 2 chars)
- `jobTitle` - Job title (min 2 chars)
- `service` - Service of interest
- `message` - Message (min 10 chars)
- `consent` - Privacy policy consent

**Optional fields:**
- `phone` - Phone number

### GET /api/health
System health check endpoint.

## Email Templates

The API sends two emails per submission:

1. **To Company** (`TO_EMAIL`) - Contains all form details
2. **To User** (auto-reply) - Confirmation message

Both use professional HTML templates with the Networkk branding.

## Rate Limiting

- **5 requests per 15 minutes** per IP address
- Stored in memory (use Redis in production)
- Returns 429 status when exceeded

## Error Handling

Consistent error responses:

```json
{
  "success": false,
  "error": "Human readable message",
  "code": "ERROR_CODE"
}
```

## Production Notes

### Recommended Enhancements
- [ ] Add Redis for rate limiting
- [ ] Add database for form submissions
- [ ] Set up monitoring (Sentry)
- [ ] Configure CORS for your domain
- [ ] Add webhook notifications (Slack/Teams)

### Email Deliverability
- Verify your domain in Resend
- Set up DKIM/SPF records
- Monitor delivery rates
- Consider adding unsubscribe links

## File Structure

```
src/pages/api/
├── contact-new.ts    # Main contact form API
└── health.ts         # Health check endpoint

src/components/blocks/
└── ContactForm.astro # Frontend form component
```

This simplified setup focuses on the core contact functionality while maintaining production-ready quality and security.
