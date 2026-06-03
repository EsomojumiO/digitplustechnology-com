/**
 * jsonld.tsx, Tiny server component that emits a JSON-LD <script> tag.
 *
 * Usage:
 *   import { JsonLd } from "@/lib/seo/jsonld";
 *   <JsonLd data={organizationSchema()} />
 *
 * The `data` is always trusted (built from our own config), but we still escape
 * the `<` character so a stray "</script>" in any string field can never break
 * out of the script context. We do NOT use dangerouslySetInnerHTML with raw
 * JSON.stringify output without this guard.
 */

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue | undefined };

export interface JsonLdProps {
  /** A schema.org object (or array of objects) produced by schema.ts builders. */
  data: JsonValue | JsonValue[];
}

/**
 * Serialize to JSON and neutralize the only sequence that can terminate a
 * <script> element: the "<" character. Replacing it with its unicode escape
 * keeps the JSON valid while making `</script>`, `<!--`, etc. inert.
 */
function serialize(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      // Trusted data; "<" escaped above to prevent any script-context break-out.
      dangerouslySetInnerHTML={{ __html: serialize(data) }}
    />
  );
}

export default JsonLd;
