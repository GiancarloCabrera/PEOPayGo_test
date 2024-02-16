"use client";
import AccessDenied from "@/components/Auth/AccessDenied";
import Loader from "@/components/Loader/Loader";
import { useSession } from "next-auth/react";
import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

function AccessProvider({ children }: Props) {
  const { status } = useSession();
  if (status === "loading") {
    return <Loader />
  }

  if (status === "unauthenticated") {
    return <AccessDenied />
  }

  return <React.Fragment>{children}</React.Fragment>;
}

export default AccessProvider;