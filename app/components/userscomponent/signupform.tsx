"use client";
import { useState } from "react";
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
      <button onClick={handleNext} className="button">
        Next
      </button>
      <div className="divider"> </div>
      <button onClick={() => signIn("google")} className="button">
        Sign in with Google
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
      <div className="flex justify-between">
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
    //   handleInfo: (title: string, message: string) => void;
    // handleWarning: (title: string, message: string) => void;
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
    }

    if (!formData.confirmPassword) {
      setErrorWithTimeout("Confirm password is required");
      valid = false;
    } else if (formData.password !== formData.confirmPassword) {
      setErrorWithTimeout("Passwords do not match");
      valid = false;
    }

    if (valid) {
      setIsLoading(true); // Show loading spinner
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
        setIsLoading(false); // Hide loading spinner
      }
    } else {
      setErrorWithTimeout("Form Submission Failed");
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
      <input
        type="password"
        placeholder="Confirm Password"
        value={formData.confirmPassword}
        onChange={(e) => setFormData({ confirmPassword: e.target.value })}
        className="input"
      />
      {error && <p className="text-red-500">{error}</p>}
      <div className="flex justify-between">
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

  // const handleInfo = (title: string, message: string) => {
  //   setModalType('info');
  //   setModalTitle(title);
  //   setModalMessage(message);
  //   setIsModalOpen(true);
  // };

  // const handleWarning = (title: string, message: string) => {
  //   setModalType('warning');
  //   setModalTitle(title);
  //   setModalMessage(message);
  //   setIsModalOpen(true);
  // };

  return (
    <div className="w-full max-w-md mx-auto mt-10 p-8 border rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6">Sign Up</h1>
      <div className="flex justify-between mb-6">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step === s ? "bg-green-500 text-white" : "bg-gray-200"
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
            // handleInfo={handleInfo}
            // handleWarning={handleWarning}
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
