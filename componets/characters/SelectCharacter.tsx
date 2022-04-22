import React, { useCallback, useEffect, useState } from "react";
import {
  useGetAllDefaultCharacters,
  useMintCharacterNFT,
  useOnCharacterNFTMinted,
} from "../../hooks/useMyEpicGame";
import { Col, Container, Row, Spinner } from "reactstrap";
import Mapper from "../../utils/mapper";
import Image from "next/image";
import toast from "react-hot-toast";
import { BigNumber } from "ethers";
import { CONTRACT_ADDRESS } from "../../utils/constants";
import Character from "./Character";

interface SelectCharacterProps {}

const SelectCharacter: React.FunctionComponent<SelectCharacterProps> = () => {
  const [characters, setCharacters] = useState<Array<any>>([]);
  const { isLoading, data } = useGetAllDefaultCharacters();
  const mintAction = useMintCharacterNFT();

  const runMintAction = async (characterId: number) => {
    try {
      await mintAction.mutateAsync({
        characterId: characterId,
      });
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const renderCharacters = () =>
    characters.map((character, index) => (
      <Character
        key={character.name}
        character={character}
        mintAction={() => runMintAction(index)}
      />
    ));

  const onCharacterMint = useCallback(
    (sender: string, tokenId: BigNumber, characterIndex: BigNumber) => {
      console.log(
        `CharacterNFTMinted - sender: ${sender} tokenId: ${tokenId.toNumber()} characterIndex: ${characterIndex.toNumber()}`
      );

      toast(() => (
        <span>
          ✅ Your <b>NFT</b> is all done!
          <br />
          <a
            href={`https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`}
            target="_blank"
            rel="noreferrer"
          >
            View en opensea
          </a>
        </span>
      ));
    },
    []
  );

  useOnCharacterNFTMinted(onCharacterMint);

  useEffect(() => {
    if (data && characters.length == 0) {
      const _characters = data.map((characterData: any) =>
        Mapper.transformCharacterData(characterData)
      );
      setCharacters(_characters);
    }
  }, [characters.length, data]);

  const loadingIndicator = (msg: string) => (
    <Container fluid={true}>
      <br />
      <Spinner size="xl" color="warning" />
      <h5 style={{ color: "white" }}>{msg}</h5>
    </Container>
  );

  const renderContent = () => {
    if (isLoading) {
      return loadingIndicator("Loading Heros...");
    }

    if (mintAction.isLoading) {
      return (
        <Container>
          <Row>
            <Col>
              <Image
                unoptimized={true}
                src="https://media2.giphy.com/media/61tYloUgq1eOk/giphy.gif?cid=ecf05e47dg95zbpabxhmhaksvoy8h526f96k4em0ndvx078s&rid=giphy.gif&ct=g"
                alt="Minting loading indicator"
                height={200}
                width={200}
              />
            </Col>
          </Row>
          <Row>
            <Col>{loadingIndicator("Miting you new Hero...")}</Col>
          </Row>
        </Container>
      );
    }

    return (
      <div className="select-character-container">
        <br />
        <h2>Mint Your Hero. Choose wisely.</h2>
        <br />
        <br />
        <div className="character-grid">{renderCharacters()}</div>
      </div>
    );
  };

  return renderContent();
};

export default SelectCharacter;
