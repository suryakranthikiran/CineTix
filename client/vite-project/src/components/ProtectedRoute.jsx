import React, { useEffect, useState } from "react";
import { GetCurrentUser } from "../apiCalls/users";
import { useNavigate, Link } from "react-router-dom";
import { message, Layout, Menu } from "antd";
import { useDispatch, useSelector } from "react-redux";

import { Header } from "antd/es/layout/layout";
import {
  HomeOutlined,
  LogoutOutlined,
  ProfileOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { setUser } from "../redux/userSlice";

function ProtectedRoute({ children }) {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const navItems = [
    {
      label: "Home",
      icon: <HomeOutlined />,
      key: "/", // Key used for navigation
    },
    {
      label: `${user ? user.name : ""}`,
      icon: <UserOutlined />,
      children: [
        {
          label: (
            <span
              onClick={() => {
                if (user.role === "admin") {
                  navigate("/admin");
                } else if (user.role === "partner") {
                  navigate("/partner");
                } else {
                  navigate("/user");
                }
              }}
            >
              My Booked Tickets
            </span>
          ),
          icon: <ProfileOutlined />,
          key: "profile", // dummy key
        },
        {
          label: (
            <span
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/login");
              }}
            >
              Log Out
            </span>
          ),
          icon: <LogoutOutlined />,
          key: "logout",
        },
      ],
    },
  ];

  const getValidUser = async () => {
    try {
      const response = await GetCurrentUser();
      dispatch(setUser(response.data));
    } catch (error) {
      dispatch(setUser(null));
      message.error(error.message);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getValidUser();
    } else {
      navigate("/login");
    }
  }, []);

  const onMenuClick = (info) => {
    const { key } = info;
    if (key === "/") {
      navigate("/");
    }
  };

  return (
    user && (
      <Layout>
        <Header
          className="d-flex justify-content-between"
          style={{
            position: "sticky",
            top: 0,
            width: "100%",
            display: "flex",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <h3 className="demo-logo text-white m-0" style={{ color: "white" }}>
            CineTix
          </h3>
          <Menu
            theme="dark"
            mode="horizontal"
            items={navItems}
            onClick={onMenuClick}
          />
        </Header>
        <div style={{ padding: 24, minHeight: 380, background: "#fff" }}>
          {children}
        </div>
      </Layout>
    )
  );
}

export default ProtectedRoute;
