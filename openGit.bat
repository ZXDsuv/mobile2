

@echo off
setlocal
cd /d %~dp0
start "" "C:\ProgramData\Microsoft\Windows\Start Menu\Programs\Git\Git Bash.lnk" --cd="%cd%"
