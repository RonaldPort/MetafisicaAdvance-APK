# Metafísica Advance · APK para Android

Esta carpeta convierte el juego (`../index.html`) en una app Android con **Capacitor 8**. El juego corre dentro de un WebView, sin conexión, con la consola y sus botones táctiles intactos.

## Qué añade la versión Android

| Función | Dónde está |
|---|---|
| **Memoria**: la partida se guarda sola (como en la web) y además se copia al almacenamiento nativo de Android; si el sistema borra los datos del WebView, se restaura al abrir | `src/apk-boot.js` |
| **Guardado al salir**: al minimizar o cerrar la app se guarda la posición | `src/apk-extras.js` |
| **Despedida**: desfile de 82 lógicos y filósofos analíticos del siglo XX en siete escuelas, con su estandarte, fechas y aporte, música propia («adios») y foto de grupo final | `src/apk-extras.js`, `src/apk.css` |
| Se lanza **al vencer a Carnap** (final del juego) o con el código **← → ← → A B A B ←** en los botones de la consola (máx. 3 s entre pulsaciones) | parches en `scripts/sync-game.mjs` |
| Botón **atrás** de Android = botón B; en la portada, dos veces seguidas para salir | `src/apk-extras.js` |
| Pantalla completa inmersiva y pantalla siempre encendida | `android/app/src/main/java/.../MainActivity.java` |
| Icono (Ousía) y pantalla de arranque | `android/app/src/main/res/` |

Durante la despedida: **A** acelera ×4 (o tocar la pantalla), **B** salta a la foto final, **START** sale. En la foto final, **A** vuelve al juego. La app recuerda cuántas despedidas has visto.

## Estructura

```
APK/
├─ GUIA_INSTALACION.md        ← esta guía
├─ build-apk.bat              ← doble clic: genera el APK de prueba en Windows
├─ package.json               ← dependencias y comandos (npm run …)
├─ capacitor.config.json      ← nombre, id de la app (pe.lawliet.metafisicaadvance), colores
├─ scripts/
│  ├─ sync-game.mjs           ← copia ../index.html a www/ y aplica los 7 parches
│  └─ gradle.mjs              ← lanza gradlew (Windows / Linux / macOS)
├─ src/                       ← código propio de la versión Android
│  ├─ apk-boot.js · apk-extras.js · apk.css
├─ www/                       ← juego ya parcheado (se regenera con npm run sync-game)
└─ android/                   ← proyecto Android Studio ya generado y personalizado
```

> El juego original no se toca. Si cambias `../index.html`, ejecuta `npm run sync` y vuelve a compilar.

---

## 1. Instalar los programas (una sola vez, Windows)

### 1.1 Node.js (22 o superior)
1. Descarga el instalador **LTS** de <https://nodejs.org> y ejecútalo con las opciones por defecto.
2. Comprueba en una terminal nueva (PowerShell):
   ```powershell
   node -v     # v22.x o superior
   npm -v
   ```

### 1.2 Android Studio (trae el JDK 21 y el SDK de Android)
1. Descarga Android Studio de <https://developer.android.com/studio> e instálalo.
2. Ábrelo y sigue el asistente **Standard**: descargará el **Android SDK**, **Platform-Tools** y un emulador.
3. En *More Actions → SDK Manager*:
   - pestaña **SDK Platforms**: marca **Android 16 (API 36)**;
   - pestaña **SDK Tools**: marca **Android SDK Build-Tools**, **Android SDK Command-line Tools** y **Android SDK Platform-Tools**. Pulsa *Apply*.

### 1.3 Variables de entorno (solo si vas a compilar desde la terminal o con `build-apk.bat`)
En *Configuración de Windows → Sistema → Información → Configuración avanzada → Variables de entorno*, crea (en «Variables de usuario»):

| Variable | Valor típico |
|---|---|
| `JAVA_HOME` | `C:\Program Files\Android\Android Studio\jbr` |
| `ANDROID_HOME` | `C:\Users\<tu usuario>\AppData\Local\Android\Sdk` |

Y añade a `Path`: `%JAVA_HOME%\bin` y `%ANDROID_HOME%\platform-tools`. Cierra y vuelve a abrir la terminal, y comprueba:
```powershell
java -version    # 21.x
adb version
```

---

## 2. Preparar el proyecto

En PowerShell, dentro de esta carpeta `APK`:
```powershell
npm install          # descarga Capacitor (crea node_modules/)
npm run sync         # copia el juego a www/ y lo sincroniza con android/
```
Debes ver siete líneas `✓` (los parches) y `Sync finished`.

## 3. Generar el APK

### Opción A · Doble clic (lo más rápido)
Ejecuta **`build-apk.bat`**. Al terminar deja `MetafisicaAdvance-debug.apk` en esta carpeta. La primera vez tarda varios minutos porque Gradle descarga sus dependencias.

