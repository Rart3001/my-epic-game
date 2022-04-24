import { BigNumber } from "ethers";
import Image from "next/image";
import React from "react";
import toast from "react-hot-toast";
import { Container, Spinner } from "reactstrap";
import { useOnCharacterRevived, useToRevive } from "../../hooks/useMyEpicGame";
const truncateMiddle = require("truncate-middle");

interface HeroProps {
  hero: {
    id: number;
    name: string;
    imageURI: string;
    hp: number;
    maxHp: number;
    attackDamage: number;
    revived: boolean;
  };
  setPlayerHero: Function;
}

const Hero: React.FunctionComponent<HeroProps> = ({ hero, setPlayerHero }) => {
  const reviveAction = useToRevive();

  useOnCharacterRevived(
    (address: string, _tokenId: BigNumber, newHp: BigNumber) => {
      toast(
        `🌤️  The user ${truncateMiddle(
          address || "",
          5,
          4,
          "..."
        )} revived his hero. 🌤️ `
      );
      setPlayerHero((prevState: any) => {
        return { ...prevState, hp: newHp?.toNumber(), revived: true };
      });
    }
  );

  const runReviveAction = async () => {
    try {
      await reviveAction.mutateAsync();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const ripMsg = hero?.hp === 0 ? <h2>🪦 RIP 🪦</h2> : <></>;
  const revivedMsg =
    hero?.revived === true && hero?.hp > 0 ? <h2>🫀 REVIVED 🫀</h2> : <></>;

  const reviveButton =
    hero?.hp === 0 && hero?.revived === false ? (
      <button className="rivevi-button" onClick={() => runReviveAction()}>
        {`🌤️  Hope - Revive your hero! 🌤️`}
      </button>
    ) : (
      <></>
    );

  const loadingIndicator = (msg: string) => (
    <Container fluid={true}>
      <br />
      <Spinner size="xl" color="warning" />
      <h5 style={{ color: "white" }}>{msg}</h5>
    </Container>
  );

  return (
    <div className="players-container">
      <div
        className={`player-container ${
          reviveAction.isLoading ? "revived" : ""
        }`}
      >
        <h2>Your Character</h2>
        <div className={hero?.hp === 0 ? "player-death" : "player"}>
          <div className="image-content">
            <h2>{hero?.name}</h2>
            {ripMsg}
            {revivedMsg}
            <Image
              unoptimized={true}
              src={`https://cloudflare-ipfs.com/ipfs/${hero?.imageURI}`}
              alt={`Character ${hero?.name}`}
              width={450}
              height={450}
            />
            <div className="health-bar">
              <progress value={hero?.hp} max={hero?.maxHp} />
              <p>{`${hero?.hp} / ${hero?.maxHp} HP`}</p>
            </div>
          </div>
          <div className="stats">
            <h4>{`⚔️ Attack Damage: ${hero?.attackDamage}`}</h4>
          </div>
          <div>
            {reviveAction.isLoading
              ? loadingIndicator("Reviving...")
              : reviveButton}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
