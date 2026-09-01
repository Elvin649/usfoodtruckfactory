@echo off
REM ==========================================================================
REM  US Food Truck Factory - local development server
REM
REM  Double-click this file. It serves the whole site with PHP, so the contact
REM  and quote forms and the /admin panel all work exactly as they will on the
REM  real hosting.
REM
REM  Close this window to stop the server.
REM ==========================================================================

setlocal
cd /d "%~dp0.."

set "PHP=C:\Users\babay\php-local\php.exe"
set "INI=C:\Users\babay\php-local\php.ini"
set "PORT=8000"

if not exist "%PHP%" (
  echo.
  echo   PHP tapilmadi: %PHP%
  echo.
  echo   Portativ PHP-ni bu unvandan endirib hemin qovluga acin:
  echo   https://windows.php.net/download/  ^(Non Thread Safe, x64, zip^)
  echo   Sonra php.ini-development faylini php.ini adi ile kopyalayin ve
  echo   bu setirleri aktiv edin: extension_dir="ext", extension=pdo_sqlite,
  echo   extension=sqlite3, extension=mbstring
  echo.
  pause
  exit /b 1
)

echo.
echo   ==================================================
echo    US Food Truck Factory - lokal server
echo   ==================================================
echo.
echo    Sayt         http://localhost:%PORT%
echo    Admin panel  http://localhost:%PORT%/admin/
echo.
echo    Ilk defe girirsinizse admin hesabi yaradilacaq.
echo    Dayandirmaq ucun bu pencereni baglayin.
echo.

start "" "http://localhost:%PORT%"

"%PHP%" -c "%INI%" -S localhost:%PORT% -t .
