import React from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import { signOut } from 'aws-amplify/auth';
import "@aws-amplify/ui-react/styles.css";
import awsmobile from "./aws-exports"; // Import AWS configurations

// Configure Amplify with AWS exports
Amplify.configure(awsmobile);

const formFields = {
  signUp: {
    username: {
      order: 1,
      placeholder: "Choose a username",
      label: "Username",
      inputProps: { required: true, autoComplete: "username" },
    },
    email: {
      order: 2,
      placeholder: "Enter your email address",
      label: "Email",
      inputProps: { type: "email", required: true, autoComplete: "email" },
    },
    phone_number: {
      order: 3,
      placeholder: "Enter your phone number",
      label: "Phone Number",
      inputProps: { type: "tel", required: true, autoComplete: "tel" },
    },
    password: {
      order: 4,
      placeholder: "Enter your password",
      label: "Password",
      inputProps: { type: "password", required: true, autoComplete: "new-password" },
    },
    confirm_password: {
      order: 5,
      placeholder: "Confirm your password",
      label: "Confirm Password",
      inputProps: { type: "password", required: true, autoComplete: "new-password" },
    },
  },
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <Authenticator formFields={formFields}>
      {({ signOut: authSignOut, user }: any) =>
        user ? (
          <div>
            <button onClick={authSignOut}>Sign Out</button>
            {children}
          </div>
        ) : (
          <div>
            <h1>Please sign in below:</h1>
            <Authenticator formFields={formFields} />
          </div>
        )
      }
    </Authenticator>
  );
};

export default AuthProvider;
