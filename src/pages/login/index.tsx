import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import useSWR from "swr";
import { requestAccount, isMetaMaskInstalled, getAccount } from "@/utils";
import type { NextPage } from "next";
import { useUser } from "@/hooks";

const Login: NextPage = () => {
  const router = useRouter();
  const { mutate } = useUser();
  const LoginHandler = async () => {
    if (isMetaMaskInstalled()) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      await requestAccount();
      const address = await getAccount();
      const req = await fetch(`/api/user/${address}`);
      const res = await req.json();
      let user;
      if (!res.success) {
        const userReq = await fetch("/api/user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ address: address }),
        });
        const userRes = await userReq.json();
        if (userRes.success) {
          user = userRes.user;
        }
      } else {
        user = res.user;
      }
      const signature = await signer.signMessage(
        `I am signing my one-time nonce: ${user.nonce}`
      );
      const authReq = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address, signature }),
      });
      const authRes = await authReq.json();
      if (authRes.success) {
        await mutate();
        router.push("/");
      }
    }
  };

  return (
    <div
      onClick={LoginHandler}
      className="flex items-center flex-col justify-center w-screen h-screen"
    >
      <button className="py-2 mt-20 mb-4 text-lg font-bold text-white rounded-lg w-56 bg-blue-600 hover:bg-blue-800">
        login with meta mask
      </button>
    </div>
  );
};

export default Login;
