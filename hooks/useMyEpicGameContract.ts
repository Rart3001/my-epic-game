import MyEpicGame from "../utils/MyEpicGame.json";

import { useContract, useProvider, useSigner } from "wagmi";
import { CONTRACT_ADDRESS } from "../utils/constants";

const useMyEpicGameContract = (writeMode: boolean = false) => {
  const provider = useProvider();
  const [signer] = useSigner();
  let signerOrProvider: any = provider;
  if (writeMode === true) {
    signerOrProvider = signer.data;
  }

  return useContract({
    addressOrName: CONTRACT_ADDRESS,
    contractInterface: MyEpicGame.abi,
    signerOrProvider: signerOrProvider,
  });
};

export default useMyEpicGameContract;
