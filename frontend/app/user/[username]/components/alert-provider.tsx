'use client'
import { Alert, Slide } from "@mui/material";
import { createContext, ReactNode, useContext, useState } from "react";

type AlertSeverity = "success" | "error";

interface AlertContextType {
  showAlert: (severity: AlertSeverity, message: string) => void;
}

const AlertContext = createContext<AlertContextType | null>(null);


export const useAlert = () => {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error("useAlert must be used within AlertProvider");
  return ctx;
};

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [severity, setSeverity] = useState<AlertSeverity>("success");
  const [message, setMessage] = useState("");

  const showAlert = (severity: AlertSeverity, message: string) => {
      setSeverity(severity);
      setMessage(message);
      setMounted(true);
      setOpen(true);

      setTimeout(() => {
          setOpen(false);
      }, 4000);

      setTimeout(() => {
          setMounted(false);
      }, 4600);
    
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {/* Alert Banner */}
      {mounted && (
        <Slide direction="down" in={open}>
          <Alert
            severity={severity}
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 1400,
              borderRadius: 0,
            }}
          >
            {message}
          </Alert>
        </Slide>
      )}

      {children}
    </AlertContext.Provider>
  );
};