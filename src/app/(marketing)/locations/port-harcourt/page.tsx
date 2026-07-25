import type { Metadata } from "next";
import { getLocation } from "@/data/locations";
import { LocationPage } from "../LocationPage";

const location = getLocation("port-harcourt")!;

export const metadata: Metadata = {
  title: location.metaTitle,
  description: location.metaDescription,
  alternates: { canonical: "/locations/port-harcourt" },
};

export default function PortHarcourtPage() {
  return <LocationPage slug="port-harcourt" />;
}
