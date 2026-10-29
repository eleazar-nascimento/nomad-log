import React from "react";
import { ItineraryScreen } from "@/modules/itinerary/screens/ItineraryScreen";
import { useModals } from "@/components/layout";

export default function ItineraryRoute() {
  const { openTripModal, openProModal } = useModals();

  return (
    <ItineraryScreen
      onOpenTripModal={openTripModal}
      onOpenProModal={openProModal}
    />
  );
}

