import ClientProvider from "@/providers/ClientProvider";
import React from "react";

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <React.Fragment>
      <ClientProvider>
        {children}
      </ClientProvider>
    </React.Fragment>
  );
}
