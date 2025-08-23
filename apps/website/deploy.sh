#!/bin/bash

# Deployment script for Networkk website
# This script builds and deploys the hybrid Astro application

echo "🚀 Starting Networkk website deployment..."

# Build the application
echo "📦 Building application..."
cd apps/website
npm install
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "❌ Build failed - dist directory not found"
    exit 1
fi

echo "✅ Build completed successfully"

# Create deployment package
echo "📋 Creating deployment package..."
tar -czf ../../networkk-website-$(date +%Y%m%d-%H%M%S).tar.gz dist/ package.json

echo "📝 Deployment instructions:"
echo "1. Upload the tar.gz file to your server"
echo "2. Extract: tar -xzf networkk-website-*.tar.gz"
echo "3. Set environment variables:"
echo "   export RESEND_API_KEY=your_key_here"
echo "   export FROM_EMAIL=anupama.singh@networkk.in"
echo "   export TO_EMAIL=anupama.singh@networkk.in"
echo "4. Start the server: node dist/server/entry.mjs"
echo "5. Configure reverse proxy to port 4321"

echo "🎉 Deployment package ready!"
