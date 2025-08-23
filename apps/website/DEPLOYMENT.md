# Deployment Guide for Networkk Website

## Overview
This guide covers deploying the Networkk website with Astro's hybrid mode and Node.js adapter.

## Architecture
- **Framework**: Astro v4 with hybrid rendering
- **Adapter**: Node.js standalone
- **Static Assets**: Generated in `dist/client/`
- **Server**: Node.js server for API routes and SSR
- **Contact Form**: Server-side API with Resend integration

## Build Requirements
- Node.js 18+ 
- npm or pnpm
- Environment variables (see `.env.example`)

## Environment Variables Required
```bash
RESEND_API_KEY=your_resend_api_key_here
FROM_EMAIL=anupama.singh@networkk.in
TO_EMAIL=anupama.singh@networkk.in
```

## Build Process
```bash
cd apps/website
npm install
npm run build
```

## Deployment Options

### Option 1: Node.js Server (Recommended)
1. Build the project: `npm run build`
2. Copy `dist/` folder to your server
3. Install Node.js dependencies on server
4. Set environment variables
5. Start the server: `node dist/server/entry.mjs`

### Option 2: PM2 Process Manager
```bash
# Install PM2
npm install -g pm2

# Start the application
pm2 start dist/server/entry.mjs --name "networkk-website"

# Save PM2 configuration
pm2 save
pm2 startup
```

### Option 3: Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY dist/ ./dist/
COPY package.json ./
RUN npm install --production
EXPOSE 4321
CMD ["node", "dist/server/entry.mjs"]
```

## Server Configuration

### Nginx Reverse Proxy (Recommended)
```nginx
server {
    listen 80;
    server_name www.networkk.in;
    
    # Static assets
    location /_astro/ {
        root /path/to/dist/client;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    location /images/ {
        root /path/to/dist/client;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # API routes and SSR
    location / {
        proxy_pass http://localhost:4321;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Apache Virtual Host
```apache
<VirtualHost *:80>
    ServerName www.networkk.in
    
    # Static assets
    Alias /_astro /path/to/dist/client/_astro
    Alias /images /path/to/dist/client/images
    
    <Directory "/path/to/dist/client">
        ExpiresActive On
        ExpiresDefault "access plus 1 year"
    </Directory>
    
    # Proxy to Node.js server
    ProxyPreserveHost On
    ProxyPass /_astro !
    ProxyPass /images !
    ProxyPass / http://localhost:4321/
    ProxyPassReverse / http://localhost:4321/
</VirtualHost>
```

## Contact Form Requirements
1. **Environment Variables**: Ensure `RESEND_API_KEY` is set
2. **Email Configuration**: Update `FROM_EMAIL` and `TO_EMAIL`
3. **Rate Limiting**: Built-in (5 requests per IP per 15 minutes)
4. **Validation**: Real-time client-side + server-side validation

## Troubleshooting

### Contact Page Not Loading
1. **Check domain configuration**: Ensure site URL matches your domain
2. **Verify build**: Contact page should exist in `dist/client/contact/index.html`
3. **Server logs**: Check Node.js server logs for errors
4. **Environment**: Ensure server runs from correct directory

### API Routes Not Working
1. **Hybrid Mode**: Ensure `output: 'hybrid'` in `astro.config.mjs`
2. **Adapter**: Verify Node.js adapter is configured
3. **Environment Variables**: Must be available to Node.js process
4. **File Structure**: API files in `src/pages/api/` directory

### Email Not Sending
1. **Resend API Key**: Verify key is valid and active
2. **Email Verification**: Ensure sender domain is verified in Resend
3. **Logs**: Check server logs for email errors
4. **Rate Limits**: Resend free tier has rate limits

## Performance Optimization
- Static assets are automatically cached
- Images use WebP format with fallbacks
- Critical CSS is inlined
- Scripts are bundled and minified

## Security Considerations
- Form validation on both client and server
- Rate limiting prevents spam
- Environment variables for sensitive data
- HTTPS recommended for production

## Monitoring
- Monitor Node.js process with PM2 or similar
- Check server logs for errors
- Monitor email delivery in Resend dashboard
- Set up uptime monitoring for the website

## Support
For deployment issues, check:
1. Build logs for errors
2. Server logs for runtime issues
3. Network tab for failed requests
4. Contact form API responses
