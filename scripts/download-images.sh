#!/usr/bin/env bash
set -uo pipefail

cd "$(dirname "$0")/.."

mkdir -p public/images/services public/images/industries public/images/locations public/images/about

FAILURES=0

fetch() {
  path="$1"
  id="$2"
  term="$3"
  if [ -f "$path" ]; then
    echo "SKIP    $path"
    return 0
  fi
  if curl -fsSL --max-time 90 -o "$path" "https://images.unsplash.com/${id}?q=80&w=1600&auto=format&fit=crop"; then
    echo "OK      $path"
  else
    rm -f "$path"
    echo "FAILED  $path  ->  search unsplash.com for: ${term}"
    FAILURES=$((FAILURES + 1))
  fi
}

fetch public/images/services/it-procurement.jpg            photo-1553413077-190dd305871c  "warehouse inventory laptop"
fetch public/images/services/hardware-supply.jpg           photo-1591405351990-4726e331f141  "server hardware rack"
fetch public/images/services/infrastructure-solutions.jpg  photo-1544197150-b99a580bb7a8  "network cabling data center"
fetch public/images/services/managed-services.jpg          photo-1551288049-bebda4e38f71  "monitoring dashboard analytics"
fetch public/images/services/technology-advisory.jpg       photo-1522071820081-009f0129c71c  "business strategy meeting"
fetch public/images/services/deployment-implementation.jpg photo-1581092160562-40aa08e78837  "IT engineer installation"

fetch public/images/industries/government.jpg                 photo-1564013799919-ab600027ffc6  "government building africa"
fetch public/images/industries/banking-financial-services.jpg photo-1541354329998-f4d9a9f9297f  "bank branch nigeria"
fetch public/images/industries/enterprise.jpg                 photo-1497366216548-37526070297c  "enterprise office"
fetch public/images/industries/sme.jpg                        photo-1600880292089-90a7e086ee0c  "small business team nigeria"
fetch public/images/industries/healthcare.jpg                 photo-1519494026892-80bbd2d6fd0d  "hospital technology"
fetch public/images/industries/education.jpg                  photo-1523240795612-9a054b0db644  "university computer lab"
fetch public/images/industries/oil-gas-energy.jpg             photo-1518709268805-4e9042af9f23  "oil gas facility"
fetch public/images/industries/logistics-manufacturing.jpg    photo-1565891741441-64926e441838  "warehouse logistics"

fetch public/images/locations/abuja.jpg          photo-1554457606-ed16c39db884  "Abuja Nigeria city"
fetch public/images/locations/lagos.jpg          photo-1618828665011-0abd973f7bb8  "Lagos Nigeria skyline"
fetch public/images/locations/port-harcourt.jpg  photo-1704230093731-8dad84d386a9  "Port Harcourt Nigeria aerial"

fetch public/images/about/team.jpg               photo-1600880292203-757bb62b4baf  "Nigerian tech team office"

echo ""
if [ "$FAILURES" -eq 0 ]; then
  echo "All images downloaded. Add a CREDITS.json per folder mirroring public/images/hero/CREDITS.json."
else
  echo "$FAILURES file(s) FAILED. Open the search term shown, pick a free photo, and replace the ID in this script."
fi
