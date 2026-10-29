import React from "react";
import { DashboardScreen } from "@/modules/dashboard/screens/DashboardScreen";
import { useModals } from "@/components/layout";

export default function IndexRoute() {
  const { openTripModal, openProModal } = useModals();

  return (
    <DashboardScreen
      onOpenTripModal={openTripModal}
      onOpenProModal={openProModal}
    />
  );
}

