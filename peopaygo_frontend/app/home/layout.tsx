"use client"
import Navigation from "@/components/Navigation/Navigation";
import AccessProvider from "@/providers/AccessProvider";
import React from "react";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <React.Fragment>
      <AccessProvider>
        <Navigation>
          {children}
        </Navigation>
      </AccessProvider>
    </React.Fragment>
  );
}
