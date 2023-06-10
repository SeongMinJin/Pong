import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { setAuth } from "userAuth";
import OtpCheck from "./OtpCheck";
import * as auth from "api/auth";
import { AuthContext } from "hooks/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import LoadingCircle from "components/LoadingCircle";
import SignUp from "@unauth/signUp/SignUp";

export default function signIn() {
  const navigate = useNavigate();
  const setSigned = useContext(AuthContext);
  const target = window.location.search.split("=")[1];
  const [isSign, setIsSign] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [username, setUsername] = useState("");

if (window.location.href === `http://${import.meta.env.VITE_SERVER_IP}/signin`) {
    window.location.href = import.meta.env.VITE_REDIR_URL;
  }

  const oauthQuery = useQuery({
    queryKey: ["login"],
    queryFn: () => {
      return auth.login(target);
    },
    enabled: !!target,
    onSuccess: (res) => {
      if (res?.status === 200) {
        if (res.data.status === "approved") {
          if (res.data.detail === "signup") {
            // 회원가입
            setIsSign("signup");
            setAccessToken(res.data.accessToken);
          } else {
            // 2차 인증 x
            if (setSigned) setSigned(true);
            setAuth({
              username: res.data.username,
              token: res.data.accessToken,
            });
            navigate("/");
          }
        } else if (res.data.status === "published") {
          // 2차 인증 o
          setIsSign("2fa");
          setUsername(res.data.username);
          setAccessToken(res.data.accessToken);
        }
      } else if (res?.status === 409) {
        alert("이미 접속중 입니다.");
        navigate("/");
      } else {
        alert("잠시 후에 다시 시도해주세요.");
        navigate("/");
      } 
    },
  });

  const keyDownHandler = (e: KeyboardEvent) => {
    e.stopPropagation();
    if ((e.metaKey && e.key === "r") || e.key === "F5") {
      history.replaceState({}, "", location.pathname);
      location.reload();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", keyDownHandler, false);
    return () => {
      document.removeEventListener("keydown", keyDownHandler, false);
    };
  }, []);

  if (oauthQuery.isLoading) return <LoadingCircle w={50} h={50} />;

  switch (isSign) {
    case "2fa":
      return <OtpCheck username={username} accessToken={accessToken} />;
    case "signup":
      return <SignUp accessToken={accessToken} />;
    default:
      return <LoadingCircle w={50} h={50} />;
  }
}
