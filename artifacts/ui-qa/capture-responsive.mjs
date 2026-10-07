import { writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import http from "node:http";

const baseUrl = "http://localhost:3000";
const outputDirectory = dirname(fileURLToPath(import.meta.url));

function requestJson(path, method = "GET") {
  return new Promise((resolve, reject) => {
    const request = http.request({ host: "127.0.0.1", port: 19452, path, method }, (response) => {
      let body = "";
      response.setEncoding("utf8");
      response.on("data", (chunk) => { body += chunk; });
      response.on("end", () => {
        try { resolve(JSON.parse(body)); }
        catch (error) { reject(error); }
      });
    });
    request.on("error", reject);
    request.end();
  });
}

const targets = await requestJson("/json/list");
const page = targets.find((target) => target.type === "page" && target.url === "about:blank")
  ?? targets.find((target) => target.type === "page");

if (!page?.webSocketDebuggerUrl) {
  throw new Error("No page target was exposed by the local Chrome session.");
}

const socket = new WebSocket(page.webSocketDebuggerUrl);
const pending = new Map();
const eventWaiters = new Map();
let commandId = 0;

await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});

socket.addEventListener("message", (event) => {
  const message = JSON.parse(String(event.data));

  if (message.id && pending.has(message.id)) {
    const { resolve, reject } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) reject(new Error(message.error.message));
    else resolve(message.result);
    return;
  }

  if (message.method && eventWaiters.has(message.method)) {
    const waiters = eventWaiters.get(message.method);
    eventWaiters.delete(message.method);
    waiters.forEach((resolve) => resolve(message.params));
  }
});

function send(method, params = {}) {
  const id = ++commandId;
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
}

function waitForEvent(name, timeoutMs = 15000) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error(`Timed out waiting for ${name}`)), timeoutMs);
    const waiters = eventWaiters.get(name) ?? [];
    waiters.push((value) => {
      clearTimeout(timeout);
      resolve(value);
    });
    eventWaiters.set(name, waiters);
  });
}

async function evaluate(expression) {
  const response = await send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (response.exceptionDetails) {
    throw new Error(response.exceptionDetails.text ?? "Browser evaluation failed.");
  }
  return response.result?.value;
}

async function setViewport(width, height) {
  await send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: width <= 600,
    screenOrientation: { type: "portraitPrimary", angle: 0 },
  });
}

async function openPage(url) {
  const loaded = waitForEvent("Page.loadEventFired");
  await send("Page.navigate", { url });
  await loaded;
  await new Promise((resolve) => setTimeout(resolve, 700));
}

async function saveScreenshot(name) {
  const screenshot = await send("Page.captureScreenshot", {
    format: "png",
    fromSurface: true,
    captureBeyondViewport: false,
  });
  await writeFile(join(outputDirectory, name), Buffer.from(screenshot.data, "base64"));
}

await send("Page.enable");
await send("Runtime.enable");
await send("Page.setLifecycleEventsEnabled", { enabled: true });

const viewportCases = [
  { width: 1440, height: 900, name: "hero-desktop-1440.png" },
  { width: 768, height: 900, name: "hero-tablet-768.png" },
  { width: 390, height: 844, name: "hero-mobile-390.png" },
];
const metrics = [];

