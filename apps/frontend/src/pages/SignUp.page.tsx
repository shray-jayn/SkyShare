import React from "react";
import SignUpComponent from "../components/SignUp.component";

const SignUpPage: React.FC = () => {
  return (
    <div className="flex min-h-screen">
      {/* Left panel: half-width blue background, hidden on small screens */}
      <div className="hidden md:flex w-1/2 bg-blue-600" />


      <div className="flex w-full md:w-1/2 justify-center items-center p-8 overflow-y-auto">
        <div className="w-full max-w-md">
          <SignUpComponent />
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
