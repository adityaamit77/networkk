# Networkk Website Deployment

## Current Issue: 404 Error on Contact Page

Your contact page is showing a 404 error because your server is configured for static hosting, but your site uses Astro's hybrid mode which requires a Node.js server.

## Quick Diagnosis

The error `Failed to load resource: the server responded with a status of 404` indicates that:

1. ❌ Your server is serving static files only
2. ❌ The Node.js application (`dist/server/entry.mjs`) is not running
3. ❌ Web server is not configured to proxy requests to the Node.js app

## Immediate Solutions

### Solution 1: Enable Node.js on Your Server (Recommended)

**If you have VPS/Dedicated Server:**

1. **SSH into your server**
2. **Upload the built application:**
   ```bash
   # Upload dist/ folder to your server
   scp -r dist/ user@yourserver.com:/path/to/website/
   ```

3. **Set environment variables:**
   ```bash
   export RESEND_API_KEY=your_resend_api_key
   export FROM_EMAIL=anupama.singh@networkk.in
   export TO_EMAIL=anupama.singh@networkk.in
   ```

4. **Start the Node.js server:**
   ```bash
   cd /path/to/website
   node dist/server/entry.mjs
   ```

5. **Configure Nginx/Apache to proxy requests:**
   
   **Nginx configuration:**
   ```nginx
   server {
       listen 80;
       server_name www.networkk.in;
       
       location / {
           proxy_pass http://localhost:4321;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       }
   }
   ```

### Solution 2: Use Platform-Specific Deployment

**If using Vercel:**
```bash
npm install -g vercel
vercel --prod
```

**If using Netlify:**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

**If using Railway/Render/Heroku:**
- Create `package.json` in root with start script
- Set environment variables in platform dashboard
- Deploy directly from Git

### Solution 3: Switch to Static + External Form Service (Temporary)

If you can't run Node.js, temporarily use a form service:

1. **Sign up for form service:**
   - Formspree.io
   - Netlify Forms
   - Typeform

2. **Update form action:**
   ```html
   <form action="https://formspree.io/f/your-form-id" method="POST">
   ```

## What's Happening Now

Your current deployment:
- ✅ Static files are being served correctly
- ❌ Node.js server is not running
- ❌ Contact page routing fails with 404
- ❌ API endpoints are not available

## Next Steps

1. **Determine your hosting type:**
   - Shared hosting (GoDaddy, Bluehost): Usually no Node.js
   - VPS (DigitalOcean, Linode): Full Node.js support
   - Platform (Vercel, Netlify): Built-in support

2. **Choose appropriate solution based on your hosting**

3. **Test the deployment:**
   ```bash
   curl https://www.networkk.in/contact
   curl https://www.networkk.in/api/contact-new
   ```

## Need Help?

To help you further, please let me know:
1. What hosting provider are you using?
2. Do you have SSH access to your server?
3. Can you run Node.js applications on your hosting?

Once I know your hosting setup, I can provide specific deployment instructions.
