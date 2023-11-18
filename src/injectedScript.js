import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi";
import { mainnet, arbitrum } from "viem/chains";
import { getAccount, signMessage } from "@wagmi/core";

// Define constants
const projectId = "5f94a1e90e8e0c6ed61d1f311422609d";

// Create wagmiConfig
const metadata = {
  name: "Web3Modal",
  description: "Web3Modal Example",
  url: "https://web3modal.com",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};
const chains = [mainnet, arbitrum];
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

// Create modal
const modal = createWeb3Modal({ wagmiConfig, projectId, chains });

// Function to create and show the button
const createButton = () => {
  const div = document.createElement("div");
  div.textContent = "Connect Wallet";
  div.style.position = "fixed";
  div.style.bottom = "20px";
  div.style.left = "20px";
  div.style.padding = "20px";
  div.style.backgroundColor = "#5326ec";
  div.style.borderRadius = "8px";
  div.style.display = "flex";
  div.style.alignItems = "center";
  div.style.justifyContent = "center";
  div.style.flexDirection = "column";
  div.style.gap = "8px";
  div.innerHTML = "<w3m-button />";
  const button = document.createElement("button");
  button.textContent = "Click me";
  button.onclick = async () => {
    const account = getAccount();
    console.log("account", account);
    const signature = await signMessage({
      message: "gm wagmi frens",
    });
    console.log("signature", signature);
    window.postMessage(
      {
        type: "ConTx",
        action: "SET_SIGNATURE",
        signature: signature,
        account: account.isConnected ? account.address : null,
      },
      "*"
    );
  };
  div.appendChild(button);

  document.body.appendChild(div);
};

window.addEventListener("message", async (event) => {
  if (
    event.source === window &&
    event.data.type === "CONNECT_METAMASK_REQUEST"
  ) {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        window.postMessage(
          {
            type: "FROM_PAGE",
            text: "Message Signed!",
            address: account,
          },
          "*"
        );
      } catch (error) {
        window.postMessage(
          {
            type: "FROM_PAGE",
            text: "Error connecting to MetaMask.",
            error: error.message,
          },
          "*"
        );
      }
    } else {
      window.postMessage(
        {
          type: "FROM_PAGE",
          text: "MetaMask is not installed.",
        },
        "*"
      );
    }
  }
});

// Call createButton on script load
createButton();
