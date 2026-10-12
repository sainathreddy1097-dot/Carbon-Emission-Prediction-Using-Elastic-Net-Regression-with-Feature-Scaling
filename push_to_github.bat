@echo off
echo ===================================================
echo Pushing CarbonWise project to GitHub...
echo Repository: https://github.com/sainathreddy1097-dot/Carbon-Emission-Prediction-Using-Elastic-Net-Regression-with-Feature-Scaling
echo ===================================================
echo.
cd /d "%~dp0"
git push origin main
if %ERRORLEVEL% EQU 0 (
    echo.
    echo ===================================================
    echo Successfully uploaded to GitHub!
    echo Check your repository at:
    echo https://github.com/sainathreddy1097-dot/Carbon-Emission-Prediction-Using-Elastic-Net-Regression-with-Feature-Scaling
    echo ===================================================
) else (
    echo.
    echo [ERROR] Push failed. If prompted, please sign in via browser or check your GitHub permissions.
)
pause
