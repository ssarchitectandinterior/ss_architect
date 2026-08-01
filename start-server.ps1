# start-server.ps1 - Launch local development server
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectRoot

Write-Host "Starting Vite development server..."
npx vite --open
