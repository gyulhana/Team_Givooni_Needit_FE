import React, { useRef, useState } from "react";
import Header from "@/components/base/Header";
import Nav from "@/components/base/Nav";
import styled from "styled-components";
import { Box, Avatar, Button, Chip } from "@mui/material";
import {
  Call as CallIcon,
  Map as MapIcon,
  VpnKey as VpnKeyIcon,
} from "@mui/icons-material";
import PropTypes from "prop-types";
import axios from "axios";

const UserEdit = ({ myProfile, Intro }) => {
  const [previewImg, setPreviewImg] = useState(myProfile.image);
  const [contactInput, setContactInput] = useState(myProfile.contact);
  const [addressInput, setAddressInput] = useState(myProfile.address);
  const [passwordInput, setPasswordInput] = useState("need1234");
  const [passwordConfirmInput, setPasswordConfirmInput] = useState("");
  const [introInput, setIntroInput] = useState(Intro);
  const [imageFile, setImageFile] = useState(Intro);
  const profileInput = useRef();

  console.log(myProfile);

  const uploadImage = () => {
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

  const handleSubmit = () => {
    if (!passwordInput || passwordInput !== passwordConfirmInput) {
      alert("비밀번호를 확인해주세요");
      return;
    }
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append(
      "request",
      new Blob(
        [
          JSON.stringify({
            address: addressInput,
            contact: contactInput,
            email: myProfile.email,
            nickname: myProfile.name,
            password: passwordInput,
            introduction: introInput,
          }),
        ],
        { type: "application/json" }
      )
    );
    axios({
      method: "put",
      url: `${process.env.REACT_APP_API_BASE_URL}/members`,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: "Bearer " + localStorage.getItem("needit_access_token"),
      },
    });
  };

  const preview = (image) => {
    if (!image || !image.type.match("image.*")) return false;
    let reader = new FileReader();
    reader.onload = () => {
      setPreviewImg(reader.result);
    };
    reader.readAsDataURL(image);
    profileInput.current.backgroundImage = `url(${reader.result})`;
  };

  const editUserData = () => {
    handleSubmit();
  };

  return (
    <UsernameContainer>
      <Header type="plain" fixed />
      <Button
        sx={{
          position: "fixed",
          top: "20px",
          right: "20px",
          zIndex: "10000",
          fontSize: "16px",
        }}
        onClick={editUserData}
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
        <UserProfileContainer>
          <Avatar
            onClick={uploadImage}
            src={previewImg}
            sx={{
              width: "28vw",
              height: "28vw",
              maxWidth: "140px",
              maxHeight: "140px",
              mr: "2vw",
              cursor: "pointer",
              filter: "brightness(70%)",
            }}
          />
          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                width: "60vw",
                mb: "6px",
              }}
            >
              <Box>
                <Chip icon={<VpnKeyIcon />} label="비밀번호" />
                <UserPasswordEdit
                  value={passwordInput}
                  type="password"
                  onChange={handlePasswordChange}
                />
              </Box>
              <Box>
                <Chip icon={<VpnKeyIcon />} label="비밀번호 확인" />
                <UserPasswordEdit
                  value={passwordConfirmInput}
                  type="password"
                  onChange={handlePasswordConfirmChange}
                />
              </Box>
            </Box>
            <Box display="flex">
              <CallIcon />
              <UserDataEdit
                value={contactInput}
                onChange={handleContactChange}
              />
            </Box>
            <Box display="flex">
              <MapIcon />
              <UserDataEdit
                value={addressInput}
                onChange={handleAddressChange}
              />
            </Box>
          </Box>
        </UserProfileContainer>
        <UserIntroEdit
          placeholder="자기소개를 입력하세요"
          value={introInput}
          onChange={handleIntroChange}
        ></UserIntroEdit>
        <Box sx={{ my: "8px" }}></Box>
      </Box>
      <Nav />
    </UsernameContainer>
  );
};

export default UserEdit;

UserEdit.propTypes = {
  myProfile: PropTypes.object,
  Intro: PropTypes.string,
};

const UsernameContainer = styled.div``;

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

const UserPasswordEdit = styled.input`
  border: none;
  box-sizing: border-box;
  width: 100%;
  height: auto;
  font-size: 12px;
  font-family: "Spoqa Han Sans Neo";
  padding-left: 10px;
  resize: none;
  &:focus {
    outline: none;
  }
`;

const UserDataEdit = styled.textarea`
  border: none;
  box-sizing: border-box;
  width: 100%;
  height: auto;
  font-size: 12px;
  font-family: "Spoqa Han Sans Neo";
  resize: none;
  &:focus {
    outline: none;
  }
`;

const UserProfileContainer = styled.div`
  display: flex;
`;
