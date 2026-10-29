import React, { createContext, useContext, useState } from "react";

interface ModalContextValue {
  tripModalOpen: boolean;
  proModalOpen: boolean;
  openTripModal: () => void;
  closeTripModal: () => void;
  openProModal: () => void;
  closeProModal: () => void;
}

const ModalContext = createContext<ModalContextValue | null>(null);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tripModalOpen, setTripModalOpen] = useState(false);
  const [proModalOpen, setProModalOpen] = useState(false);

  return (
    <ModalContext.Provider
      value={{
        tripModalOpen,
        proModalOpen,
        openTripModal: () => setTripModalOpen(true),
        closeTripModal: () => setTripModalOpen(false),
        openProModal: () => setProModalOpen(true),
        closeProModal: () => setProModalOpen(false),
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModals = () => {
  const ctx = useContext(ModalContext);
  if (!ctx) {
    return {
      tripModalOpen: false,
      proModalOpen: false,
      openTripModal: () => {},
      closeTripModal: () => {},
      openProModal: () => {},
      closeProModal: () => {},
    };
  }
  return ctx;
};

