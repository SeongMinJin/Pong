import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as S from "./style";
import * as user from "api/user";
import * as auth from "api/auth";

type eventChangeType = React.ChangeEvent<HTMLInputElement>;
type eventClickType = React.MouseEvent<HTMLButtonElement>;

export default function signUp(props: { accessToken: string }) {
  const navigate = useNavigate();
  const [idInput, setIdInput] = useState("");
  const [formCheck, setFormCheck] = useState("");

  function onIdHandler(event: eventChangeType) {
    setIdInput(event.target.value);
    if (formCheck) setFormCheck("");
  }

  async function isComplete(event: eventClickType) {
    event.preventDefault();
    const idCheck = await onCheckIdHandler();
    if (idCheck) {
      const userInfo: user.userInfoType = {
        username: idInput,
        accessToken: props.accessToken,
      };
      const res = await user.create(userInfo);
      if (res && (res.status === 200 || res.status === 201)) {
        alert("회원가입 완료되었습니다.");
        navigate("/");
      } else {
        alert("잠시 후 다시 시도해주세요.");
      }
    }
  }

  async function onCheckIdHandler() {
    if (!idInput) {
      setFormCheck("닉네임을 입력해주세요.");
    } else {
      const res = await auth.existUsername(idInput);
      if (res && (res.status === 200 || res.status === 201)) {
        const isUsing: boolean = res.data.status;
        if (!isUsing) {
          return true;
        }
        setFormCheck("이미 존재하는 닉네임입니다.");
      } else {
        alert("잠시 후 다시 시도해주세요.");
      }
    }
    return false;
  }

  return (
    <S.SignUpLayout>
      <div className="signUpContainer">
        <form>
          <div className="form-main">
            <h2>닉네임 등록</h2>
            <S.InputArea>
              <S.BtnWrapper>
                <S.FullWidthInput maxLength={10} onChange={onIdHandler}></S.FullWidthInput>
              </S.BtnWrapper>
            </S.InputArea>
            <S.BtnWrapper>
              <S.FullWidthBtn onClick={isComplete}>확인</S.FullWidthBtn>
            </S.BtnWrapper>
          </div>
        </form>
        <S.Span color="red">{formCheck}</S.Span>
      </div>
    </S.SignUpLayout>
  );
}
