// pages/privacy.tsx
import React from "react";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="pt-20 max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
        Privacy Policy
      </h1>
      <p className="text-gray-700 mb-4">
        At [Your Company], we are committed to protecting your personal
        information and your right to privacy.
      </p>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          1. Information We Collect
        </h2>
        <p className="text-gray-700">
          We collect personal information that you voluntarily provide to us
          when you register on the website, express an interest in obtaining
          information about us or our products and services, when you
          participate in activities on the website, or otherwise contact us.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          2. How We Use Your Information
        </h2>
        <p className="text-gray-700">
          We use personal information collected via our website for a variety of
          business purposes described below. We process your personal
          information for these purposes in reliance on our legitimate business
          interests.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          3. Sharing Your Information
        </h2>
        <p className="text-gray-700">
          We may process or share your data that we hold based on the following
          legal basis: consent, legitimate interests, performance of a contract,
          legal obligations, and vital interests.
        </p>
      </section>

      {/* Add more sections as needed */}

      <p className="text-gray-700 mt-8">
        If you have any questions about this Privacy Policy, please contact us
        at [Your Contact Information].
      </p>
    </div>
  );
};

export default PrivacyPolicy;
