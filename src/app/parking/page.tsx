import type { Metadata } from "next";
import ParkingFinder from "@/components/ParkingFinder";

export const metadata: Metadata = {
  title: "Live Parking Finder | Maa Shoolini Mela Solan 2026",
  description:
    "Check real-time parking availability across Solan for the Maa Shoolini Fair 2026. View live spot counts, capacity bars, and shuttle information for all major parking zones including Thodo Ground, Old Bus Stand, and the Solan Bypass.",
  keywords: [
    "Solan parking",
    "Maa Shoolini Mela parking",
    "Shoolini fair parking 2026",
    "Solan traffic",
    "Thodo Ground parking",
    "bypass parking Solan",
  ],
};

export default function ParkingPage() {
  return <ParkingFinder />;
}
