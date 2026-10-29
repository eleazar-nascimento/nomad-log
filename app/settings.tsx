import React from "react";
import { SettingsScreen } from "@/modules/settings/screens/SettingsScreen";
import { useModals } from "@/components/layout";

export default function SettingsRoute() {
  const { openProModal } = useModals();

  return <SettingsScreen onOpenProModal={openProModal} />;
}

