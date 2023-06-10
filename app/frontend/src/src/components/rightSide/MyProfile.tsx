import { useContext, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getProfile, getAvatar } from "api/user";
import { getUsername } from "userAuth";
import useNotiModal from "hooks/useNotiModal";
import { ProfileContext } from "hooks/context/ProfileContext";
import { MyProfileLayout } from "./style";
import { UserItem } from "./user/style";
import * as S from "./user/style";
import { getSocket } from "socket/socket";
import { useLocation } from "react-router-dom";

export default function MyProfile() {
  const username = getUsername();
  const socket = getSocket();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [gameResult, setGameResult] = useState("");
  const profileQuery = useQuery({
    queryKey: ["profile", username],
    queryFn: () => {
      return getProfile(username);
    },
  });
  const avatarQuery = useQuery({
    queryKey: ["avatar", `${username}`],
    queryFn: () => {
      if (username) return getAvatar(username);
    },
    enabled: !!username,
  });

  const listener = (res: any) => {
    const targets = location.pathname.split("/");
    if (targets[1] !== "game" || Number.isNaN(Number(targets[2]))) {
      if (res.type === "win" || res.type === "lose") {
        setGameResult(res.type);
      }
    }
  };

  useEffect(() => {
    socket.on("message", listener);
    return () => {
      socket.off("message", listener);
    };
  }, []);

  useEffect(() => {
    const id = setTimeout(() => {
      queryClient.refetchQueries(["profile", username]);
    }, 300);
    return () => {
      clearTimeout(id);
      setGameResult("");
    };
  }, [gameResult]);

  const setProfileUser = useContext(ProfileContext);
  const { showNotiModal, NotiModal, onOpenNotiModal, newNoti } = useNotiModal(
    profileQuery?.data?.status
  );
  if (profileQuery.isLoading) return <UserItem />;

  return (
    <MyProfileLayout>
      <UserItem>
        {showNotiModal && NotiModal}
        {avatarQuery.isLoading ? (
          <S.LoadingImg />
        ) : (
          <S.ProfileImg
            clickable
            src={String(avatarQuery.data)}
            onClick={() => {
              setProfileUser && setProfileUser(username);
            }}
          />
        )}
        <S.UserInfoText
          clickable
          onClick={() => {
            setProfileUser && setProfileUser(username);
          }}
        >
          {profileQuery?.data?.username}
          <br />
          {profileQuery?.data?.status === "login"
            ? "🟣 온라인"
            : profileQuery?.data?.status === "logout"
            ? "⚫️ 오프라인"
            : "🟠 게임중"}
        </S.UserInfoText>
        {newNoti ? (
          <S.NewNotiIcon onClick={onOpenNotiModal} />
        ) : (
          <S.EmptyNotiIcon onClick={onOpenNotiModal} />
        )}
      </UserItem>
    </MyProfileLayout>
  );
}
