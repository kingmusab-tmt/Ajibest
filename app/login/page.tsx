import { Metadata } from "next";
import LoginForm from "../components/userscomponent/loginform";

export const metadata: Metadata = {
  title: "Ajibest Login Form",
  description: "A.A. Ajibest Login form",
};

const LoginPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <LoginForm />
    </div>
  );
};

export default LoginPage;
