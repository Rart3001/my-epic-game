import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import { useAccount } from "wagmi";
import AuthButton from "../componets/auth/AuthButton";
import SelectCharacter from "../componets/characters/SelectCharacter";
import Arena from "../componets/arena/Arena";

import styles from "../styles/Home.module.css";
import banner from "../public/banner.gif";
import twitterLogo from "../public/twitter-logo.svg";

import { Col, Container, Row, Spinner } from "reactstrap";
import { useCheckIfUserHasNFT } from "../hooks/useMyEpicGame";
import { useCallback, useEffect, useState } from "react";
import Mapper from "../utils/mapper";

const TWITTER_HANDLE = "_buildspace";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const Home: NextPage = () => {
  const [{ data: accountData }] = useAccount();
  const [playerHero, setPlayerHero] = useState<any>();
  const [{ error, loading: isCheckingPlayer }, write] = useCheckIfUserHasNFT();

  const checkPlayer = useCallback(async () => {
    const result = await write();
    setPlayerHero(Mapper.transformCharacterData(result.data));
  }, [write]);

  useEffect(() => {
    if (!!accountData?.address && !playerHero) {
      checkPlayer();
    }
  }, [accountData, checkPlayer, playerHero]);

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  const bannerContent = (
    <Container>
      <br />
      <Row>
        <Col>
          <Image src={banner} alt="Batle" />
        </Col>
      </Row>
      <Row>
        <Col style={{ color: "white" }}>Connect Wallet To Get Started</Col>
      </Row>
    </Container>
  );

  const loadingIndicator = (
    <Container fluid={true}>
      <br />
      <Spinner size="xl" color="warning" />
      <h5 style={{ color: "white" }}>Checking player character...</h5>
    </Container>
  );

  const remderContent = () => {
    if (accountData) {
      if (isCheckingPlayer) {
        return loadingIndicator;
      }
      if (!!playerHero?.name) {
        return <Arena hero={playerHero} setPlayerHero={setPlayerHero} />;
      }

      return <SelectCharacter />;
    } else {
      return bannerContent;
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Game of Thrones Heroes</title>
        <meta name="description" content="Fighting to bring back the throne" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <>
          <h1 className={styles.title}>
            ⚔️ Metaverse <a href="#">Game of Thrones Heroes</a> ⚔️
          </h1>
          <p className={styles.description}>
            ¡Fighting to bring back the throne!
          </p>
          <AuthButton />
          {remderContent()}
        </>
      </main>

      <footer className={styles.footer}>
        <Image
          unoptimized={true}
          alt="Twitter Logo"
          className="twitter-logo"
          src={twitterLogo}
          width={50}
          height={50}
        />
        <a
          className="footer-text"
          href={TWITTER_LINK}
          target="_blank"
          rel="noreferrer"
        >{`built with @${TWITTER_HANDLE}`}</a>
      </footer>
      <Toaster />
    </div>
  );
};

export default Home;
