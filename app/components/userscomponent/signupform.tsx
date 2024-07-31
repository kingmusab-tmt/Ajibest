"use client";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import LoadingSpinner from "../generalcomponents/loadingSpinner";
import { useRouter } from "next/navigation";
import MessageModal from "../generalcomponents/messageModal";
import Link from "next/link";

interface StepProps {
  step: number;
  setStep: (step: number) => void;
  formData: FormData;
  setFormData: (data: Partial<FormData>) => void;
}

interface FormData {
  name: string;
  username: string;
  email: string;
  confirmEmail: string;
  bvnOrNin: string;
  phoneNumber: string;
  country: string;
  state: string;
  lga: string;
  password: string;
  confirmPassword: string;
  address: string;
}

const useErrorHandling = () => {
  const [error, setError] = useState("");

  const setErrorWithTimeout = (message: string) => {
    setError(message);
    setTimeout(() => {
      setError("");
    }, 5000);
  };

  return { error, setErrorWithTimeout };
};

const StepOne: React.FC<StepProps> = ({
  step,
  setStep,
  formData,
  setFormData,
}) => {
  const { error, setErrorWithTimeout } = useErrorHandling();

  useEffect(() => {
    const checkIfExists = async (field: string, value: string) => {
      const response = await fetch(
        `/api/users/checkexituser?${field}=${value}`,
        {
          headers: {
            "Cache-Control": "no-cache, no-store",
          },
        }
      );

      const { success } = await response.json();
      console.log(success);
      if (success) {
        setErrorWithTimeout(` ${field} already exists`);
      }
    };

    if (formData.username) {
      checkIfExists("username", formData.username);
    }

    if (formData.email) {
      checkIfExists("email", formData.email);
    }
  }, [formData.email, formData.username, setErrorWithTimeout]);
  const handleNext = () => {
    let valid = true;

    if (!formData.name) {
      setErrorWithTimeout("Full name is required");
      valid = false;
    }

    if (!formData.username) {
      setErrorWithTimeout("Username is required");
      valid = false;
    }

    if (!formData.email) {
      setErrorWithTimeout("Email is required");
      valid = false;
    } else {
      const emailRegex =
        /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|hotmail\.com)$/;
      if (!emailRegex.test(formData.email)) {
        setErrorWithTimeout(
          "Email must be a valid Gmail, Yahoo, or Hotmail address"
        );
        valid = false;
      }
    }

    if (!formData.confirmEmail) {
      setErrorWithTimeout("Confirm email is required");
      valid = false;
    } else if (formData.email !== formData.confirmEmail) {
      setErrorWithTimeout("Emails do not match");
      valid = false;
    }

    if (valid) {
      setStep(2);
    }
  };

  return (
    <div
      className={`flex flex-col space-y-4 ${step === 1 ? "block" : "hidden"}`}
    >
      <input
        type="text"
        placeholder="Full Name"
        value={formData.name}
        onChange={(e) => setFormData({ name: e.target.value })}
        className="input"
      />
      <input
        type="text"
        placeholder="Username"
        value={formData.username}
        onChange={(e) => setFormData({ username: e.target.value })}
        className="input"
      />
      <input
        type="email"
        placeholder="Enter your email address"
        value={formData.email}
        onChange={(e) => setFormData({ email: e.target.value })}
        className="input"
      />
      <input
        type="email"
        placeholder="Confirm Email"
        value={formData.confirmEmail}
        onChange={(e) => setFormData({ confirmEmail: e.target.value })}
        className="input"
      />
      {error && <p className="text-red-500">{error}</p>}
      <button onClick={handleNext} className="button bg-blue-600">
        Next
      </button>
      <div className="flex justify-center w-full items-center gap-3 py-3">
        <div className="border-b border-gray-800 py-2 w-full px-6" />
        <div className="mt-3">or</div>
        <div className="border-b border-gray-800 py-2 w-full px-6" />
      </div>
      <button className="gsi-material-button" onClick={() => signIn("google")}>
        <div className="gsi-material-button-state"></div>
        <div className="gsi-material-button-content-wrapper">
          <div className="gsi-material-button-icon">
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              style={{ display: "block" }}
            >
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
              ></path>
              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
              ></path>
              <path
                fill="#FBBC05"
                d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
              ></path>
              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
              ></path>
              <path fill="none" d="M0 0h48v48H0z"></path>
            </svg>
          </div>
          <span className="gsi-material-button-contents">
            Sign up with Google
          </span>
        </div>
      </button>
      <div>
        Already have an account?{" "}
        <Link className="link" href="/login">
          Login
        </Link>
      </div>
    </div>
  );
};

