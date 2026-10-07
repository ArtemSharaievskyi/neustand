import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { randomUUID } from "node:crypto";

const selectedFiles = [
  {
    name: "aufmaß.png",
    mimeType: "image/png",
    buffer: Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/pJkAAAAASUVORK5CYII=",
      "base64",
    ),
  },
  {
    name: "grundriss.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.from("%PDF-1.4\n1 0 obj\n<< /Type /Catalog >>\nendobj\n%%EOF\n"),
  },
];

async function fillValidContactForm(page: import("@playwright/test").Page) {
  const form = page.locator(".contact-form");
  await form.getByLabel("Vorname").fill("Codex QA");
  await form.getByLabel("Nachname").fill("Test");
  await form.getByLabel("E-Mail-Adresse").fill("codex.qa@example.com");
  await form.getByLabel("Ihre Nachricht").fill("Kontrollierter Browser-Test ohne E-Mail-Versand.");
  return form;
}

async function postContactToLocalResendMock(
  request: import("@playwright/test").APIRequestContext,
  firstName: string,
  testIp: string,
) {
  const formData = new FormData();
  formData.set("firstName", firstName);
  formData.set("lastName", "TEST_ONLY");
  formData.set("email", "codex.qa@example.com");
  formData.set("message", "Controlled local API test. No real email is sent.");
  formData.set("requestId", randomUUID().replaceAll("-", "").slice(0, 24));
  formData.append(
    "files",
    new File([Buffer.from("%PDF-1.4\n1 0 obj\n<< /Type /Catalog >>\nendobj\n%%EOF\n")], "test.pdf", {
      type: "application/pdf",
    }),
  );

  return request.post("/api/contact", {
    multipart: formData,
    headers: { "x-forwarded-for": testIp },
  });
}

test("homepage renders the NEUSTAND landing page", async ({ page }) => {
  const response = await page.goto("/", { waitUntil: "domcontentloaded" });

  expect(response?.status()).toBe(200);
  await expect(page).toHaveTitle(/NEUSTAND/);
  await expect(
    page.getByRole("heading", { level: 1, name: "Raum für einen neuen Anfang." }),
  ).toBeVisible();
});

test("homepage has no serious accessibility violations @a11y", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

test("each FAQ answer opens and closes with the desktop pointer or mobile touch", async ({ page }, testInfo) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const faq = page.locator("#faq");
  const items = faq.locator('[data-slot="accordion-item"]');
  const triggerCount = await items.count();
  expect(triggerCount).toBeGreaterThan(0);

  for (let index = 0; index < triggerCount; index += 1) {
    const item = items.nth(index);
    const trigger = item.getByRole("button");
    const panel = item.locator('[data-slot="accordion-content"]');

    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(panel).toBeHidden();
    if (testInfo.project.name.startsWith("mobile")) {
      await trigger.tap();
    } else {
      await trigger.click();
    }
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(panel).toBeVisible();

    if (testInfo.project.name.startsWith("mobile")) {
      await trigger.tap();
    } else {
      await trigger.click();
    }
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(panel).toBeHidden();
  }
});

test("each FAQ answer opens with Enter and closes with Space", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const triggers = page.locator("#faq").getByRole("button");
  const triggerCount = await triggers.count();
  expect(triggerCount).toBeGreaterThan(0);

  for (let index = 0; index < triggerCount; index += 1) {
    const trigger = triggers.nth(index);
    await trigger.focus();
    await expect(trigger).toBeFocused();
    await trigger.press("Enter");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await trigger.press("Space");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  }
});

