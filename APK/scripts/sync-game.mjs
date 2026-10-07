// Copia el juego (../index.html y ../icons) a www/ aplicando los parches de la versión Android.
// Ejecútalo cada vez que cambie el index.html original:  npm run sync-game
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const APK = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const GAME = path.resolve(APK, '..');
const WWW = path.join(APK, 'www');

let html = fs.readFileSync(path.join(GAME, 'index.html'), 'utf8');

/* Cada parche debe encontrar su texto exactamente una vez; si el juego cambió y no lo encuentra, se detiene. */
function patch(name, from, to) {
  const n = html.split(from).length - 1;
  if (n !== 1) { console.error(`✗ Parche «${name}»: se esperaba 1 coincidencia y hay ${n}.`); process.exit(1); }
  html = html.replace(from, () => to);
  console.log(`✓ ${name}`);
}

/* 1. Sin zoom con dos dedos dentro de la app */
patch('viewport',
  '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">',
  '<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">');

/* 2. Memoria nativa: apk-boot.js corre ANTES del juego (espejo de la partida en el almacenamiento de Android) */
patch('boot + estilos',
  '</head>',
  '<link rel="stylesheet" href="apk/apk.css">\n<script src="apk/apk-boot.js"></script>\n</head>');

/* 3. Canción de despedida (se compila con el resto de pistas del motor de sonido) */
patch('canción «adios»',
  'const TRACKS={',
  `const TRACKS={
 // despedida (do mayor, lenta): suena con el desfile de lógicos y filósofos
 adios:{bpm:84,bass:'walk',drums:'light',arp:true,
  ch:[[48,'maj'],[43,'maj'],[45,'min'],[41,'maj'],[48,'maj'],[43,'maj'],[41,'maj'],[43,'maj']],
  bars:[
   'e5 - - - g5 - c6 - - - d6 - e6 - - -',
   'd6 - - - b5 - g5 - - - a5 - b5 - - .',
   'c6 - - - a5 - e5 - - - a5 - c6 - e6 -',
   'f6 - - - e6 - c6 - - - a5 - c6 - - .',
   'g6 - - - e6 - c6 - - - e6 - g6 - c7 -',
   'b6 - - - a6 - g6 - - - d6 - g6 - - .',
   'a6 - - - g6 - f6 - - - c6 - a5 - c6 -',
   'd6 - - - - - b5 - - - g5 - - - . .']},`);

/* 4. Cada pulsación (botones táctiles o teclado) pasa primero por el detector del código secreto */
patch('gancho de botones',
  'function down(b) {',
  'function down(b) { if (window.MA_HOOK && window.MA_HOOK(b)) return;');

/* 5. Al vencer a Carnap (final del juego) se lanza la despedida */
patch('despedida al final',
  'S.flags.fin = 1; await lines(ENDING); }',
  'S.flags.fin = 1; await lines(ENDING); save(); if (window.MA_FAREWELL) await window.MA_FAREWELL({ fin: true }); save(); }');

/* 6. Utilidades para la capa Android: guardar a demanda, canción actual y modo */
patch('API para la capa Android',
  'save: () => S,',
  "save: () => S, persist: () => save(), song: () => (mode === 'title' ? 'title' : M ? M.def.song : null), mode: () => mode,");

/* 7. Sin service worker (la app ya lleva todo dentro) y con la capa de extras al final */
patch('service worker → extras',
  "<script>\nif ('serviceWorker' in navigator) window.addEventListener('load', () => { navigator.serviceWorker.register('sw.js').catch(() => {}); });\n</script>",
  '<script src="apk/apk-extras.js"></script>');

fs.rmSync(WWW, { recursive: true, force: true });
fs.mkdirSync(path.join(WWW, 'apk'), { recursive: true });
fs.writeFileSync(path.join(WWW, 'index.html'), html);
fs.cpSync(path.join(GAME, 'icons'), path.join(WWW, 'icons'), { recursive: true });
if (fs.existsSync(path.join(GAME, 'manifest.webmanifest'))) fs.copyFileSync(path.join(GAME, 'manifest.webmanifest'), path.join(WWW, 'manifest.webmanifest'));
for (const f of fs.readdirSync(path.join(APK, 'src'))) fs.copyFileSync(path.join(APK, 'src', f), path.join(WWW, 'apk', f));
console.log('\nwww/ listo (' + Math.round(html.length / 1024) + ' KB). Ahora: npx cap sync android');