const StepTwo: React.FC<StepProps> = ({
  step,
  setStep,
  formData,
  setFormData,
}) => {
  const { error, setErrorWithTimeout } = useErrorHandling();

  const handleVerify = () => {
    if (!formData.bvnOrNin) {
      setErrorWithTimeout("BVN or NIN is required");
      return;
    } else if (formData.bvnOrNin.length !== 11) {
      setErrorWithTimeout("BVN or NIN must be 11 digits");
      return;
    }

    setStep(3);
  };
  useEffect(() => {
    const checkIfExists = async (field: string, value: string) => {
      const response = await fetch(
        `/api/users/checkexituser?${field}=${value}`,
        {
          headers: {
            "Cache-Control": "no-cache, no-store",
          },
        }
      );
      const { success } = await response.json();
      console.log(success);
      if (success) {
        setErrorWithTimeout(` ${field} already exists`);
      }
    };

    if (formData.bvnOrNin) {
      checkIfExists("bvnOrNin", formData.bvnOrNin);
    }
  }, [formData.bvnOrNin, setErrorWithTimeout]);

  return (
    <div
      className={`flex flex-col space-y-4 ${step === 2 ? "block" : "hidden"}`}
    >
      <input
        type="text"
        placeholder="BVN or NIN"
        value={formData.bvnOrNin}
        onChange={(e) => setFormData({ bvnOrNin: e.target.value })}
        className="input"
      />
      {error && <p className="text-red-500">{error}</p>}
      <div className="flex justify-between gap-5">
        <button onClick={() => setStep(1)} className="button">
          Back
        </button>
        <button onClick={handleVerify} className="button">
          Verify
        </button>
      </div>
    </div>
  );
};

const StepThree: React.FC<
  StepProps & {
    setIsLoading: (isLoading: boolean) => void;
    handleSuccess: (title: string, message: string) => void;
    handleError: (title: string, message: string) => void;
  }
