import { AlertProvider } from "./components/alert-provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AlertProvider>{children}</AlertProvider>
  );
}