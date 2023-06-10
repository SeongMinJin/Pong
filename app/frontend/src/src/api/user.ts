import axios, { AxiosError } from "axios";

export async function getProfile(username: string) {
  try {
    const res = await axios.get(`/user/profile/${username}`);
    if (res.data.gameHistory) res.data.gameHistory.reverse();
    return res.data;
  } catch (err: unknown) {
    if (err instanceof AxiosError && err.response) {
      console.error(err.response);
      return null;
    }
  }
}

export type userInfoType = {
  username: string;
  accessToken: string;
};

export async function create(userInfo: userInfoType) {
  try {
    const res = await axios.post(
      `/user/create`,
      {
        username: userInfo.username,
      },
      {
        headers: {
          Authorization: `Bearer ${userInfo.accessToken}`,
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

export async function getAvatar(username: string) {
  try {
    const res = await axios.get<Blob>(`/user/avatar/${username}`, {
      responseType: "blob",
    });
    return URL.createObjectURL(res.data);
  } catch (err: unknown) {
    if (err instanceof AxiosError && err.response) {
      console.error(err.response);
      return err.response;
    }
  }
}

export async function postAvatar(form: FormData) {
  try {
    const res = await axios.post("/user/avatar", form);
    return res;
  } catch (err: unknown) {
    if (err instanceof AxiosError && err.response) {
      console.error(err.response);
      return err.response;
    }
  }
}

export async function getBadge(win: string) {
  try {
    const res = await axios.get(`/user/badge/${win}`, {
      responseType: "blob",
    });
    return URL.createObjectURL(res.data);
  } catch (err: unknown) {
    if (err instanceof AxiosError && err.response) {
      console.error(err.response);
      return err.response;
    }
  }
}
