/**
 * fetch-covers.test.mjs — the coverAlt contract.
 *
 *   node --test content-engine/fetch-covers.test.mjs
 *
 * These cover the pure helpers only: no network, no filesystem. `main()` in
 * fetch-covers.mjs is guarded by an `invokedDirectly` check precisely so the
 * helpers can be imported here without the script trying to run.
 *
 * What is being pinned down is a correctness claim, not a formatting one:
 * coverAlt must come from the photo's OWN metadata, must go EMPTY rather than
 * stale when the photo says nothing, and must not disturb any other line of a
 * hand-authored MDX file.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { pickAlt, cleanAlt, setCoverAlt } from "./fetch-covers.mjs";

/* ------------------------------- pickAlt --------------------------------- */

test("pickAlt prefers alt_description over description", () => {
  // alt_description is Unsplash's accessibility field — a description of what is
  // visible. description is the photographer's caption and is often a title that
  // describes nothing ("The Files"), so it must not win.
  assert.equal(
    pickAlt({ alt_description: "a rack of servers", description: "The Files" }),
    "A rack of servers",
  );
});

test("pickAlt falls back to description when alt_description is absent", () => {
  assert.equal(
    pickAlt({ alt_description: null, description: "empty hospital hallway" }),
    "Empty hospital hallway",
  );
});

test("pickAlt returns empty when the photo describes itself in neither field", () => {
  // The whole point: an empty alt, not a plausible-sounding invented one.
  assert.equal(pickAlt({ alt_description: null, description: null }), "");
  assert.equal(pickAlt({}), "");
  assert.equal(pickAlt(undefined), "");
});

test("pickAlt treats a whitespace-only description as no description", () => {
  assert.equal(pickAlt({ alt_description: "   \n\t " }), "");
});

/* ------------------------------- cleanAlt -------------------------------- */

test("cleanAlt collapses whitespace and capitalises", () => {
  assert.equal(cleanAlt("  a   server\n\track  "), "A server rack");
});

test("cleanAlt truncates on a word boundary with an ellipsis", () => {
  const alt = cleanAlt("word ".repeat(60).trim());
  assert.ok(alt.length <= 161, `expected <=161 chars, got ${alt.length}`);
  assert.ok(alt.endsWith("…"), "expected a trailing ellipsis");
  assert.ok(!alt.includes("  "), "expected no double spaces");
});

test("cleanAlt leaves a short string alone apart from the capital", () => {
  assert.equal(cleanAlt("a short one"), "A short one");
});

/* ------------------------------ setCoverAlt ------------------------------ */

const FM = (...lines) => `---\n${lines.join("\n")}\n---\nBody text.\n`;

test("setCoverAlt replaces an existing coverAlt in place", () => {
  assert.equal(
    setCoverAlt(FM("title: x", 'coverAlt: "old and stale"'), "new"),
    FM("title: x", 'coverAlt: "new"'),
  );
});

test("setCoverAlt inserts directly after cover: when the key is absent", () => {
  assert.equal(
    setCoverAlt(FM("title: x", "cover: /images/insights/x.jpg"), "new"),
    FM("title: x", "cover: /images/insights/x.jpg", 'coverAlt: "new"'),
  );
});

test("setCoverAlt appends when there is neither coverAlt nor cover", () => {
  assert.equal(setCoverAlt(FM("title: x"), "new"), FM("title: x", 'coverAlt: "new"'));
});

test("setCoverAlt writes an EMPTY value over a stale one", () => {
  // The load-bearing case. A blank alt is a visible defect; a stale one that
  // reads plausibly is not, so "no usable description" must still overwrite.
  assert.equal(
    setCoverAlt(FM("title: x", 'coverAlt: "a scene that was never photographed"'), ""),
    FM("title: x", 'coverAlt: ""'),
  );
});

test("setCoverAlt escapes quotes and backslashes as a YAML double-quoted scalar", () => {
  const out = setCoverAlt(FM("title: x"), 'a "quoted" \\ thing');
  assert.match(out, /^coverAlt: "a \\"quoted\\" \\\\ thing"$/m);
});

test("setCoverAlt ignores a body line that merely mentions coverAlt", () => {
  const src = '---\ntitle: x\ncoverAlt: "a"\n---\ncoverAlt: this is prose, not frontmatter.\n';
  assert.equal(
    setCoverAlt(src, "b"),
    '---\ntitle: x\ncoverAlt: "b"\n---\ncoverAlt: this is prose, not frontmatter.\n',
  );
});

test("setCoverAlt is idempotent", () => {
  const once = setCoverAlt(FM("title: x", "cover: /a.jpg"), "new");
  assert.equal(setCoverAlt(once, "new"), once);
});

test("setCoverAlt leaves a file with no frontmatter untouched", () => {
  assert.equal(setCoverAlt("just a body\n", "x"), "just a body\n");
});

test("setCoverAlt disturbs no other frontmatter line", () => {
  // Why this exists: gray-matter's stringify would round-trip the whole block
  // through js-yaml and reflow quote styles, the block-style tags list and key
  // order, turning a one-field update into a whole-file diff.
  const src = [
    "---",
    "title: A Hand-Authored Title",
    "tags:",
    "  - procurement",
    "  - nigeria",
    "cover: /images/insights/x.jpg",
    'coverAlt: "old"',
    "draft: true",
    "---",
    "",
    "Body.",
    "",
  ].join("\n");
  const out = setCoverAlt(src, "new");
  const a = src.split("\n");
  const b = out.split("\n");
  assert.equal(a.length, b.length, "line count must not change");
  const changed = a.map((l, i) => (l === b[i] ? null : i)).filter((i) => i !== null);
  assert.deepEqual(changed, [6], "exactly one line (coverAlt) may change");
});
