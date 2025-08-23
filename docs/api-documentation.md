# Networkk Contact Form API Documentation

## Overview

This document describes the contact form API implemented for the Networkk website, built with TypeScript and using Resend for email delivery.

## Base URL

- Development: `http://localhost:4321/api`
- Production: `https://networkk.com/api`

## Authentication

The contact form API is public and does not require authentication.

---

## Endpoints

### Contact Form API

**Endpoint:** `POST /api/contact-new`

**Description:** Contact form submission with email notifications via Resend.

**Request Body:**

```typescript
{
  name: string;          // Required: Full name (min 2 chars)
  email: string;         // Required: Valid email address
  phone?: string;        // Optional: Valid phone number
  company: string;       // Required: Company name (min 2 chars)
  jobTitle: string;      // Required: Job title (min 2 chars)
  service: string;       // Required: Service of interest
  message: string;       // Required: Message (min 10 chars)
  consent: string;       // Required: Privacy policy consent
}
```

**Response:**

```typescript
{
  success: boolean;
  message: string;
  data?: {
    submissionId: string;
    timestamp: string;
  };
  error?: string;
  code?: string;
}
```

**Features:**

- Email validation and sanitization
- Rate limiting (5 requests per 15 minutes per IP)
- Automatic email notifications to company via Resend
- Auto-reply confirmation email to user
- GDPR-compliant consent tracking
- Comprehensive error handling

**Environment Variables:**

- `RESEND_API_KEY`: Your Resend API key
- `FROM_EMAIL`: Sender email address
- `TO_EMAIL`: Recipient email address

---

### Health Check API

**Endpoint:** `GET /api/health`

**Description:** System health monitoring and status checks.

**Query Parameters:**

- `detailed=true`: Include service status checks

**Response:**

```typescript
{
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  version: string;
  services?: {
    email?: 'healthy' | 'degraded' | 'unhealthy';
    analytics?: 'healthy' | 'unhealthy';
    external?: 'healthy' | 'degraded' | 'unhealthy';
  };
  performance: {
    responseTime: number;
    memoryUsage?: NodeJS.MemoryUsage;
  };
}
```

**System Info:** `POST /api/health` (requires `Authorization: Bearer {SYSTEM_AUTH_TOKEN}`)

**Features:**

- Service dependency checking
- Performance monitoring
- Memory usage tracking
- External service availability tests

---

## Rate Limiting

The contact form API implements rate limiting to prevent abuse:

| Endpoint | Limit | Window |
|----------|-------|--------|
| Contact Form | 5 requests | 15 minutes |

Rate limits are per IP address and stored in memory (use Redis in production).

---

## Error Handling

All APIs return consistent error responses:

```typescript
{
  success: false;
  error: string;           // Human-readable error message
  code?: string;           // Error code for programmatic handling
}
```

Common error codes:

- `VALIDATION_ERROR`: Input validation failed
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `INTERNAL_ERROR`: Server error

---

## Security Features

1. **Input Validation**: All inputs are validated and sanitized
2. **Rate Limiting**: Prevents abuse and DoS attacks
3. **CORS**: Configured for production domains
4. **Privacy**: GDPR-compliant data handling

---

## Development Setup

1. Copy `.env.example` to `.env`
2. Configure your Resend API key
3. Set up email addresses

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Test API
curl -X POST http://localhost:4321/api/health
```

---

## Production Deployment

### Environment Variables Checklist:

- [ ] `RESEND_API_KEY`: Resend email service API key
- [ ] `FROM_EMAIL`: Sender email address
- [ ] `TO_EMAIL`: Recipient email address
- [ ] `SYSTEM_AUTH_TOKEN`: Security token for health checks

### Recommended Enhancements:

- [ ] Redis for rate limiting
- [ ] Database for data persistence
- [ ] Monitoring (Sentry, LogRocket)
- [ ] CDN configuration

---

## Testing

Example test request:

```bash
# Test contact form
curl -X POST http://localhost:4321/api/contact-new \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "company": "Example Corp",
    "jobTitle": "CEO",
    "service": "executive-search",
    "message": "Interested in your services",
    "consent": "true"
  }'

# Test health check
curl http://localhost:4321/api/health?detailed=true
```

---

## Integration Examples

### Frontend Form Handling

```typescript
// Contact form submission
const submitForm = async (formData: FormData) => {
  try {
    const response = await fetch('/api/contact-new', {
      method: 'POST',
      body: formData
    });
    
    const result = await response.json();
    
    if (result.success) {
      // Show success message
      console.log('Submission ID:', result.data.submissionId);
    } else {
      // Handle error
      console.error('Error:', result.error);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
};
```

### Email Template Customization

The contact form sends two emails:

1. **Notification to company** - Contains all form details
2. **Auto-reply to user** - Confirmation message

Both emails are sent via Resend and can be customized by modifying the email templates in the API code.
