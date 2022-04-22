import "../styles/globals.css";
import "../styles/select-charaters.css";
import "../styles/arena.css";
import "bootstrap/dist/css/bootstrap.css";
import type { AppProps } from "next/app";
import { WagmiProvider, defaultChains, InjectedConnector } from "wagmi";
import { providers } from "ethers";
import toast from "react-hot-toast";
import { QueryCache, QueryClient, QueryClientProvider } from "react-query";

const defaultChain = providers.getNetwork(4);
const rinkebyProvider = providers.getDefaultProvider(defaultChain);
const connector = new InjectedConnector({
  chains: [...defaultChains],
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
  queryCache: new QueryCache({
    onError: (_error: any) => {
      console.log(_error);
      toast.error(_error.message);
    },
  }),
});

function _App({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider
      autoConnect
      connectors={[connector]}
      provider={rinkebyProvider}
    >
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />{" "}
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default _App;
