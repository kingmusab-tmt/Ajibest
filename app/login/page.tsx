import { Metadata } from "next";
import LoginForm from "../components/userscomponent/loginform";

export const metadata: Metadata = {
  title: "Ajibest Login Form",
  description: "A.A. Ajibest Login form",
};

const LoginPage = () => {
  return <LoginForm />;
};

export default LoginPage;
