export const requestAccount = async () =>
  await window.ethereum.request({ method: "eth_requestAccounts" });

export const isMetaMaskInstalled = () => {
  return (
    typeof window !== "undefined" &&
    typeof window.ethereum !== "undefined" &&
    window.ethereum.isMetaMask
  );
};

export const getAccount = async () => {
  const accounts = await window.ethereum.request({ method: "eth_accounts" });
  return accounts[0];
};

export async function fetcher<JSON = any>(
  input: RequestInfo,
  init?: RequestInit
): Promise<JSON> {
  const res = await fetch(input, init);
  return res.json();
}

export function jsonResponse(status: number, data: any, init?: ResponseInit) {
  return new Response(JSON.stringify(data), {
    ...init,
    status,
    headers: {
      ...init?.headers,
      "Content-Type": "application/json",
    },
  });
}
