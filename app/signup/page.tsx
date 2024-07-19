import React from "react";
import SignUpForm from "../components/userscomponent/signupform";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registration Form",
  description: "A.A. Ajibest Registration form",
};

const Signuppage = () => {
  return (
    <div>
      <SignUpForm />
    </div>
  );
};

export default Signuppage;
