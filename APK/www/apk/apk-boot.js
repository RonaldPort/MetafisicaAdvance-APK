/* Metafísica Advance · capa Android (1/2): MEMORIA.
   Corre antes que el juego. El juego guarda su partida en localStorage; aquí cada escritura
   se copia también al almacenamiento nativo de Android (Capacitor Preferences, en SharedPreferences),
   que sobrevive aunque el sistema limpie los datos del WebView. Al arrancar, si localStorage está vacío
   y la copia nativa existe, se restaura y se recarga una sola vez. */
(function () {
  'use strict';
  var KEYS = ['metafisica-advance-v1', 'metafisica-advance-apk'];
  var Cap = window.Capacitor;
  var native = !!(Cap && Cap.isNativePlatform && Cap.isNativePlatform());
  var Pref = native && Cap.Plugins ? Cap.Plugins.Preferences : null;

  /* espejo: setItem / removeItem → Preferences */
  try {
    var proto = Storage.prototype, set0 = proto.setItem, rem0 = proto.removeItem;
    proto.setItem = function (k, v) {
      set0.call(this, k, v);
      if (Pref && this === window.localStorage && KEYS.indexOf(k) >= 0) Pref.set({ key: k, value: String(v) }).catch(function () {});
    };
    proto.removeItem = function (k) {
      rem0.call(this, k);
      if (Pref && this === window.localStorage && KEYS.indexOf(k) >= 0) Pref.remove({ key: k }).catch(function () {});
    };
  } catch (e) { /* sin almacenamiento */ }

  /* restauración: solo si falta en localStorage y existe la copia nativa */
  if (Pref) {
    var missing = KEYS.filter(function (k) { try { return !localStorage.getItem(k); } catch (e) { return false; } });
    if (missing.length) {
      Promise.all(missing.map(function (k) { return Pref.get({ key: k }).then(function (r) { return [k, r && r.value]; }); }))
        .then(function (rs) {
          var restored = 0;
          rs.forEach(function (r) { if (r[1]) { try { localStorage.setItem(r[0], r[1]); restored++; } catch (e) { /* nada */ } } });
          var once = false; try { once = sessionStorage.getItem('ma-restored') === '1'; } catch (e) { /* nada */ }
          if (restored && !once) {
            try { sessionStorage.setItem('ma-restored', '1'); } catch (e) { /* nada */ }
            location.reload();
          }
        }).catch(function () {});
    } else {
      /* primera vez con la capa nativa: sube la partida existente */
      KEYS.forEach(function (k) { try { var v = localStorage.getItem(k); if (v) Pref.set({ key: k, value: v }).catch(function () {}); } catch (e) { /* nada */ } });
    }
  }
})();
