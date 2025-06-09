#!/bin/bash

# Start development script for Oto Voice API Client
echo "🎙️ Starting Oto Voice API Client Development Server"
echo "=================================================="

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo "🚀 Starting development server on http://localhost:3001"
echo ""
echo "📋 Make sure your Oto Voice API server is running on http://localhost:3000"
echo "⚙️  You can configure the API endpoint in the client interface"
echo ""

# Start the development server
npm run dev
