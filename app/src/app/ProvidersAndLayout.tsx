"use client";

import { LargeScreenLayout } from "@/components/layouts/LargeScreenLayout";
import { BalanceProvider } from "@/contexts/BalanceContext";
import { useRegisterServiceWorker } from "@/hooks/useRegisterServiceWorker";
import { ChildrenProps } from "@/types/ChildrenProps";
import { EnokiFlowProvider } from "@mysten/enoki/react";
import React from "react";
import { Toaster } from "react-hot-toast";
import {
  SuiClientProvider,
  WalletProvider,
  lightTheme,
} from "@mysten/dapp-kit";
import { getFullnodeUrl } from "@mysten/sui.js/client";
import { type StateStorage } from "zustand/middleware";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const ProvidersAndLayout = ({ children }: ChildrenProps) => {
  const queryClient = new QueryClient();

  const _ = useRegisterServiceWorker();
  const networks = {
    localnet: { url: getFullnodeUrl("localnet") },
    devnet: { url: getFullnodeUrl("devnet") },
    testnet: { url: getFullnodeUrl("testnet") },
    mainnet: { url: getFullnodeUrl("mainnet") },
  };

  // Ensure localStorage is used only on the client side
  const clientStorage =
    typeof window !== "undefined" ? localStorage : undefined;

  return (
    <QueryClientProvider client={queryClient}>
      <EnokiFlowProvider apiKey={process.env.NEXT_PUBLIC_ENOKI_API_KEY!}>
        <SuiClientProvider networks={networks} defaultNetwork={"testnet"}>
          <WalletProvider
            theme={lightTheme}
            autoConnect={true}
            storage={clientStorage as StateStorage}
            storageKey="sui-wallet"
            preferredWallets={["Sui Wallet"]}
          >
            <BalanceProvider>
              <main
                className={`min-h-screen w-screen`}
                style={{
                  backgroundImage: "url('/general/background.svg')",
                  backgroundSize: "cover",
                  backgroundPositionX: "center",
                  backgroundPositionY: "top",
                }}
              >
                <LargeScreenLayout>{children}</LargeScreenLayout>

                <Toaster
                  position="bottom-center"
                  toastOptions={{
                    duration: 5000,
                  }}
                />
              </main>
            </BalanceProvider>
          </WalletProvider>
        </SuiClientProvider>
      </EnokiFlowProvider>
    </QueryClientProvider>
  );
};
