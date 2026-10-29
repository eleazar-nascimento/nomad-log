import React from "react";
import { ExpensesScreen } from "@/modules/expenses/screens/ExpensesScreen";
import { useModals } from "@/components/layout";

export default function ExpensesRoute() {
  const { openTripModal, openProModal } = useModals();

  return (
    <ExpensesScreen
      onOpenTripModal={openTripModal}
      onOpenProModal={openProModal}
    />
  );
}

