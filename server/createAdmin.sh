#!/bin/bash

# Admin Creation Script for SIH Project
# Usage: ./createAdmin.sh [fullName] [email] [password]

echo "🚀 Creating Admin User..."

# Check if tsx is installed
if ! command -v tsx &> /dev/null; then
    echo "❌ tsx is not installed. Please install it first:"
    echo "npm install -g tsx"
    exit 1
fi

# Check if all arguments are provided
if [ $# -eq 3 ]; then
    echo "📝 Creating admin with provided credentials..."
    tsx scripts/createAdmin.ts "$1" "$2" "$3"
elif [ $# -eq 0 ]; then
    echo "📝 Creating default admin (for development)..."
    tsx scripts/createAdmin.ts
else
    echo "❌ Invalid number of arguments"
    echo "Usage: $0 [fullName] [email] [password]"
    echo "Example: $0 'John Admin' 'admin@company.com' 'secure123'"
    echo "Or run without arguments to create default admin"
    exit 1
fi