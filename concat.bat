@echo off
REM Concatenate all 12 scene MP4s into a single final video.
REM This file is a thin wrapper — uses concat-videos.js

node concat-videos.js
pause


echo Building concat list...
> %LIST% echo file '%INPUT_DIR%\01-hook.mp4'
>>%LIST% echo file '%INPUT_DIR%\02-setup.mp4'
>>%LIST% echo file '%INPUT_DIR%\03-minimax.mp4'
>>%LIST% echo file '%INPUT_DIR%\04-deepseek.mp4'
>>%LIST% echo file '%INPUT_DIR%\05-bigpickle.mp4'
>>%LIST% echo file '%INPUT_DIR%\06-mimo.mp4'
>>%LIST% echo file '%INPUT_DIR%\07-gemma.mp4'
>>%LIST% echo file '%INPUT_DIR%\08-nemotron-super.mp4'
>>%LIST% echo file '%INPUT_DIR%\09-nemotron-nano.mp4'
>>%LIST% echo file '%INPUT_DIR%\10-leaderboard.mp4'
>>%LIST% echo file '%INPUT_DIR%\11-verdict.mp4'
>>%LIST% echo file '%INPUT_DIR%\12-outro.mp4'

echo Concatenating 12 scenes...
ffmpeg -y -f concat -safe 0 -i %LIST% -c copy %OUTPUT%

if %ERRORLEVEL% == 0 (
  echo.
  echo DONE: %OUTPUT% created.
  echo.
  for %%I in (%OUTPUT%) do echo Size: %%~zI bytes
) else (
  echo.
  echo FAILED - check the error above.
)

del %LIST% 2>nul
pause
