import { chromium } from "playwright";
const BASE="http://localhost:4310"; const OUT=process.argv[2];
const ROUTES=[["home","/"],["services","/services"],["service","/services/it-procurement"],["industries","/industries"],["industry","/industries/government"],["locations","/locations"],["location","/locations/abuja"],["about","/about"],["approach","/approach"],["ecosystem","/ecosystem"],["insights","/insights"],["article","/insights/complete-guide-to-it-procurement-in-nigeria"],["category","/insights/category/procurement"],["reports","/reports"],["report","/reports/state-of-enterprise-it-in-nigeria-2026"],["contact","/contact"],["notfound","/nope-404"]];
const VP=[["1440",1440,900],["768",768,1024],["390",390,844]];
const b=await chromium.launch();
for(const [vn,w,h] of VP){
  const c=await b.newContext({viewport:{width:w,height:h},deviceScaleFactor:1});
  for(const [name,route] of ROUTES){
    const p=await c.newPage();
    await p.goto(BASE+route,{waitUntil:"load",timeout:60000}).catch(()=>{});
    await p.evaluate(()=>document.fonts.ready);
    await p.waitForTimeout(500);
    await p.evaluate(()=>{[...document.querySelectorAll("button")].find(x=>x.textContent.trim()==="Decline")?.click()});
    // settle reveals
    await p.evaluate(()=>window.scrollTo(0,document.body.scrollHeight));
    await p.waitForTimeout(900);
    await p.evaluate(()=>window.scrollTo(0,0));
    await p.waitForTimeout(900);
    await p.screenshot({path:`${OUT}/${vn}-${name}-fold.png`});
    await p.screenshot({path:`${OUT}/${vn}-${name}-full.png`,fullPage:true});
    await p.close();
  }
  await c.close();
}
await b.close(); console.log("shots done");
