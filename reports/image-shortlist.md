# Page Imagery Shortlist (Polish 6)

One accent image per page (two max on About), same treatment as the home hero:
local file, `.cover-dark` scrim, `saturate(0.85)`, hairline border, mono
micro-label. **Components are already wired with a graceful fallback** — until a
file exists the slot shows a hairline placeholder, so the site never breaks.

## ⚠️ About the photo IDs
I can't reach the network from here to verify Unsplash IDs, so each row gives **2
candidate IDs + a search term**. Run the script below; `curl -f` fails loudly on
a bad ID — for any `FAILED` line, open the search term on unsplash.com, pick a
free photo (prefer Nigerian photographers for people shots), and swap the ID.
Then add a line to the matching `CREDITS.json`.

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
| abuja | Abuja cityscape/landmark | photo-1618828665347-d0e1f0f0f0f0 | photo-1568564264093-1f0f0f0f0f0f | "Abuja Nigeria city" |
| lagos | Lagos skyline | photo-1618828665011-0f0f0f0f0f0f | photo-1592388748465-0f0f0f0f0f0f | "Lagos Nigeria skyline" |
| port-harcourt | Port Harcourt / South-South | photo-1590650213165-0f0f0f0f0f0f | photo-1591825729269-0f0f0f0f0f0f | "Port Harcourt Nigeria" |

> Location IDs above are LOW-confidence placeholders — the city search terms are the reliable path; swap all three.

### About (`public/images/about/`, up to 2)
| File | Subject | Candidate A | Candidate B | Search term |
|---|---|---|---|---|
| team.jpg | Nigerian team / office wide | photo-1522071820081-009f0129c71c | photo-1600880292203-757bb62b4baf | "Nigerian tech team office" |

## Download script (run once, in your terminal)
```bash
cd /Users/esofesola/Developer/digitplustechnology.com
mkdir -p public/images/services public/images/industries public/images/locations public/images/about
g() { curl -fL -o "$1" "https://images.unsplash.com/$2?q=80&w=1600&auto=format&fit=crop" && echo "OK  $1" || echo "FAILED  $1  ($2) — swap via search term"; }

# Services
g public/images/services/it-procurement.jpg          photo-1553413077-190dd305871c
g public/images/services/hardware-supply.jpg         photo-1591405351990-4726e331f141
g public/images/services/infrastructure-solutions.jpg photo-1544197150-b99a580bb7a8
g public/images/services/managed-services.jpg        photo-1551288049-bebda4e38f71
g public/images/services/technology-advisory.jpg     photo-1522071820081-009f0129c71c
g public/images/services/deployment-implementation.jpg photo-1581092160562-40aa08e78837

# Industries
g public/images/industries/government.jpg                 photo-1564013799919-ab600027ffc6
g public/images/industries/banking-financial-services.jpg photo-1541354329998-f4d9a9f9297f
g public/images/industries/enterprise.jpg                 photo-1497366216548-37526070297c
g public/images/industries/sme.jpg                        photo-1600880292089-90a7e086ee0c
g public/images/industries/healthcare.jpg                 photo-1519494026892-80bbd2d6fd0d
g public/images/industries/education.jpg                  photo-1523240795612-9a054b0db644
g public/images/industries/oil-gas-energy.jpg             photo-1518709268805-4e9042af9f23
g public/images/industries/logistics-manufacturing.jpg    photo-1565891741441-64926e441838

# Locations (verify all three via search term)
g public/images/locations/abuja.jpg          photo-1618828665347-d0e1f0f0f0f0
g public/images/locations/lagos.jpg          photo-1618828665011-0f0f0f0f0f0f
g public/images/locations/port-harcourt.jpg  photo-1590650213165-0f0f0f0f0f0f

# About
g public/images/about/team.jpg               photo-1522071820081-009f0129c71c

echo "Review any FAILED lines above and swap IDs via the search terms."
```

After downloading, add a `CREDITS.json` in each folder (photographer + Unsplash
ID per file), mirroring `public/images/hero/CREDITS.json`.
