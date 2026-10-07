@echo off
setlocal EnableDelayedExpansion
REM Metafisica Advance - genera el APK de prueba (debug) en Windows.
REM Requisitos: Node.js 22+, Android Studio (con SDK) y un JDK 21.
REM Gradle 8.14 NO funciona con Java 22-25 ("Unsupported class file major version 69" = Java 25),
REM por eso este script busca un JDK 21 y lo usa solo para esta compilacion.
chcp 65001 >nul
cd /d "%~dp0"

REM ---------- 1. Buscar un JDK 21 ----------
set "JDK21="
call :probar "%JAVA_HOME%"
if not defined JDK21 call :probar "%ProgramFiles%\Android\Android Studio\jbr"
if not defined JDK21 call :probar "%LOCALAPPDATA%\Programs\Android Studio\jbr"
if not defined JDK21 for /d %%D in ("%ProgramFiles%\Eclipse Adoptium\jdk-21*" "%ProgramFiles%\Microsoft\jdk-21*" "%ProgramFiles%\Java\jdk-21*" "%ProgramFiles%\Zulu\zulu-21*" "%ProgramFiles%\Amazon Corretto\jdk21*") do (
  if not defined JDK21 call :probar "%%~D"
)
if not defined JDK21 (
  echo.
  echo *** No encontre un JDK 21. Instala uno con este comando y vuelve a ejecutar el .bat:
  echo     winget install EclipseAdoptium.Temurin.21.JDK
  echo     ^(o descargalo de https://adoptium.net  -  version 21 LTS^)
  goto :error
)
set "JAVA_HOME=%JDK21%"
set "PATH=%JDK21%\bin;%PATH%"
echo Usando Java 21: %JDK21%

REM ---------- 2. Buscar el Android SDK y escribir android\local.properties ----------
set "SDK="
for %%S in ("%ANDROID_HOME%" "%ANDROID_SDK_ROOT%" "%LOCALAPPDATA%\Android\Sdk" "%USERPROFILE%\AppData\Local\Android\Sdk" "C:\Android\Sdk") do (
  if not defined SDK if not "%%~S"=="" if exist "%%~S\platform-tools" set "SDK=%%~S"
)
if not defined SDK (
  echo.
  echo *** No encontre el Android SDK.
  echo     Abre Android Studio, More Actions - SDK Manager, y fijate en "Android SDK Location".
  echo     Si esta vacio, pulsa Edit e instala el SDK. Luego vuelve a ejecutar este .bat.
  goto :error
)
set "SDKF=%SDK:\=/%"
> "android\local.properties" echo sdk.dir=%SDKF%
set "ANDROID_HOME=%SDK%"
echo Usando Android SDK: %SDK%
if not exist "%SDK%\platforms\android-36" echo (Aviso: falta la plataforma Android 16 / API 36; Gradle intentara descargarla. Si falla, instalala en SDK Manager.)

REM ---------- 3. Dependencias y compilacion ----------
if not exist node_modules (
  echo Instalando dependencias...
  call npm install || goto :error
)
REM detiene cualquier Gradle que haya quedado vivo con otro Java
if exist android\gradlew.bat call android\gradlew.bat -p android --stop >nul 2>&1
call npm run apk:debug || goto :error
echo.
echo Listo. Copiando el APK a esta carpeta...
copy /Y "android\app\build\outputs\apk\debug\app-debug.apk" "MetafisicaAdvance-debug.apk" >nul
echo APK: %~dp0MetafisicaAdvance-debug.apk
pause
exit /b 0

:error
echo.
echo *** Algo fallo. Revisa la seccion "Problemas frecuentes" de GUIA_INSTALACION.md ***
pause
exit /b 1

REM ---------- comprueba si la carpeta %1 es un JDK 21 ----------
:probar
set "CAND=%~1"
if "%CAND%"=="" exit /b 0
if not exist "%CAND%\bin\java.exe" exit /b 0
"%CAND%\bin\java.exe" -version 2>&1 | findstr /r /c:"version .21\." >nul && set "JDK21=%CAND%"
exit /b 0
