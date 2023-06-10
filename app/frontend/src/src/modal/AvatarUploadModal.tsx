import { postAvatar } from "api/user";
import * as S from "./layout/style";
import React, { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import imageCompression from "browser-image-compression";

type modalProps = {
  username: string | undefined;
  prevUrl: string;
  close: () => void;
};

function AvatarUploadModal(props: modalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploadedImg, setUploadedImg] = useState<File>();
  const [tmpImg, setTmpImg] = useState<string>("");
  const [noti, setNoti] = useState("");
  const queryCli = useQueryClient();

  const changeInput = () => {
    if (noti) setNoti("");
  };

  const onHandler = () => {
    let id;
    document.body.onfocus = () => (id = setTimeout(check, 400));
    clearTimeout(id);
  };

  const compressImg = async (img: File) => {
    const option = {
      maxSizeMb: 0.02,
      maxWidthOrHeight: 200,
    };

    const compressedImg = await imageCompression(img, option);
    return compressedImg;
  };

  const check = async () => {
    const files = inputRef.current?.files;
    const dialog = document.getElementById("modal-dialog");
    dialog?.setAttribute("open", "");
    const reader = new FileReader();
    if (files && files[0]) {
      try {
        const compressedImg = await compressImg(files[0]);
        setUploadedImg(compressedImg);
        reader.readAsDataURL(compressedImg);
        reader.onloadend = () => {
          if (reader.result) setTmpImg(reader.result as string);
        };
      } catch (err) {
        alert("다시 시도해주세요.");
      }
    }
    document.body.onfocus = null;
  };

  const avatarMutation = useMutation({
    mutationFn: (form: FormData) => {
      return postAvatar(form);
    },
    onSuccess: (res) => {
      if (res?.status === 201) {
        queryCli.invalidateQueries(["avatar", props.username]);
        URL.revokeObjectURL(props.prevUrl);
        props.close();
      } else {
        setNoti("이미지 크기를 확인해주세요.");
      }
    },
  });

  const uploadAvatarHandler = (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    if (uploadedImg) {
      formData.append("avatar", uploadedImg);
      avatarMutation.mutate(formData);
    } else {
      setNoti("이미지를 선택해주세요.");
    }
  };

  return (
    <S.AvatarUploadLayout>
      <form onSubmit={uploadAvatarHandler} encType="multipart/form-data">
        <h2>프로필 이미지 업로드</h2>
        <span> png / 20KB 이하 업로드 가능</span>
        <S.SelectImgWrapper>
          <S.Img src={tmpImg ? tmpImg : props.prevUrl} alt="프로필 이미지" />
          <S.Label htmlFor="avatar">
            {tmpImg ? "다른 이미지 선택" : "프로필 이미지 선택"}
          </S.Label>
          <input
            style={{ display: "none" }}
            ref={inputRef}
            type="file"
            accept=".png"
            id="avatar"
            onChange={changeInput}
            onClick={onHandler}
          />
        </S.SelectImgWrapper>
        <S.SpanDefault color="red">{noti}</S.SpanDefault>
        <S.Wrapper>
          <S.ModalButton type="submit"> 확인 </S.ModalButton>
          <S.ModalButton type="button" onClick={props.close}>
            취소
          </S.ModalButton>
        </S.Wrapper>
      </form>
    </S.AvatarUploadLayout>
  );
}

export default AvatarUploadModal;
