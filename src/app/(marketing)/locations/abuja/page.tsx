import type { Metadata } from "next";
import { getLocation } from "@/data/locations";
import { LocationPage } from "../LocationPage";

const location = getLocation("abuja")!;

export const metadata: Metadata = {
  title: location.metaTitle,
  description: location.metaDescription,
  alternates: { canonical: "/locations/abuja" },
};

export default function AbujaPage() {
  return <LocationPage slug="abuja" />;
}
