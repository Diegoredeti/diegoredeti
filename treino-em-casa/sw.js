/*
 * Service Worker — deixa o "Treino em Casa" instalável e funcional offline.
 * Estratégia: cache-first para os arquivos do app (assets estáticos).
 */

const CACHE = "treino-em-casa-v1";
const ARQUIVOS = [
  ".",
  "index.html",
  "css/style.css",
  "css/animacoes.css",
  "js/dados.js",
  "js/animacoes.js",
  "js/anamnese.js",
  "js/app.js",
  "manifest.webmanifest",
  "icons/icon.svg",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/apple-touch-icon.png",
];

self.addEventListener("install", (evento) => {
  evento.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ARQUIVOS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (evento) => {
  evento.waitUntil(
    caches
      .keys()
      .then((chaves) =>
        Promise.all(chaves.filter((c) => c !== CACHE).map((c) => caches.delete(c)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (evento) => {
  if (evento.request.method !== "GET") return;
  evento.respondWith(
    caches.match(evento.request).then((resposta) => {
      if (resposta) return resposta;
      return fetch(evento.request)
        .then((rede) => {
          // Guarda no cache o que for buscado com sucesso (mesma origem).
          if (rede && rede.status === 200 && rede.type === "basic") {
            const copia = rede.clone();
            caches.open(CACHE).then((cache) => cache.put(evento.request, copia));
          }
          return rede;
        })
        .catch(() => caches.match("index.html"));
    })
  );
});
