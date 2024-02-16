"use client"
import { useAppDispatch } from "@/hooks/redux";
import { setAccessToken } from "@/redux/features/accessToken";
import { Container } from "@mui/material";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";

export default function Home() {
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (session) {
      dispatch(setAccessToken(session.user.accessToken))
    }
  }, [])
  return (
    <Container sx={{ width: '100%', height: '90vh', flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <iframe src="https://giphy.com/embed/e4y3fNQG9mDDnSyGik" width="480" height="160" frameBorder="0" allowFullScreen></iframe>
    </Container>
  );
}
