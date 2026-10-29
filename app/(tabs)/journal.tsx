import React from "react";
import { JournalScreen } from "@/modules/journal/screens/JournalScreen";
import { useModals } from "@/components/layout";

export default function JournalRoute() {
  const { openTripModal, openProModal } = useModals();

  return (
    <JournalScreen
      onOpenTripModal={openTripModal}
      onOpenProModal={openProModal}
    />
  );
}

