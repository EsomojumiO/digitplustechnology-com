import { chromium } from "playwright";
const b = await chromium.launch();
const c = await b.newContext({ viewport:{width:1440,height:1200} });
const p = await c.newPage();
await p.goto("http://localhost:4310/contact", { waitUntil:"load" });
await p.waitForTimeout(600);
// Decline cookies so nothing overlays
await p.evaluate(()=>{[...document.querySelectorAll("button")].find(x=>x.textContent.trim()==="Decline")?.click()});
await p.waitForTimeout(300);

// 1. ERROR STATE: submit empty
await p.locator('form button[type="submit"]').first().click();
await p.waitForTimeout(1200);
const err = await p.evaluate(()=>({
  alerts: [...document.querySelectorAll('[role="alert"],[aria-live]')].map(e=>e.innerText.trim()).filter(Boolean).slice(0,6),
  invalid: document.querySelectorAll('[aria-invalid="true"]').length,
}));
console.log("ERROR STATE:", JSON.stringify(err,null,1));

// 2. SUCCESS STATE
const fill = async (name, val) => { const l = p.locator(`[name="${name}"]`); if (await l.count()) await l.fill(val); };
await fill("fullName","Adaeze Okafor"); await fill("email","a.okafor@example.ng");
await fill("company","Zenith Ops"); await fill("phone","+2348030000000");
await fill("message","We need to refresh 120 workstations across three branches in Q4. Can you scope the procurement and deployment?");
await p.locator('form button[type="submit"]').first().click();
await p.waitForTimeout(2500);
const ok = await p.evaluate(()=>({
  alerts: [...document.querySelectorAll('[role="alert"],[aria-live]')].map(e=>e.innerText.trim()).filter(Boolean).slice(0,4),
  invalid: document.querySelectorAll('[aria-invalid="true"]').length,
}));
console.log("SUCCESS STATE:", JSON.stringify(ok,null,1));
await b.close();
