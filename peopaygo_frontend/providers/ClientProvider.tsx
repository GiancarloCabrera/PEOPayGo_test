"use client";
import { ROLES } from "@/types/roles";
import { useSession } from "next-auth/react";
import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
}
function ClientProvider({ children }: Props) {
  const { data: session } = useSession();
  const role = session?.user.user.role;

  if (role !== ROLES.CLIENT) {
    return <p>Access Denied</p>
  }

  return <React.Fragment>{children}</React.Fragment>;
}

export default ClientProvider;