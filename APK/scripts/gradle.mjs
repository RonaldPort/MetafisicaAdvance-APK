// Ejecuta Gradle dentro de android/ con el envoltorio correcto según el sistema (gradlew.bat en Windows).
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const androidDir = path.join(root, 'android');
const win = process.platform === 'win32';
const cmd = win ? 'gradlew.bat' : './gradlew';
const r = spawnSync(cmd, process.argv.slice(2), { cwd: androidDir, stdio: 'inherit', shell: win });
if (r.status === 0) {
  const task = process.argv[2] || '';
  const sub = task.includes('Release') ? 'release' : 'debug';
  console.log('\nAPK listo en: ' + path.join(androidDir, 'app', 'build', 'outputs', 'apk', sub));
}
process.exit(r.status ?? 1);
