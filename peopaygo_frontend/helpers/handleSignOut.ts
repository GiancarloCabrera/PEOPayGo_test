"use client"

import { signOut } from "next-auth/react";

const handleSignOut = () => {
  signOut({ callbackUrl: '/' });
}

export default handleSignOut
