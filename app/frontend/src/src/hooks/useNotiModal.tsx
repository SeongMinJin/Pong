import { useContext, useEffect, useState } from "react";
import { getSocket } from "socket/socket";
import Modal from "modal/layout/Modal";
import NotificationModal from "modal/NotificationModal";
//import { NoticeListContext } from "./context/NoticeListContext";

export type NotiType = {
  key: string;
  type: string;
  title: string;
  chatId?: number;
  chatTitle?: string;
  dmId?: number;
  gameId?: number;
  from?: string;
};

type InvitationType = {
  type: string;
  roomId: number;
  from: string;
};

export default function useNotiModal(status: string) {
  const socket = getSocket();
  //const notice = useContext(NoticeListContext); 
  const [notiList, setNotiList] = useState<NotiType[]>([]);
  const [newNoti, setNewNoti] = useState(false);
  const [showNotiModal, setShowNotiModal] = useState(false);
  const [idx, setIdx] = useState(0);
  const [isWaiting, setIsWaiting] = useState(false);

  const listener = (res: InvitationType) => {
    if (res.type === "chatInvitation") {
      setNotiList((prev) => [
        ...prev,
        {
          key: `${idx}_${Date.now()}`,
          type: "chat",
          title: `${res.from} 님으로 부터 #${res.roomId} 채팅방에 초대 되었습니다.`,
          chatId: res.roomId,
          chatTitle: "초대된 채팅방",
        },
      ]);
      setNewNoti(true);
      if (status === "login" && !isWaiting) setShowNotiModal(true); // 게임 중 일때는 팝업 x
    } else if (res.type === "gameInvitation") {
      setNotiList((prev) => [
        ...prev,
        {
          key: `${idx}_${Date.now()}`,
          type: "game",
          title: `${res.from} 님으로 부터 게임 신청이 왔습니다.`,
          from: res.from,
        },
      ]);
      setNewNoti(true);
      if (status === "login" && !isWaiting) setShowNotiModal(true);
    }
    setIdx(idx + 1);
  };

  const onRemove = (key: string) => {
    setNotiList(notiList.filter((elem) => elem.key !== key));
  };

  const waitingListener = (res: any) => {
    if (res.status === "searching" || res.status === "waiting") {
      setIsWaiting(true);
    } else if (res.status === "match") {
      setIsWaiting(false);
    }
  }

  useEffect(() => {
    socket.on("message", listener);
    socket.on("searchGameResult", waitingListener);
    socket.on("inviteGameResult", waitingListener);
    return () => {
      socket.off("message", listener);
      socket.off("searchGameResult", waitingListener);
      socket.off("inviteGameResult", waitingListener);
    };
  }, [status, idx, isWaiting]);

  const closeModalHandler = () => {
    setShowNotiModal(false);
    setNewNoti(false);
    setNotiList(notiList.filter((elem) => elem.type !== "chat"));
    setIsWaiting(false);
  };

  const onOpenNotiModal = () => {
    setShowNotiModal(true);
  };

  return {
    showNotiModal,
    NotiModal: (
      <Modal set={"noti"} setView={onOpenNotiModal}>
        <NotificationModal close={closeModalHandler} notiList={notiList} onRemove={onRemove} />
      </Modal>
    ),
    onOpenNotiModal,
    newNoti,
  };
}
