import { chromium } from "playwright";
const b = await chromium.launch();
const p = await (await b.newContext({viewport:{width:1440,height:1200}})).newPage();
await p.goto("http://localhost:4310/contact", { waitUntil:"load" });
await p.waitForTimeout(600);
await p.evaluate(()=>{[...document.querySelectorAll("button")].find(x=>x.textContent.trim()==="Decline")?.click()});
const form = p.locator("form").filter({ has: p.locator('[name="fullName"]') }).first();
await form.locator('[name="fullName"]').fill("Adaeze Okafor");
await form.locator('[name="email"]').fill("a.okafor@example.ng");
await form.locator('[name="company"]').fill("Zenith Ops");
if (await form.locator('[name="phone"]').count()) await form.locator('[name="phone"]').fill("+2348030000000");
await form.locator('[name="message"]').fill("We need to refresh 120 workstations across three branches in Q4. Can you scope the procurement and deployment?");
await form.locator('button[type="submit"]').first().click();
await p.waitForTimeout(2800);
const ok = await p.evaluate(()=>({
  alerts:[...document.querySelectorAll('[role="alert"],[aria-live]')].map(e=>e.innerText.trim()).filter(Boolean).slice(0,4),
  invalid: document.querySelectorAll('[aria-invalid="true"]').length,
}));
console.log("SUCCESS STATE:", JSON.stringify(ok,null,1));
await b.close();
