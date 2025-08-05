# PowerShell script for Windows
Write-Host "Starting Temple Donation System..." -ForegroundColor Green

# Set environment variables
$env:NODE_ENV = "development"
$env:DATABASE_URL = "postgresql://neondb_owner:npg_TPc37yNrkbZF@ep-fragrant-forest-adfudasj-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require"
$env:SESSION_SECRET = "temple-donation-secret-key-change-in-production"
$env:PORT = "5000"

Write-Host "Environment variables configured..." -ForegroundColor Yellow
Write-Host "Starting development server..." -ForegroundColor Cyan

# Start the application
tsx server/index.ts