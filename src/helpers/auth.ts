import React from "react";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../config/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { User } from "../Types/index";
import { toast } from "react-toastify";

export const handleSignUp = async (
  e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  role: string,
  navigate: any, // eslint-disable-line
  setIsLoading: (args: boolean) => void
) => {
  e.preventDefault();
  setIsLoading(true);
  if (!firstName) {
    setIsLoading(false);
    return toast.error("first name cannot be empty");
  } else if (!lastName) {
    setIsLoading(false);
    return toast.error("last name cannot be empty");
  } else if (!email) {
    setIsLoading(false);
    return toast.error("email cannot be empty");
  } else if (!password) {
    setIsLoading(false);
    return toast.error("password cannot be empty");
  } else if (role == "user") {
    setIsLoading(false);
    return toast.error("select role");
  }
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const { uid } = userCredential.user;
    const userDocRef = doc(db, "users", uid);

    await setDoc(userDocRef, {
      firstName: firstName,
      lastName: lastName,
      email: email,
      role: role,
      package: "freemium",
    } as User)
      .then(() => {
        localStorage.setItem("role", role);
        localStorage.setItem("uid", uid);
        localStorage.setItem("isLoggedIn", "true");
        toast.success("Account created successfully");
        window.location.href = `/dashboard/${
          role == "admin" ? "admin" : "user"
        }`;
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        toast.error(error.code);
        setIsLoading(false);
      });
    // eslint-disable-next-line
  } catch (error: any) {
    console.error(error);
    toast.error(error.code);
    setIsLoading(false);
  }
};

export const handleLogin = async (
  e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  email: string,
  password: string,
  navigate: any, // eslint-disable-line
  setIsLoading: (args: boolean) => void
) => {
  e.preventDefault();
  setIsLoading(true);
  if (!email) {
    setIsLoading(false);
    return toast.error("email cannot be empty");
  } else if (!password) {
    setIsLoading(false);
    return toast.error("password cannot be empty");
  }
  await signInWithEmailAndPassword(auth, email, password)
    .then((user) => {
      if (user) {
        const { uid } = user.user;
        const userDocRef = doc(db, "users", uid);

        getDoc(userDocRef).then((docSnapshot) => {
          if (docSnapshot.exists()) {
            localStorage.setItem("role", docSnapshot.data().role);
            localStorage.setItem("email", docSnapshot.data().email);
            localStorage.setItem("uid", uid);
            localStorage.setItem("isLoggedIn", "true");

            window.location.href = `/dashboard/${
              docSnapshot.data().role == "admin" ? "admin" : "user"
            }`;
            toast.success("Logged in successfully");
          }
        });
      }
    })
    .catch((error) => {
      console.error(error);
      toast.error(error.code);
    })
    .finally(() => {
      setIsLoading(false);
    });
};

export const handleForgotPassword = async (
  e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  email: string
) => {
  e.preventDefault();
  if (!email) {
    return toast.error("email cannot be empty");
  }

  try {
    await sendPasswordResetEmail(auth, email);
    toast.success("Password reset email sent");
    // eslint-disable-next-line
  } catch (error: any) {
    console.error(error);
    toast.error(error.code);
  }
};

// eslint-disable-next-line
export const handleLogout = async (navigate: any) => {
  localStorage.clear();
  navigate("/auth/login");
};
