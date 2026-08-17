# ============================================================
# ALAJO PROJECT — SESSION BOOT SCRIPT
# Run this at the START of every dev session to reload context
# Usage: cd C:\Users\USER\Documents\capstone\alajo && .\.brain\BOOT_SESSION.ps1
# ============================================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   ALAJO PROJECT BRAIN — BOOTING UP    " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Show project identity
Write-Host "[1/5] PROJECT IDENTITY" -ForegroundColor Yellow
Write-Host "  App:     Alajo - Digital Savings Circle"
Write-Host "  Fellow:  Nuhu Lawal (FE/23/84783109)"
Write-Host "  ALC:     Almara Hub - Paragon Nigeria"
Write-Host ""

# 2. Show all brain files
Write-Host "[2/5] BRAIN FILES" -ForegroundColor Yellow
Get-ChildItem "C:\Users\USER\Documents\capstone\alajo\.brain\" -File | ForEach-Object {
    Write-Host "  - $($_.Name) ($([math]::Round($_.Length/1KB, 1)) KB)"
}
Write-Host ""

# 3. Show current status from BRAIN.md
Write-Host "[3/5] CURRENT STATUS (from BRAIN.md)" -ForegroundColor Yellow
$brain = Get-Content "C:\Users\USER\Documents\capstone\alajo\.brain\BRAIN.md" -Raw
$statusSection = $brain -split "## 📊 CURRENT STATUS" | Select-Object -Last 1
$statusLines = ($statusSection -split "---")[0] -split "`n" | Where-Object { $_ -match "\[" } | Select-Object -First 15
$statusLines | ForEach-Object { Write-Host "  $_" }
Write-Host ""

# 4. Show next actions
Write-Host "[4/5] IMMEDIATE NEXT ACTIONS" -ForegroundColor Yellow
$nextActions = Get-Content "C:\Users\USER\Documents\capstone\alajo\.brain\NEXT_ACTIONS.md" -Raw
$immediateSection = $nextActions -split "## IMMEDIATE NEXT STEPS" | Select-Object -Last 1
$actionLines = ($immediateSection -split "###")[1..3] | ForEach-Object {
    ($_ -split "`n")[0]
}
$actionLines | ForEach-Object { Write-Host "  STEP: $_" -ForegroundColor Green }
Write-Host ""

# 5. Show last diary entry date
Write-Host "[5/5] LAST SESSION" -ForegroundColor Yellow
$latestDiary = Get-ChildItem "C:\Users\USER\Documents\capstone\alajo\.brain\diary" -Recurse -Filter "*.md" | Sort-Object LastWriteTime -Descending | Select-Object -First 1
if ($latestDiary) {
    Write-Host "  Last diary: $($latestDiary.Name)"
    Write-Host "  Written:    $($latestDiary.LastWriteTime)"
}
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  BRAIN LOADED. READY TO BUILD. 🚀      " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "REMINDER: Update PROGRESS.md + NEXT_ACTIONS.md at end of session!" -ForegroundColor Red
Write-Host ""
