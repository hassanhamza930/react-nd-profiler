import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import Layout from "./pages/Layout";
import Billing from "./pages/Billing";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import SectionDetail from "./pages/dashboard/SectionDetail";
import SurveyDetail from "./pages/dashboard/SurveyDetail";
import UserDashboard from "./pages/dashboard/UserDashboard";
import QuestionPage from "./pages/dashboard/Question";
import Result from "./pages/dashboard/Result";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import { supabaseClient } from "./config/supabase";
import { RecoilRoot } from "recoil";

function App() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const role = localStorage.getItem("role");

  // async function checkSupabase() {
  //   const { data, error } = await supabaseClient
  //     .from("surveys")
  //     .select("*, sections(*,subsections(*))") // This assumes a relationship between surveys and sections
  //     .order("id", { ascending: true });

  //   if (error) {
  //     toast.error(error.message);
  //   } else {
  //     toast.success("Surveys fetched successfully");
  //     console.log(data);
  //   }
  // }

  // useEffect(() => {
  //   checkSupabase();
  // }, []);

  return (
    <div style={{ fontFamily: "Rubik" }}>
      <RecoilRoot>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          {isLoggedIn !== "true" ? (
            <Route>
              <Route path="/" element={<Navigate to={"/auth/login"} />} />
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/signup" element={<Signup />} />
            </Route>
          ) : (
            <Route element={<Layout />}>
              <Route
                path="/"
                element={
                  <Navigate
                    to={
                      role === "admin" ? "/dashboard/admin" : "/dashboard/user"
                    }
                  />
                }
              />
              <Route path="/dashboard/admin" element={<AdminDashboard />} />
              <Route path="/dashboard/user" element={<UserDashboard />} />
              <Route
                path="/dashboard/question/:id"
                element={<QuestionPage />}
              />
              <Route path="/dashboard/result/:id" element={<Result />} />
              <Route
                path="/dashboard/section/:surveyId/:sectionId/:subsectionId"
                element={<SectionDetail />}
              />
              <Route path="/dashboard/survey/:id" element={<SurveyDetail />} />
              <Route path="/dashboard/user" element={<AdminDashboard />} />
              <Route path="/billing" element={<Billing />} />
            </Route>
          )}
          <Route path="*" element={<Login />} />
        </Routes>
      </BrowserRouter>
      </RecoilRoot>
    </div>
  );
}

export default App;
