import React from "react";
import { PackingScreen } from "@/modules/packing/screens/PackingScreen";
import { useModals } from "@/components/layout";

export default function PackingRoute() {
  const { openTripModal, openProModal } = useModals();

  return (
    <PackingScreen
      onOpenTripModal={openTripModal}
      onOpenProModal={openProModal}
    />
  );
}

