set OUTPUT_DIR=D:\Backup\Documents\HBuilderProjects\mobile\buildMobile

echo Copying files...
robocopy "dist\build\h5" "%OUTPUT_DIR%" /MIR /XD ".git" /XF ".gitignore"

if %ERRORLEVEL% geq 8 (
    echo Copy failed with error code %ERRORLEVEL%.
) else (
    echo Files copied to %OUTPUT_DIR%.
)

pause
