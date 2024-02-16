import LoginForm from "@/components/Auth/LoginForm";
import { Container } from "@mui/material";

export default function Login() {
  return (
    <Container sx={{ width: '100%', height: '100vh', flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <LoginForm />
    </Container>
  );
}
