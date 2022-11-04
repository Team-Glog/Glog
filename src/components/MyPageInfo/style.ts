import styled from "@emotion/styled";

export const MyPosts_Layout = styled.div`
  width: 100%;
  display: grid;
  justify-content: center;
  grid-template-columns: repeat(4, 330px);
  gap: 24px 24px;
`;

export const Profile_Layout = styled.div`
  width: 100%;
  height: 330px;
  background-color: #1f2125;
  margin-bottom: 70px;
  display: flex;
  justify-content: center;
`;

export const Profile_Box = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const ProfileImage = styled.img`
  width: 164px;
  height: 164px;
  border-radius: 100px;
  object-fit: cover;
`;

export const ProfileName = styled.p`
  font-family: "Pretendard";
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  color: #ffffff;
  margin-top: 16px;
  text-align: center;
`;
