import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { sepolia } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "Sih",
  projectId: import.meta.env.VITE_PROJECT_ID,
  chains: [sepolia],
});
