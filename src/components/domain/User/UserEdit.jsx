import React, { useRef, useState } from "react";
import Header from "@/components/base/Header";
import Nav from "@/components/base/Nav";
import styled from "styled-components";
import {
  Box,
  Avatar,
  Button,
  TextField,
  InputAdornment,
  Input,
} from "@mui/material";
import {
  Call as CallIcon,
  Map as MapIcon,
  Lock as LockIcon,
} from "@mui/icons-material";
import PropTypes from "prop-types";
import axios from "axios";
import { useNavigate } from "react-router";
import MediaQueryStyle from "@/styles/MediaQueryStyle";
import UserType from "@/utils/hooks/UserType";

const avatarStyle = {
  width: "28vw",
  height: "28vw",
  maxWidth: "140px",
  maxHeight: "140px",
  mr: "2vw",
  cursor: "pointer",
  filter: "brightness(70%)",
};

const editInputStyle = {
  my: 1,
  mx: "auto",
  display: "flex",
  flexDirection: "column",
  width: "85vw",
  gap: "10px",
};

const userProfileContainerStyle = {
  display: "flex",
  marginBottom: "14px",
};

const UserEdit = ({ myProfile }) => {
  const [previewImg, setPreviewImg] = useState(myProfile.image);
  const [contactInput, setContactInput] = useState(myProfile.contact);
  const [addressInput, setAddressInput] = useState(myProfile.address);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordConfirmInput, setPasswordConfirmInput] = useState("");
  const [introInput, setIntroInput] = useState(myProfile.introduction);
  const [imageFile, setImageFile] = useState("");
  const profileInput = useRef();
  const navigate = useNavigate();

  const uploadImage = () => {
    setPreviewImg("");
    setImageFile("");
    profileInput.current.click();
  };
  const handleFileChange = (e) => {
    preview(e.target.files[0]);
    setImageFile(e.target.files[0]);
  };
  const handlePasswordChange = (e) => {
    setPasswordInput(e.target.value);
  };
  const handlePasswordConfirmChange = (e) => {
    setPasswordConfirmInput(e.target.value);
  };
  const handleContactChange = (e) => {
    setContactInput(e.target.value);
  };
  const handleAddressChange = (e) => {
    setAddressInput(e.target.value);
  };
  const handleIntroChange = (e) => {
    setIntroInput(e.target.value);
  };

  const submitData = {
    address: addressInput,
    contact: contactInput,
    email: myProfile.email,
    password: passwordInput,
    introduction: introInput,
    nickname: myProfile.name,
    name: myProfile.name,
    owner: myProfile.owner,
    registrationCode: myProfile.registrationCode,
  };

  const handleSubmit = () => {
    if (passwordInput.length < 7 || passwordInput !== passwordConfirmInput) {
      alert("비밀번호를 확인해주세요");
      return;
    }
    const formData = new FormData();
    imageFile
      ? formData.append("file", imageFile)
      : formData.append("file", new Blob([""], { type: "application/json" }));
    formData.append(
      "request",
      new Blob([JSON.stringify(submitData)], { type: "application/json" })
    );
    axios({
      method: "put",
      url: `${process.env.REACT_APP_API_BASE_URL}/${UserType()}s`,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: "Bearer " + localStorage.getItem("needit_access_token"),
      },
    }).then(navigate(0));
  };

  // 업로드 이미지 미리보기
  const preview = (image) => {
    if (!image || !image.type.match("image.*")) return false;
    let reader = new FileReader();
    reader.onload = () => {
      setPreviewImg(reader.result);
    };
    reader.readAsDataURL(image);
    profileInput.current.backgroundImage = `url(${reader.result})`;
  };

  return (
    <Box>
      <Header type="searchOut" fixed />
      <MediaQueryStyle>
        <Button
          sx={{
            position: "fixed",
            top: "20px",
            right: "44px",
            zIndex: "10000",
            fontSize: "16px",
          }}
          onClick={handleSubmit}
        >
          완료
        </Button>
        <Box sx={{ p: "16px" }}>
          <form
            form
            name="file"
            encType="multipart/form-data"
            onSubmit={handleSubmit}
          >
            <input
              ref={profileInput}
              type="file"
              accept=".jpg, .png"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </form>
          <Box sx={userProfileContainerStyle}>
            <Avatar onClick={uploadImage} src={previewImg} sx={avatarStyle} />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "4px",
                  }}
                >
                  <LockIcon color="primary" sx={{ mr: 0.5 }} />
                  <TextField
                    primary
                    label="비밀번호"
                    defaultValue="Hello World"
                    value={passwordInput}
                    onChange={handlePasswordChange}
                    variant="outlined"
                    type="password"
                    size="small"
                  />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "4px",
                  }}
                >
                  <LockIcon color="primary" sx={{ mr: 0.5 }} />
                  <TextField
                    primary
                    label="비밀번호 확인"
                    defaultValue="Hello World"
                    value={passwordConfirmInput}
                    onChange={handlePasswordConfirmChange}
                    helperText={
                      passwordConfirmInput.length < 7
                        ? "8자리 이상 입력해주세요"
                        : passwordConfirmInput !== passwordInput
                        ? "비밀번호가 일치하지 않습니다"
                        : ""
                    }
                    variant="outlined"
                    type="password"
                    size="small"
                    style={{ fontSize: "2px" }}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
          <Box sx={editInputStyle}>
            <Input
              startAdornment={
                <InputAdornment position="start">
                  <CallIcon color="primary" />
                </InputAdornment>
              }
              value={contactInput}
              onChange={handleContactChange}
              sx={{ fontSize: "14px", maxWidth: "500px" }}
            />
            <Input
              startAdornment={
                <InputAdornment position="start">
                  <MapIcon color="primary" />
                </InputAdornment>
              }
              value={addressInput}
              onChange={handleAddressChange}
              sx={{ fontSize: "14px", maxWidth: "500px" }}
            />
          </Box>
          <UserIntroEdit
            placeholder="자기소개를 입력하세요"
            value={introInput}
            onChange={handleIntroChange}
          ></UserIntroEdit>
          <Box sx={{ my: "8px" }}></Box>
        </Box>
      </MediaQueryStyle>
      <Nav />
    </Box>
  );
};

export default UserEdit;

UserEdit.propTypes = {
  myProfile: PropTypes.object,
};

const UserIntroEdit = styled.textarea`
  background: #f6f6f6;
  border: 1px solid #e8e8e8;
  box-sizing: border-box;
  border-radius: 8px;
  height: 170px;
  width: 100%;
  margin: 10px 0;
  padding: 10px;
  font-size: 14px;
  font-family: "Spoqa Han Sans Neo";
  color: #8e8e8e;
  resize: none;
  &:focus {
    outline: none;
  }
`;
