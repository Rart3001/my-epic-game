import { BigNumber } from "ethers";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Col, Container, Row, Spinner } from "reactstrap";
const truncateMiddle = require("truncate-middle");
import {
  useAttackBoss,
  useGetBigBoss,
  useOnAttackComplete,
  useOnBossMissAttack,
  useOnHeroCriticalHit,
} from "../../hooks/useMyEpicGame";
import Mapper from "../../utils/mapper";
import Boss from "./Boss";
import Hero from "./Hero";

interface ArenaProps {
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

const Arena: React.FunctionComponent<ArenaProps> = ({
  hero,
  setPlayerHero,
}) => {
  const [boss, setBoss] = useState<any>(null);
  const { isLoading: isLoadingBoss, data: bossData } = useGetBigBoss();
  const attackBossAction = useAttackBoss();

  const runAttackBossAction = async () => {
    try {
      await attackBossAction.mutateAsync();
    } catch (error: any) {
      toast.error(error?.message);
    }
  };

  useOnAttackComplete((newBossHp: BigNumber, newPlayerHp: BigNumber) => {
    toast(
      `💥 Attack Finished: Boss Health: ${newBossHp} and Player Health: ${newPlayerHp}`
    );
    setBoss((prevState: any) => {
      return { ...prevState, hp: newBossHp?.toNumber() };
    });
    setPlayerHero((prevState: any) => {
      return { ...prevState, hp: newPlayerHp?.toNumber() };
    });
  });

  useOnHeroCriticalHit((address: string, _tokenId: BigNumber) =>
    toast(
      `💪 ${truncateMiddle(
        address || "",
        5,
        4,
        "..."
      )} User's Hero hit a critical attack! 💪`
    )
  );
  useOnBossMissAttack((address: string, _tokenId: BigNumber) =>
    toast(
      `🏃🏻💨 ${truncateMiddle(
        address || "",
        5,
        4,
        "..."
      )} User's Hero avoid boss attack ! 🏃🏻💨`
    )
  );

  useEffect(() => {
    if (!!bossData?.name && !boss) {
      setBoss(Mapper.transformCharacterData(bossData));
    }
  }, [boss, bossData]);

  const loadingIndicator = (msg: string) => (
    <Container fluid={true}>
      <br />
      <Spinner size="xl" color="warning" />
      <h5 style={{ color: "white" }}>{msg}</h5>
    </Container>
  );

  const attackButton = (
    <div className="arena-container">
      <div className="attack-container">
        <button className="cta-button" onClick={() => runAttackBossAction()}>
          {`💥 Attack ${boss?.name}`}
        </button>
      </div>
    </div>
  );

  if (isLoadingBoss) {
    return loadingIndicator("Preparing the Arena for the battle...");
  }

  return (
    <Container>
      <Row>
        <Col>
          <Boss boss={boss} isAttacking={attackBossAction.isLoading} />
        </Col>
        <Col className="center">
          {attackBossAction.isLoading
            ? loadingIndicator("Attacking...")
            : attackButton}
        </Col>
        <Col>
          <Hero hero={hero} />
        </Col>
      </Row>
    </Container>
  );
};

export default Arena;
