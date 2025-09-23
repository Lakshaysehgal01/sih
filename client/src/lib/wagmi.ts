import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "viem";
import { sepolia } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "Sih",
  projectId: import.meta.env.VITE_PROJECT_ID,
  chains: [sepolia],
  // pollingInterval: 10000,
  transports: {
    [sepolia.id]: http(import.meta.env.VITE_ALCHEMY_URL),
  },
});
