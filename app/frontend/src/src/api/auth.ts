import axios, { AxiosError } from "axios";

export async function existUsername(username: string) {
  try {
    const res = await axios.get(`/auth/exist/${username}`);
    return res;
  } catch (err: unknown) {
    if (err instanceof AxiosError && err.response) {
      console.error(err.response);
      return err.response;
    }
  }
}

export async function checkOtpLogin(OTP: string, token: string) {
  try {
    const res = await axios.post(
      `/auth/check/otp`,
      {
        otp: OTP,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return res;
  } catch (err: unknown) {
    if (err instanceof AxiosError && err.response) {
      console.error(err.response);
      return err.response;
    }
  }
}

export async function login(code: string) {
  try {
    const res = await axios.get(`/auth/login/${code}`);
    return res;
  } catch (err: unknown) {
    if (err instanceof AxiosError && err.response) {
      console.error(err.response);
      return err.response;
    } else if (err instanceof AxiosError && err.code === "ERR_NETWORK"){
      alert("서버 점검 중 입니다 잠시 후 다시 접속해주세요.");
      window.location.replace(`http://${import.meta.env.VITE_SERVER_IP}`);
    } else {
      console.error(err);
    }
  }
}