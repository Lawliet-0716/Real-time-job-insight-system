import AuthForm from "../../components/auth/AuthForm";

export const metadata = { title: "Create account | SignalDesk" };

export default function RegisterPage() {
  return <AuthForm mode="register" />;
}