for (const viewport of viewportCases) {
  await setViewport(viewport.width, viewport.height);
  await openPage(`${baseUrl}/?qa=${viewport.width}`);
  await evaluate("window.scrollTo(0, 0)");
  await saveScreenshot(viewport.name);
  metrics.push(await evaluate(`(() => {
    const hero = document.querySelector('.home-hero');
    const heading = document.querySelector('#hero-title');
    const lede = document.querySelector('.home-hero-lede');
    const buttons = [...document.querySelectorAll('.home-hero-actions a')];
    const headerLinks = [...document.querySelectorAll('.primary-nav a')];
    const lineHeight = Number.parseFloat(getComputedStyle(heading).lineHeight) || heading.getBoundingClientRect().height;
    return {
      viewportWidth: innerWidth,
      viewportHeight: innerHeight,
      documentWidth: document.documentElement.scrollWidth,
      horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
      headingLines: Math.round(heading.getBoundingClientRect().height / lineHeight),
      ledeWidth: Math.round(lede.getBoundingClientRect().width),
      ledeOverflow: lede.scrollWidth > lede.clientWidth,
      buttonsVisible: buttons.every((button) => button.getBoundingClientRect().bottom <= innerHeight),
      buttonBoundsFit: buttons.every((button) => button.getBoundingClientRect().right <= innerWidth),
      emailVisible: document.querySelector('.home-hero-email').getBoundingClientRect().bottom <= innerHeight,
      headerLinkHeights: headerLinks.map((link) => Math.round(link.getBoundingClientRect().height)),
      heroHeight: Math.round(hero.getBoundingClientRect().height),
    };
  })()`));
}

for (const viewport of [
  { width: 1440, height: 900, name: "services-desktop-1440.png" },
  { width: 390, height: 844, name: "services-mobile-390.png" },
]) {
  await setViewport(viewport.width, viewport.height);
  await openPage(`${baseUrl}/?qa=services-${viewport.width}`);
  const layout = await evaluate(`(() => {
    const section = document.querySelector('#leistungen');
    return {
      height: Math.ceil(section.getBoundingClientRect().height),
      headerHeight: Math.ceil(document.querySelector('.site-header').getBoundingClientRect().height),
      cardCount: section.querySelectorAll('.service-card-modern').length,
    };
  })()`);
  await setViewport(viewport.width, layout.height + layout.headerHeight + 8);
  await evaluate(`(() => {
    document.documentElement.style.scrollBehavior = 'auto';
    const section = document.querySelector('#leistungen');
    const headerHeight = document.querySelector('.site-header').getBoundingClientRect().height;
    const top = section.getBoundingClientRect().top + window.scrollY;
    window.scrollTo(0, top - headerHeight);
  })()`);
  await saveScreenshot(viewport.name);
  const sectionMetrics = await evaluate(`(() => {
    const section = document.querySelector('#leistungen');
    return {
      viewportWidth: innerWidth,
      documentWidth: document.documentElement.scrollWidth,
      horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
      sectionTop: Math.round(section.getBoundingClientRect().top),
      visibleCards: section.querySelectorAll('.service-card-modern').length,
    };
  })()`);
  metrics.push({
    section: viewport.name,
    width: viewport.width,
    sectionHeight: layout.height,
    cardCount: layout.cardCount,
    ...sectionMetrics,
  });
}

await setViewport(390, 844);
await openPage(`${baseUrl}/?qa=preserved-controls`);
const preservedControls = await evaluate(`(async () => {
  const trigger = document.querySelector('#faq button');
  const fileButton = document.querySelector('.file-picker-button');
  const fileInput = document.querySelector('#files[type="file"]');
  const before = trigger?.getAttribute('aria-expanded');
  trigger?.click();
  await new Promise((resolve) => setTimeout(resolve, 160));
  const opened = trigger?.getAttribute('aria-expanded');
  trigger?.click();
  await new Promise((resolve) => setTimeout(resolve, 160));
  const closed = trigger?.getAttribute('aria-expanded');
  return {
    accordionItems: document.querySelectorAll('#faq [data-slot="accordion-item"]').length,
    accordionOpensAndCloses: before === 'false' && opened === 'true' && closed === 'false',
    fileInputPresent: Boolean(fileInput),
    fileButtonLabel: fileButton?.textContent.trim() ?? null,
  };
})()`);
metrics.push({ preservedControls });

await writeFile(join(outputDirectory, "responsive-metrics.json"), `${JSON.stringify(metrics, null, 2)}\n`);
await send("Browser.close");
socket.close();
console.log(JSON.stringify(metrics, null, 2));