### Opción B · Android Studio
1. `npm run open` (o en Android Studio: *Open* → carpeta `APK/android`).
2. Espera a que termine *Gradle Sync* (barra inferior).
3. Menú **Build → Build App Bundle(s) / APK(s) → Build APK(s)**.
4. Cuando aparezca el aviso, pulsa **locate**: el archivo está en `android/app/build/outputs/apk/debug/app-debug.apk`.

### Opción C · Terminal
```powershell
npm run apk:debug
```

## 4. Instalar en el teléfono

**Por cable (recomendado para probar)**
1. En el teléfono: *Ajustes → Información del teléfono →* toca 7 veces **Número de compilación** para activar las opciones de desarrollador.
2. *Ajustes → Sistema → Opciones de desarrollador →* activa **Depuración por USB**.
3. Conecta el cable, acepta el aviso en el teléfono y ejecuta:
   ```powershell
   adb install -r MetafisicaAdvance-debug.apk
   ```
   (o en Android Studio elige tu teléfono arriba y pulsa ▶ Run).

**Sin cable**: copia el `.apk` al teléfono (Drive, WhatsApp, USB), ábrelo y permite *Instalar apps desconocidas* para esa aplicación cuando te lo pida.

> `-r` reinstala conservando la partida. Si **desinstalas** la app, Android borra su almacenamiento y la partida se pierde.

---

## 5. APK firmado para distribuir (release)

El APK *debug* sirve para ti y tus amigos. Para publicar o repartir una versión estable, fírmalo:

1. Crea tu llave (una sola vez; **guárdala bien**: sin ella no podrás actualizar la app):
   ```powershell
   cd android
   keytool -genkeypair -v -keystore metafisica-release.jks -alias metafisica -keyalg RSA -keysize 2048 -validity 10000
   ```
2. Copia `android/keystore.properties.ejemplo` como `android/keystore.properties` y pon tus contraseñas.
3. Compila:
   ```powershell
   cd ..
   npm run apk:release
   ```
   Resultado: `android/app/build/outputs/apk/release/app-release.apk`.

También puedes hacerlo con *Build → Generate Signed App Bundle / APK* en Android Studio (elige **APK**). Para Google Play se sube un **AAB** (misma ruta, opción *Android App Bundle*).

Para cada versión nueva sube `versionCode` (entero) y `versionName` en `android/app/build.gradle`.

---

## 6. Personalizar

| Quiero… | Cambia… |
|---|---|
| Otro código secreto | `CODE` en `src/apk-extras.js` |
| Añadir o quitar filósofos | arreglo `GROUPS` en `src/apk-extras.js` (nombre, fechas, aporte, aspecto `L(peinado, pelo, {b, g, prop, f})`) |
| Velocidad del desfile | `V` (px/s) y `SP` (separación) en `farewell()` |
| La música de la despedida | pista `adios` en `scripts/sync-game.mjs` |
| Nombre o id de la app | `capacitor.config.json` y `android/app/src/main/res/values/strings.xml` |
| Fijar la orientación | `android:screenOrientation="sensorLandscape"` (o `portrait`) en la `<activity>` de `AndroidManifest.xml` |

Tras cualquier cambio en `src/` o en el juego: `npm run sync` y vuelve a compilar.

Probar sin teléfono: abre `www/index.html` en Chrome (F12 → modo dispositivo). El código secreto funciona con los botones en pantalla y con el teclado (flechas, Z = A, X = B).

---

## 7. Problemas frecuentes

| Síntoma | Solución |
|---|---|
| `JAVA_HOME is not set` / versión de Java incorrecta | Apunta `JAVA_HOME` al `jbr` de Android Studio (JDK 21) y abre una terminal nueva |
| `Unsupported class file major version 69` (o 66, 67, 68) | Gradle se ejecutó con Java 25 (69), 22, 23 o 24, y Gradle 8.14 solo admite hasta Java 21 para este proyecto. `build-apk.bat` ya busca un JDK 21 por su cuenta; si no lo encuentra, instala uno con `winget install EclipseAdoptium.Temurin.21.JDK`. En Android Studio: *Settings → Build, Execution, Deployment → Build Tools → Gradle → Gradle JDK* = JDK 21 |
| `SDK location not found` | Crea `android/local.properties` con `sdk.dir=C\:\\Users\\<tu usuario>\\AppData\\Local\\Android\\Sdk` (o abre una vez el proyecto en Android Studio, que lo crea solo) |
| `Parche «…»: se esperaba 1 coincidencia` | Cambió el `index.html` original en esa zona; ajusta el texto del parche en `scripts/sync-game.mjs` |
| `INSTALL_FAILED_UPDATE_INCOMPATIBLE` | Hay otra versión firmada con otra llave: desinstálala primero (se pierde la partida) |
| No suena | El sonido arranca al primer toque; revisa el volumen multimedia y el botón ♪ |
| Gradle se queda descargando | Es normal la primera vez (necesita internet). Las siguientes compilaciones tardan segundos |
| Pantalla blanca | `npm run sync` no se ejecutó: falta `android/app/src/main/assets/public/index.html` |
