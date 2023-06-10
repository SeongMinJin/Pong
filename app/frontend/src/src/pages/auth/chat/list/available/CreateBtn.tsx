import { useState } from "react";
import CreateChatRoomModal from "modal/CreateChatRoomModal";
import Modal from "modal/layout/Modal";
import { MakeRoomBtn } from "../style";

export default function CreateChatRoom() {
  const [showModal, setShowModal] = useState(false);

  function showModalHandler() {
    setShowModal(true);
  }
  function closeModalHandler() {
    setShowModal(false);
  }

  return (
    <>
      {showModal && (
        <Modal setView={closeModalHandler}>
          <CreateChatRoomModal close={closeModalHandler} />
        </Modal>
      )}
      <MakeRoomBtn onClick={showModalHandler}>채팅방 생성</MakeRoomBtn>
    </>
  );
}
