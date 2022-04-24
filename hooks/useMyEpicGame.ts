import { useAccount, useContractEvent, useContractWrite } from "wagmi";
import { BigNumber } from "ethers";
import { useMutation, useQuery, useQueryClient } from "react-query";
import useMyEpicGameContract from "./useMyEpicGameContract";
import Mapper from "../utils/mapper";

import MyEpicGame from "../utils/MyEpicGame.json";
import { CONTRACT_ADDRESS } from "../utils/constants";

const contractConf = {
  addressOrName: CONTRACT_ADDRESS,
  contractInterface: MyEpicGame.abi,
};

const useGetAllDefaultCharacters = () => {
  const contract = useMyEpicGameContract();
  return useQuery("characters", () => {
    return contract.getAllDefaultCharacters();
  });
};

const useGetAllPlayers = () => {
  const contract = useMyEpicGameContract();
  return useQuery("players", async () => {
    const data = await contract.getAllPlayer();
    const filterData = data.filter(
      (e: any) => e.user != "0x0000000000000000000000000000000000000000"
    );
    return filterData.map((e: any) => Mapper.transformPlayerData(e));
  });
};

const useGetBigBoss = () => {
  const contract = useMyEpicGameContract();
  return useQuery("bigBoss", () => {
    return contract.getBigBoss();
  });
};

declare type UseMintCharacterNFTParams = {
  characterId: number;
};
const useMintCharacterNFT = () => {
  const contract = useMyEpicGameContract(true);
  const [{ data: accountData }] = useAccount();
  const queryClient = useQueryClient();
  return useMutation(async (param: UseMintCharacterNFTParams) => {
    const txt = await contract.mintCharacterNFT(
      BigNumber.from(param.characterId)
    );
    await txt.wait();
    queryClient.invalidateQueries(["checkIfUserHasNFT", accountData?.address]);
  });
};

const useCheckIfUserHasNFT = () => {
  return useContractWrite(contractConf, "checkIfUserHasNFT");
};

const useAttackBoss = () => {
  const contract = useMyEpicGameContract(true);
  return useMutation(async () => {
    const txt = await contract.attackBoss();
    await txt.wait();
  });
};

const useToRevive = () => {
  const contract = useMyEpicGameContract(true);
  return useMutation(async () => {
    const txt = await contract.toRevive();
    await txt.wait();
  });
};

interface OnCharacterNFTMintedCallback {
  (address: string, tokenId: BigNumber, characterIndex: BigNumber): void;
}

const useOnCharacterNFTMinted = (callback: OnCharacterNFTMintedCallback) => {
  useContractEvent(contractConf, "CharacterNFTMinted", (event) =>
    callback(event[0], event[1], event[2])
  );
};

interface AttackCompleteCallback {
  (newBossHp: BigNumber, newPlayerHp: BigNumber): void;
}

const useOnAttackComplete = (callback: AttackCompleteCallback) => {
  return useContractEvent(contractConf, "AttackComplete", (event) =>
    callback(event[0], event[1])
  );
};

interface CharacterRevivedCallback {
  (address: string, tokenId: BigNumber, newHp: BigNumber): void;
}

const useOnCharacterRevived = (callback: CharacterRevivedCallback) => {
  return useContractEvent(contractConf, "CharacterRevived", (event) =>
    callback(event[0], event[1], event[3])
  );
};

interface HeroCriticalHitCallback {
  (address: string, tokenId: BigNumber): void;
}

const useOnHeroCriticalHit = (callback: HeroCriticalHitCallback) => {
  useContractEvent(contractConf, "HeroCriticalHit", (event) =>
    callback(event[0], event[1])
  );
};

interface BossMissAttackCallback {
  (address: string, tokenId: BigNumber): void;
}

const useOnBossMissAttack = (callback: BossMissAttackCallback) => {
  useContractEvent(contractConf, "BossMissAttack", (event) =>
    callback(event[0], event[1])
  );
};

export {
  useGetAllDefaultCharacters,
  useGetAllPlayers,
  useGetBigBoss,
  useMintCharacterNFT,
  useCheckIfUserHasNFT,
  useAttackBoss,
  useToRevive,
  useOnCharacterNFTMinted,
  useOnAttackComplete,
  useOnCharacterRevived,
  useOnHeroCriticalHit,
  useOnBossMissAttack,
};
