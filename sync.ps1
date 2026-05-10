git add .
git commit -m "Update portfolio: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
git push origin main
Write-Host "Portfolio synced to GitHub successfully!" -ForegroundColor Green