> = ({
  step,
  setStep,
  formData,
  setFormData,
  setIsLoading,
  handleSuccess,
  handleError,
}) => {
  const { error, setErrorWithTimeout } = useErrorHandling();
  const router = useRouter();

  useEffect(() => {
    const checkIfExists = async (field: string, value: string) => {
      const response = await fetch(
        `/api/users/checkexituser?${field}=${value}`,
        {
          headers: {
            "Cache-Control": "no-cache, no-store",
          },
        }
      );

      const { success } = await response.json();
      console.log(success);
      if (success) {
        setErrorWithTimeout(` ${field} already exists`);
      }
    };

    if (formData.phoneNumber) {
      checkIfExists("bvnOrNin", formData.phoneNumber);
    }
  }, [formData.phoneNumber, setErrorWithTimeout]);

  const handleSubmit = async () => {
    let valid = true;

    if (!formData.phoneNumber) {
      setErrorWithTimeout("Phone number is required");
      valid = false;
    }

    if (!formData.country) {
      setErrorWithTimeout("Country is required");
      valid = false;
    }

    if (!formData.state) {
      setErrorWithTimeout("State is required");
      valid = false;
    }

    if (!formData.lga) {
      setErrorWithTimeout("LGA is required");
      valid = false;
    }

    if (!formData.password) {
      setErrorWithTimeout("Password is required");
      valid = false;
    } else {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
      if (!passwordRegex.test(formData.password)) {
        setErrorWithTimeout(
          "Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character"
        );
        valid = false;
      }
    }

    if (!formData.confirmPassword) {
      setErrorWithTimeout("Confirm password is required");
      valid = false;
    } else if (formData.password !== formData.confirmPassword) {
      setErrorWithTimeout("Passwords do not match");
      valid = false;
    }

    if (valid) {
      setIsLoading(true);
      try {
        const response = await fetch("/api/users/createNewUser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            username: formData.username,
            email: formData.email,
            phoneNumber: formData.phoneNumber,
            password: formData.password,
            bvnOrNin: formData.bvnOrNin,
            country: formData.country,
            state: formData.state,
            lga: formData.lga,
            address: formData.address,
          }),
        });

        if (response.ok) {
          handleSuccess(
            "Registration Successful",
            "Your registration was successful! Please Check your Email for confirmation"
          );
          router.push("/login");
        } else {
          const errorData = await response.json();
          handleError(
            "Registration Failed",
            "Submission failed: " + errorData.message
          );
        }
      } catch (error) {
        handleError("Registration Failed", "Submission failed");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div
      className={`flex flex-col space-y-4 ${step === 3 ? "block" : "hidden"}`}
    >
      <input
        type="text"
        placeholder="Phone Number"
        value={formData.phoneNumber}
        onChange={(e) => setFormData({ phoneNumber: e.target.value })}
        className="input"
      />
      <input
        type="text"
        placeholder="Your country"
        value={formData.country}
        onChange={(e) => setFormData({ country: e.target.value })}
        className="input"
      />
      <input
        type="text"
        placeholder="Address"
        value={formData.address}
        onChange={(e) => setFormData({ address: e.target.value })}
        className="input"
      />
      <input
        type="text"
        placeholder="State"
        value={formData.state}
        onChange={(e) => setFormData({ state: e.target.value })}
        className="input"
      />
      <input
        type="text"
        placeholder="LGA"
        value={formData.lga}
        onChange={(e) => setFormData({ lga: e.target.value })}
        className="input"
      />
      <input
        type="password"
        placeholder="New password"
        value={formData.password}
        onChange={(e) => setFormData({ password: e.target.value })}
        className="input"
      />
      {error && <p className="text-red-500">{error}</p>}
      <input
        type="password"
        placeholder="Confirm Password"
        value={formData.confirmPassword}
        onChange={(e) => setFormData({ confirmPassword: e.target.value })}
        className="input"
      />
      {error && <p className="text-red-500">{error}</p>}
      <div className="flex justify-between gap-6">
        <button onClick={() => setStep(2)} className="button">
          Back
        </button>
        <button onClick={handleSubmit} className="button">
          Submit
        </button>
      </div>
    </div>
  );
};

const SignupForm: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    username: "",
    email: "",
    confirmEmail: "",
    bvnOrNin: "",
    phoneNumber: "",
    country: "",
    state: "",
    lga: "",
    password: "",
    confirmPassword: "",
    address: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<
    "success" | "error" | "info" | "warning"
  >("success");
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleSuccess = (title: string, message: string) => {
    setModalType("success");
    setModalTitle(title);
    setModalMessage(message);
    setIsModalOpen(true);
  };

  const handleError = (title: string, message: string) => {
    setModalType("error");
    setModalTitle(title);
    setModalMessage(message);
    setIsModalOpen(true);
  };

  return (
    <div className="w-full max-w-md mx-auto mt-10 p-8 border rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6">Sign Up</h1>
      <div className="flex justify-between mb-6">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step === s ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            {s}
          </div>
        ))}
      </div>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <StepOne
            step={step}
            setStep={setStep}
            formData={formData}
            setFormData={updateFormData}
          />
          <StepTwo
            step={step}
            setStep={setStep}
            formData={formData}
            setFormData={updateFormData}
          />
          <StepThree
            step={step}
            setStep={setStep}
            formData={formData}
            setFormData={updateFormData}
            setIsLoading={setIsLoading}
            handleSuccess={handleSuccess}
            handleError={handleError}
          />
        </>
      )}
      <MessageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalTitle}
        message={modalMessage}
        type={modalType}
      />
    </div>
  );
};

export default SignupForm;
