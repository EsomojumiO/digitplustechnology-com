# Page Imagery Shortlist (Polish 6)

One accent image per page (two max on About). **Treatment updated for the
Apple-light rebuild (2026-07-17):** photos now run **bright and full-colour and
carry the visual weight** — there is no `.cover-dark` scrim, no
`saturate(0.85)`, no `brightness(0.92)` and no mono micro-label. All of those
existed to seat a light photo into a near-black canvas and were deleted in
Phase 3; on white they invert into a haze over the picture. What remains is the
container: clipping, a large radius, and a light `#d2d2d7` hairline. Any label
sits on a soft **white** gradient at the image base, dark-on-light.

**Pick bright, full-colour, well-lit frames.** A moody underexposed shot that
looked good under a scrim will read as a dirty smudge on a white page.

**Components are already wired with a graceful fallback** — until a file exists
the slot shows a labelled placeholder, so the site never breaks.

## About the photo IDs — now VERIFIED (2026-07-17)
The original shortlist could not reach the network, so its IDs were unverified
guesses. **Every ID has now been checked against images.unsplash.com and returns
HTTP 200.** Findings:

- All 6 services + 8 industries + about IDs were **live** and are unchanged.
- **All 6 location IDs were fabricated and returned hard 404s.** The prefixes
  (`photo-1618828665011-…`, `photo-1618828665347-…`) were real; the suffixes
  (`-0f0f0f0f0f0f`, `-d0e1f0f0f0f0`) were invented. All three cities have been
  re-sourced from each city's own Unsplash search and verified.
- `about/team.jpg` was the **same ID** as `technology-advisory` — swapped to the
  shortlist's candidate B so the two pages don't show an identical photo.

⚠️ **Verified-live is not verified-accurate.** The Abuja and Lagos frames come
from those cities' Unsplash searches, and the Port Harcourt frame is an aerial
of a river city from a Rivers State search — but I can't confirm from here that
each photo actually depicts the city it's filed under, and captioning a photo of
the wrong city on a real business's location page is a factual claim, not a
design detail. **Eyeball the three location images before pushing.**

Run `scripts/download-images.sh`. `curl -f` fails loudly on a bad ID — any
`FAILED` line prints its search term; pick a free photo (prefer Nigerian
photographers for people shots), swap the ID, re-run. Then add a line to the
matching `CREDITS.json`.

Expected file paths (what the components look for):
- Services → `public/images/services/<service-slug>.jpg`
- Industries → `public/images/industries/<industry-slug>.jpg`
- Locations → `public/images/locations/<city>.jpg`
- About → `public/images/about/team.jpg`

## Shortlist

### Services (`public/images/services/`)
| Slug | Subject | Candidate A | Candidate B | Search term |
|---|---|---|---|---|
| it-procurement | Warehouse/stockroom laptops, inventory | photo-1553413077-190dd305871c | photo-1580982327559-c1202864eb05 | "warehouse inventory laptop" |
| hardware-supply | Servers / boxed hardware | photo-1591405351990-4726e331f141 | photo-1518770660439-4636190af475 | "server hardware rack" |
| infrastructure-solutions | Structured cabling / server room | photo-1544197150-b99a580bb7a8 | photo-1558494949-ef010cbdcc31 | "network cabling data center" |
| managed-services | Ops/monitoring dashboards | photo-1551288049-bebda4e38f71 | photo-1460925895917-afdab827c52f | "monitoring dashboard analytics" |
| technology-advisory | Strategy session / whiteboard | photo-1522071820081-009f0129c71c | photo-1600880292203-757bb62b4baf | "business strategy meeting" |
| deployment-implementation | Engineer installing hardware | photo-1581092160562-40aa08e78837 | photo-1521737604893-d14cc237f11d | "IT engineer installation" |

### Industries (`public/images/industries/`)
| Slug | Subject | Candidate A | Candidate B | Search term |
|---|---|---|---|---|
| government | Government/institutional building | photo-1564013799919-ab600027ffc6 | photo-1486406146926-c627a92ad1ab | "government building africa" |
| banking-financial-services | Bank branch / finance | photo-1541354329998-f4d9a9f9297f | photo-1601597111158-2fceff292cdc | "bank branch nigeria" |
| enterprise | Corporate office floor | photo-1497366216548-37526070297c | photo-1524758631624-e2822e304c36 | "enterprise office" |
| sme | Small business team | photo-1600880292089-90a7e086ee0c | photo-1556761175-b413da4baf72 | "small business team nigeria" |
| healthcare | Hospital IT / clinic | photo-1519494026892-80bbd2d6fd0d | photo-1538108149393-fbbd81895907 | "hospital technology" |
| education | Campus computer lab | photo-1523240795612-9a054b0db644 | photo-1562774053-701939374585 | "university computer lab" |
| oil-gas-energy | Energy plant / field site | photo-1518709268805-4e9042af9f23 | photo-1611273426858-450d8e3c9fce | "oil gas facility" |
| logistics-manufacturing | Warehouse / plant floor | photo-1553413077-190dd305871c | photo-1565891741441-64926e441838 | "warehouse logistics" |

### Locations (`public/images/locations/`)
| City | Subject | Candidate A | Candidate B | Search term |
|---|---|---|---|---|
| City | Subject | Verified ID (HTTP 200) | Source search | Search term if you want another |
|---|---|---|---|---|
| abuja | White arc / architectural landmark | photo-1554457606-ed16c39db884 | unsplash.com/s/photos/abuja | "Abuja Nigeria city" |
| lagos | Aerial city buildings, daytime | photo-1618828665011-0abd973f7bb8 | unsplash.com/s/photos/lagos-nigeria | "Lagos Nigeria skyline" |
| port-harcourt | Aerial city with river running through | photo-1704230093731-8dad84d386a9 | unsplash.com/s/photos/rivers-state-nigeria | "Port Harcourt Nigeria aerial" |

> The six original location IDs were fabricated (hard 404). These three are verified live —
> but **confirm each one actually depicts the right city before pushing**. A Lagos photo on
> the Abuja page is a factual error on a real business's location page.

### About (`public/images/about/`, up to 2)
| File | Subject | Candidate A | Candidate B | Search term |
|---|---|---|---|---|
| team.jpg | Nigerian team / office wide | photo-1600880292203-757bb62b4baf | — | "Nigerian tech team office" |

> Candidate A (`photo-1522071820081-009f0129c71c`) was dropped: it's the same photo as
> `services/technology-advisory.jpg`. Both slots would have shown one identical image.

## Download script

`scripts/download-images.sh` — every ID in it is verified live. It creates the
folders, skips files that already exist, and prints `OK` / `SKIP` / `FAILED` per
file with a replacement search term on any failure.

```bash
bash scripts/download-images.sh
```

After downloading, add a `CREDITS.json` in each folder (photographer + Unsplash
ID per file), mirroring `public/images/hero/CREDITS.json`.
