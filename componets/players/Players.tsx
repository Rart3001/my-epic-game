import React from "react";
import { Col, Container, Row, Spinner } from "reactstrap";
import { useGetAllPlayers } from "../../hooks/useMyEpicGame";
import Player from "./Player";

interface PlayersProps {}

const Players: React.FunctionComponent<PlayersProps> = () => {
  const { isLoading, data: players } = useGetAllPlayers();
  console.log("players data", players);

  if (isLoading) {
    return (
      <Container fluid={true}>
        <br />
        <Spinner size="xl" color="warning" />
        <h5 style={{ color: "white" }}>Loading others players...</h5>
      </Container>
    );
  }

  const playersList = () =>
    players.map((p: any, index: number) => (
      <Row key={index}>
        <Col>
          <Player user={p.user} />
        </Col>
      </Row>
    ));

  return (
    <Container>
      <h2>Players</h2>
      {playersList()}
    </Container>
  );
};

export default Players;
