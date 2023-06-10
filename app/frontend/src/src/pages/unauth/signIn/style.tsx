import styled from "@emotion/styled";
import * as button from "style/button";

export const SignInLayout = styled.div`
  position: relative;
  margin: auto;
  max-width: 400px;
  width: 100%;
  text-align: center;
  background: white;
  box-shadow: 0 1px 3px 1px rgba(0,0,0,.08);
  font-size: 14px;
  border-radius: 20px;
  padding: 24px;
`;

export const BtnWrapper = styled.div`
  width: 100%;
  margin: 10% 0;
  display: flex;
  justify-content: center;
`

export const Button = styled.button`
  ${button.basicColor}
  display: inline-block;
  padding: 6px 12px;
  border-radius: 5px;
  border: 1px solid lightgray;
  line-height: 1.5;
  width: 30%;
  margin: 5px;
`

export const FormLogo = styled.div`
  text-align: center;
  margin-bottom: 16px;
`

export const Input = styled.input`
  width: 65%;
  padding: 12px 18px 12px;
  border: 1.5px solid lightgray;
  border-radius: 8px;
  transition: border-color .2s cubic-bezier(.25,.1,.25,1);
  margin-bottom: 4px;
  text-align: center;
`

export const Span = styled.span`
  color: red;
  font-size: 11px;
`

export const Wrapper = styled.div`
  width: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
`

export const FullWidthInput = styled(Input)`
  width: 100%;
`

export const FullWidthBtn = styled(Button)`
  width: 100%;
`