# archive/

Content moved out of the build, kept for reference. Nothing here is read by the
app: the content loader resolves collections under `content/` only
(`src/lib/content/source.ts` → `CONTENT_ROOT = <cwd>/content`), and the content
engine scans `content/insights` (`content-engine/config.mjs` → `insightsDir`).
Files here are therefore invisible to the site, the sitemap and the cover
scripts, without being deleted.

## insights/ — seven drafts, archived 2026-08-22

Archived when the content engine's market scope narrowed to Nigeria only. All
seven were `draft: true` and had never been published, so no public URL was lost.

Each depends on a non-Nigerian regulator, and each carries regulatory claims we
could not trace to an identifiable source document — the reason the scope
narrowed. See `docs/BLOCKERS.md` and the instrument policy in
`content-engine/config.mjs`.

| Slug | Market | Why archived |
|---|---|---|
| `how-to-structure-an-it-procurement-process-that-survives-a-public-procurement-au` | Ghana | Cites Ghana's Public Procurement Act 2003 (Act 663) / Amendment Act 2016 (Act 914); bodies not in config |
| `a-migration-runbook-for-replacing-legacy-banking-endpoints-without-downtime` | Ghana | Zero citable instruments; claims rest on untitled Bank of Ghana and Cyber Security Authority directives |
| `preparing-your-data-processing-records-for-a-popia-compliance-review` | South Africa | POPIA — out of scope. Best-sourced of the six (cites sections 11, 17, 18, 19, 72) |
| `setting-realistic-it-slas-and-kpis-before-you-sign-a-managed-services-contract` | Kenya | Kenya DPA 2019; untitled CBK guidance and ICT Authority expectations |
| `how-to-manage-it-procurement-and-connectivity-across-an-afcfta-multi-country-exp` | Pan-African | Multi-jurisdiction by construction |
| `negotiating-hardware-warranty-and-rma-terms-that-hold-up-across-african-borders` | Pan-African | Cross-border customs framing; no single market |
| `planning-a-phased-migration-to-hybrid-cloud-when-connectivity-is-unreliable` | Kenya | Out of scope on market alone — it makes no regulatory claims. **Cover travelled with it** (see below) |

### Cover images

Six of the seven had no cover image and no `CREDITS.json` row, so nothing else
moved with them.

`planning-a-phased-migration-to-hybrid-cloud-when-connectivity-is-unreliable`
did. Its cover travelled with the article to `archive/images/insights/`, and its
attribution row moved with it into `archive/images/insights/CREDITS.json` — same
six-key shape as the live ledger, so the credit stays attached to the file
rather than being stranded in a ledger for an image that is no longer there.
After the move both ledgers are exact: live 45 entries / 45 JPEGs, archive
1 / 1, neither with an orphan in either direction.

### Restoring one

    git mv archive/insights/<slug>.mdx content/insights/

If it has a cover, move the image back to `public/images/insights/` and its row
back into that folder's `CREDITS.json`. Then re-add the article's market, and
that market's bodies **and their instruments**, to `content-engine/config.mjs` —
a market with no instruments cannot carry an obligation claim, which is the
point of the policy.

Their briefs remain in `content-engine/topics/backlog.json` with
`status: "written"`; the backlog was not edited.
