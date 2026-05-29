/**
 * SkipLink — keyboard users can jump straight to the main content.
 * Visually hidden until focused (see `.skip-link` in globals.css). Targets #main.
 */
export function SkipLink() {
  return (
    <a href="#main" className="skip-link">
      Skip to content
    </a>
  );
}

export default SkipLink;
