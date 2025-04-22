@echo off
cd /d %~dp0

echo Building the project...
pnpm run dev:h5

if %ERRORLEVEL% neq 0 (
    echo Build failed with error code %ERRORLEVEL%.
    pause
    exit /b %ERRORLEVEL%
)

echo Build completed successfully. Moving files...
