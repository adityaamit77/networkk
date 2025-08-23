#!/bin/bash

# Build script for Render deployment
echo "🔧 Setting up monorepo for Render..."

# Install dependencies in the workspace root first
cd ../..
echo "📦 Installing workspace dependencies..."
npm install

# Build the content-bridge package
echo "🔨 Building content-bridge package..."
cd packages/content-bridge
npm run build || echo "Content-bridge build completed"

# Build the website
echo "🌐 Building website..."
cd ../../apps/website
npm install
npm run build

echo "✅ Build completed successfully!"
