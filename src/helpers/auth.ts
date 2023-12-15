;
import React from "react";
import toast from "react-hot-toast";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../config/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { User } from "../Types/index";
import Cookies from "js-cookie";

export const handleSignUp = async (
  e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  role: string,
  navigate: AppRouterInstance,
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
    } as User)
      .then(() => {
        localStorage.setItem("role", role);
        localStorage.setItem("uid", uid);
        localStorage.setItem("isLoggedIn", "true");
        Cookies.set("isLoggedIn", "true");
        toast.success("Account created successfully");
        navigate(`/dashboard/${role == "admin" ? "admin" : "user"}`);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        toast.error(error.code);
        setIsLoading(false);
      });
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
  navigate: AppRouterInstance,
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
            localStorage.setItem("uid", uid);
            localStorage.setItem("isLoggedIn", "true");
            Cookies.set("isLoggedIn", "true", {
              expires: 7,
              sameSite: "strict",
            });
            navigate(
              `/dashboard/${
                docSnapshot.data().role == "admin" ? "admin" : "user"
              }`
            );
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
  email: string,
) => {
  e.preventDefault();
  if (!email) {
    return toast.error("email cannot be empty");
  }

  try {
    await sendPasswordResetEmail(auth, email);
    toast.success("Password reset email sent");
    // navigate("/login");
  } catch (error: any) {
    console.error(error);
    toast.error(error.code);
  }
};

export const handleLogout = async (navigate: AppRouterInstance) => {
  Cookies.remove("isLoggedIn");
  localStorage.clear();
  navigate("/auth/login");
};
