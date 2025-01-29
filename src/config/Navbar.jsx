import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useState } from "react";
import { useAuth } from "./AuthContext";
import "./index.css";

// 메뉴바 컴포넌트
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate(); // useNavigate 훅 사용
  const { isLoggedIn, logout } = useAuth(); // useAuth 훅을 사용하여 로그인 상태와 logout 함수 가져오기

  // 메뉴 열고 닫기
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLoginLogout = () => {
    logout(); // 로그아웃 처리
    navigate("/"); // 로그인 페이지로 이동
  };

  const handleLogoClick = () => {
    navigate("/dashboard");
  }

  return (
    <>
      <Nav>
        <NavContainer>
          <Logo onClick={handleLogoClick}>WEAVUS</Logo>
          <MenuIcon onClick={toggleMenu}>
            {isMenuOpen ? "닫기" : "메뉴"}
          </MenuIcon>
          <Menu $isOpen={isMenuOpen}>
            {isLoggedIn ? (
              <>
                <MenuItem>
                  <StyledLink to="/workSchedule/dashboard">근무표(테스트)</StyledLink>
                </MenuItem>
                <MenuItem>
                  <StyledLink to="/personnel/dashboard">인사관리</StyledLink>
                </MenuItem>
                <MenuItem>
                  <StyledLink to="/dashboard">퇴직금 현황</StyledLink>
                </MenuItem>
                <MenuItem>
                  <StyledLink to="/year/dashboard">퇴직금 검색</StyledLink>
                </MenuItem>
                <MenuItem>
                  <StyledLink to="/employee">사원 등록</StyledLink>
                </MenuItem>
                <MenuItem>
                  <StyledLink to="/admin">관리자페이지</StyledLink>
                </MenuItem>
                <MenuItem>
                  <button className="save-button" onClick={handleLoginLogout}>
                    로그아웃
                  </button>
                </MenuItem>
              </>
            ) : (
              <MenuItem>
                <button className="save-button" onClick={handleLoginLogout}>
                  로그인
                </button>
              </MenuItem>
            )}
          </Menu>
        </NavContainer>
      </Nav>
      <ContentArea>{}</ContentArea>
    </>
  );
};

// 스타일링
const Nav = styled.nav`
  background-color: #333;
  padding: 10px 20px;
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 10;
`;

const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
`;

const Logo = styled.h1`
  color: white;
  font-size: 24px;
  width: 18%;
`;

const MenuIcon = styled.div`
  display: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  width: 50%;
  @media (max-width: 782px) {
    display: block;
  }
`;

const Menu = styled.ul`
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
  align-items: center;
  flex-wrap: wrap; /* 메뉴 항목들이 화면 크기에 맞춰 자동으로 줄어듦 */
  width: 70%; /* 메뉴의 너비를 100%로 설정 */
  justify-content: flex-end; /* 메뉴 항목을 오른쪽으로 정렬 */

  @media (max-width: 782px) {
    position: absolute;
    top: 40px;
    left: 0;
    right: 0;
    width: 100%;
    background-color: #333;
    flex-direction: column;
    align-items: center;
    height: ${(props) => (props.$isOpen ? "auto" : "0")};
    overflow: hidden;
    transition: height 0.3s ease-in-out;
  }
`;

const MenuItem = styled.li`
  padding: 10px 20px;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: white;
  font-size: 16px;
  text-align: center;
  &:hover {
    color: #ccc;
  }
`;

const ContentArea = styled.div`
  padding-top: 60px; /* 메뉴의 높이만큼 패딩을 추가하여 콘텐츠가 가려지지 않도록 함 */
`;

export default Navbar;
