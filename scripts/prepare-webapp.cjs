const fs = require("fs");
const path = require("path");

const root = process.cwd();
const distDir = path.join(root, "dist");
const indexPath = path.join(distDir, "index.html");
const iconsDir = path.join(distDir, "icons");

const sourceIcons = {
  icon192: path.join(root, "assets", "pwa-icon-192.png"),
  icon512: path.join(root, "assets", "pwa-icon-512.png"),
  appleTouch: path.join(root, "assets", "apple-touch-icon.png"),
};

const destinationIcons = {
  icon192: path.join(iconsDir, "icon-192.png"),
  icon512: path.join(iconsDir, "icon-512.png"),
  appleTouch: path.join(iconsDir, "apple-touch-icon.png"),
};

const manifestPath = path.join(distDir, "manifest.webmanifest");
const serviceWorkerPath = path.join(distDir, "service-worker.js");
const buildId = Date.now().toString();

function ensureFileExists(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Bestand niet gevonden: ${filePath}`);
  }
}

function writeManifest() {
  const manifest = {
    name: "Focuskracht ADHD Quiz",
    short_name: "Focuskracht",
    description: "Welke ADHD type ben jij? Doe de quiz en krijg je persoonlijke plan.",
    lang: "nl",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#050507",
    theme_color: "#050507",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };

  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
}

function writeServiceWorker() {
  const serviceWorker = `const CACHE_NAME = "focuskracht-quiz-${buildId}";
const SHELL_ASSETS = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/apple-touch-icon.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  const isNavigation = request.mode === "navigate";
  const isStaticAsset =
    url.pathname.startsWith("/icons/") ||
    url.pathname.startsWith("/_expo/static/") ||
    url.pathname === "/manifest.webmanifest";

  if (isNavigation) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put("/index.html", responseClone));
          }
          return response;
        })
        .catch(() => caches.match("/index.html"))
    );
    return;
  }

  if (!isStaticAsset) {
    event.respondWith(fetch(request).catch(() => caches.match(request)));
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      const networkRequest = fetch(request)
        .then((response) => {
          if (!response || response.status !== 200 || response.type === "opaque") return response;

          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          return response;
        });

      if (cached) return cached;
      return networkRequest.catch(() => caches.match("/index.html"));
    })
  );
});
`;

  fs.writeFileSync(serviceWorkerPath, serviceWorker, "utf8");
}

function patchIndexHtml() {
  ensureFileExists(indexPath);

  let html = fs.readFileSync(indexPath, "utf8");

  html = html.replace('<html lang="en">', '<html lang="nl">');
  html = html.replace(
    /<meta name="viewport" content="[^"]*"\s*\/>/,
    '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=resizes-content" />',
  );

  html = html.replace(/\s*<meta name="theme-color"[^>]*>\s*/g, "\n");
  html = html.replace(/\s*<meta name="mobile-web-app-capable"[^>]*>\s*/g, "\n");
  html = html.replace(/\s*<meta name="apple-mobile-web-app-capable"[^>]*>\s*/g, "\n");
  html = html.replace(/\s*<meta name="apple-mobile-web-app-status-bar-style"[^>]*>\s*/g, "\n");
  html = html.replace(/\s*<meta name="apple-mobile-web-app-title"[^>]*>\s*/g, "\n");
  html = html.replace(/\s*<meta name="application-name"[^>]*>\s*/g, "\n");
  html = html.replace(/\s*<link rel="manifest"[^>]*>\s*/g, "\n");
  html = html.replace(/\s*<link rel="apple-touch-icon"[^>]*>\s*/g, "\n");
  html = html.replace(/\s*<link rel="icon" type="image\/png" sizes="192x192"[^>]*>\s*/g, "\n");
  html = html.replace(/\s*<style id="focuskracht-webapp">[\s\S]*?<\/style>\s*/g, "\n");
  html = html.replace(
    /\s*<script>\s*if \("serviceWorker" in navigator\)[\s\S]*?service-worker\.js[\s\S]*?<\/script>\s*/g,
    "\n",
  );

  const headInjection = `
    <meta name="theme-color" content="#050507" />
    <meta name="application-name" content="Focuskracht" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="apple-mobile-web-app-title" content="Focuskracht" />
    <link rel="manifest" href="/manifest.webmanifest" />
    <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
    <link rel="icon" type="image/png" sizes="192x192" href="/icons/icon-192.png" />
    <style id="focuskracht-webapp">
      :root { color-scheme: light; }
      html, body { background: #050507; overscroll-behavior-y: none; }
      body { -webkit-tap-highlight-color: transparent; touch-action: manipulation; }
    </style>`;

  html = html.replace("</head>", `${headInjection}\n  </head>`);

  const swRegistration = `
    <script>
      (function () {
        if (!("serviceWorker" in navigator)) return;
        window.addEventListener("load", async function () {
          try {
            const resetKey = "focuskracht-sw-reset-v3";
            const hasReset = window.localStorage && localStorage.getItem(resetKey) === "done";

            if (!hasReset) {
              const registrations = await navigator.serviceWorker.getRegistrations();
              await Promise.all(registrations.map((registration) => registration.unregister()));

              if ("caches" in window) {
                const keys = await caches.keys();
                await Promise.all(keys.map((key) => caches.delete(key)));
              }

              if (window.localStorage) {
                localStorage.setItem(resetKey, "done");
              }

              window.location.reload();
              return;
            }

            navigator.serviceWorker
              .register("/service-worker.js?v=${buildId}", { scope: "/" })
              .catch(function () {});
          } catch (error) {}
        });
      })();
    </script>`;

  html = html.replace("</body>", `${swRegistration}\n</body>`);

  fs.writeFileSync(indexPath, html, "utf8");
}

function main() {
  if (!fs.existsSync(distDir)) {
    throw new Error(`Dist map niet gevonden: ${distDir}`);
  }

  Object.values(sourceIcons).forEach(ensureFileExists);

  fs.mkdirSync(iconsDir, { recursive: true });
  fs.copyFileSync(sourceIcons.icon192, destinationIcons.icon192);
  fs.copyFileSync(sourceIcons.icon512, destinationIcons.icon512);
  fs.copyFileSync(sourceIcons.appleTouch, destinationIcons.appleTouch);

  writeManifest();
  writeServiceWorker();
  patchIndexHtml();

  console.log("Webapp setup voltooid: manifest, service worker en icons zijn toegevoegd.");
}

main();