test("contact form uses German labels and supports multiple files, removal, and reselection", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const form = page.locator(".contact-form");
  await expect(form.getByLabel("Vorname")).toBeVisible();
  await expect(form.getByLabel("Nachname")).toBeVisible();
  await expect(form.getByLabel("E-Mail-Adresse")).toBeVisible();
  await expect(form.getByLabel("Ihre Nachricht")).toBeVisible();
  await expect(form.getByRole("button", { name: "Dateien auswählen" })).toBeVisible();
  await expect(form.getByRole("status")).toHaveText("Keine Dateien ausgewählt");

  const fileInput = form.locator("#files");
  await expect(fileInput).toHaveAttribute("multiple", "");
  await fileInput.setInputFiles(selectedFiles);

  const fileList = form.getByRole("list", { name: "Ausgewählte Dateien" });
  await expect(form.getByRole("status")).toHaveText("2 Dateien ausgewählt");
  await expect(fileList.getByText("aufmaß.png")).toBeVisible();
  await expect(fileList.getByText("grundriss.pdf")).toBeVisible();

  await form.getByRole("button", { name: "Datei aufmaß.png entfernen" }).click();
  await expect(form.getByRole("status")).toHaveText("1 Datei ausgewählt");
  await expect(fileList.getByText("aufmaß.png")).toHaveCount(0);
  await expect(fileList.getByText("grundriss.pdf")).toBeVisible();

  await fileInput.setInputFiles([selectedFiles[0]]);
  await expect(fileList.getByText("aufmaß.png")).toBeVisible();
  await expect(fileList.getByText("grundriss.pdf")).toBeVisible();
  await expect(form.getByRole("status")).toHaveText("2 Dateien ausgewählt");
});

test("contact form exposes server error feedback without sending an email", async ({ page }) => {
  await page.route("**/api/contact", (route) =>
    route.fulfill({
      status: 502,
      contentType: "application/json",
      body: JSON.stringify({ ok: false, message: "Testfehler beim Versand." }),
    }),
  );
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const form = await fillValidContactForm(page);
  await form.getByRole("button", { name: /Anfrage senden/i }).click();

  await expect(form.locator(".form-status")).toHaveText("Testfehler beim Versand.");
  await expect(form.getByLabel("Vorname")).toHaveValue("Codex QA");
});

test("contact form displays success and resets after an accepted response", async ({ page }) => {
  await page.route("**/api/contact", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true }),
    }),
  );
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const form = await fillValidContactForm(page);
  await form.getByRole("button", { name: /Anfrage senden/i }).click();

  await expect(form.locator(".form-status")).toHaveText("Danke. Ihre Anfrage wurde übermittelt.");
  await expect(form.getByLabel("Vorname")).toHaveValue("");
  await expect(form.getByLabel("Nachname")).toHaveValue("");
});

test("contact API rejects invalid fields before contacting Resend", async ({ request }) => {
  const response = await request.post("/api/contact", {
    multipart: {
      firstName: "",
      lastName: "",
      email: "invalid",
      message: "",
    },
  });

  expect(response.status()).toBe(400);
  const body = await response.json();
  expect(body.ok).toBe(false);
});

test("contact API accepts a small attachment through the controlled local Resend mock", async ({ request }) => {
  const response = await postContactToLocalResendMock(request, "QA_RESEND_ACCEPT", "192.0.2.10");

  expect(response.status()).toBe(200);
  await expect(response.json()).resolves.toEqual({ ok: true });
});

test("contact API returns a generic error when the controlled Resend mock rejects a request", async ({ request }) => {
  const response = await postContactToLocalResendMock(request, "QA_RESEND_REJECT", "192.0.2.11");
  const body = await response.json();

  expect(response.status()).toBe(502);
  expect(body.ok).toBe(false);
  expect(body.message).toMatch(/Versand ist momentan nicht möglich/i);
  expect(JSON.stringify(body)).not.toContain("Local Resend rejection simulation");
});

test("contact API maps a controlled Resend network failure to a generic error", async ({ request }) => {
  const response = await postContactToLocalResendMock(
    request,
    "QA_RESEND_NETWORK_ERROR",
    "192.0.2.12",
  );
  const body = await response.json();

  expect(response.status()).toBe(502);
  expect(body.ok).toBe(false);
  expect(body.message).toMatch(/Versand ist momentan nicht möglich/i);
  expect(JSON.stringify(body)).not.toContain("Local Resend network failure simulation");
});
