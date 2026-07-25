import type { Metadata } from "next";
import { getLocation } from "@/data/locations";
import { LocationPage } from "../LocationPage";

const location = getLocation("lagos")!;

export const metadata: Metadata = {
  title: location.metaTitle,
  description: location.metaDescription,
  alternates: { canonical: "/locations/lagos" },
};

export default function LagosPage() {
  return <LocationPage slug="lagos" />;
}
