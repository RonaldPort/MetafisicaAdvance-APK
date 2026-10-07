# Metafísica Advance · versión Android

Adaptación para Android (APK) de **[Metafísica Advance](https://github.com/ontoterrorist/metafisica-advance)**, el juego de rol de [@ontoterrorist](https://github.com/ontoterrorist) para aprender metafísica. El juego original no se modifica: esta carpeta lo copia y le aplica parches al compilar. Ver [CREDITOS.md](../CREDITOS.md).

## Novedades de la versión Android

| Función | Detalle |
|---|---|
| Memoria | La partida se guarda sola y además se copia al almacenamiento nativo de Android; se restaura si se borran los datos del WebView |
| Despedida | Desfile de 82 lógicos y filósofos analíticos del siglo XX en siete escuelas, con música propia y foto de grupo final |
| Consola táctil | Pantalla y botones de la consola intactos y jugables, en vertical y en apaisado |
| Botón atrás | Funciona como B; en la portada, dos veces para salir |

### 🔑 Código secreto

En cualquier momento, con los botones de la consola (o el teclado):

**← → ← → A B A B ←**  (máx. 3 segundos entre pulsaciones)

Lanza la **despedida**, que también aparece al vencer a Carnap, al final del juego. Durante la despedida: **A** acelera, **B** salta a la foto final, **START** sale.

## Descargar

El APK listo para instalar está en la sección **Releases** de este repositorio. Funciona desde Android 7.0 (incluido Android 13). Al instalarlo, permite «Instalar apps desconocidas» y, si Play Protect avisa, elige «Instalar de todas formas».

## Compilar

Requisitos: Node.js 22+, Android Studio (SDK con API 36) y JDK 21. En Windows basta con ejecutar `build-apk.bat`. Guía completa paso a paso, firma *release* y solución de problemas: [GUIA_INSTALACION.md](GUIA_INSTALACION.md).

> **Firma y contraseñas:** `android/keystore.properties` y los archivos `*.jks` contienen las contraseñas de la firma y **nunca** se suben al repositorio (están en `.gitignore`). Guarda tu llave y sus contraseñas fuera del repositorio (por ejemplo, en un gestor de contraseñas): sin ellas no podrás publicar actualizaciones de la app. Usa `android/keystore.properties.ejemplo` como plantilla.
