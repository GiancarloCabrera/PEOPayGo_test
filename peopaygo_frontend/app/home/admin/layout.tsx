import AdminProvider from "@/providers/AdminProvider";
import React from "react";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <React.Fragment>
      <AdminProvider>
        {children}
      </AdminProvider>
    </React.Fragment>
  );
}
