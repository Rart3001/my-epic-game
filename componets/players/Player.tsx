import * as React from "react";
import { useEnsLookup } from "wagmi";
import { Col, Container, Row } from "reactstrap";
import Avatar from "@davatar/react/dist/Image";
import { constants } from "ethers";
import CurrentChain from "../chains/CurrentChain";
const truncateMiddle = require("truncate-middle");

interface PlayerProps {
  user: string;
}

const Player: React.FunctionComponent<PlayerProps> = ({ user }) => {
  const [query] = useEnsLookup({ address: user });
  return (
    <Container>
      <Row>
        <Col>
          <Avatar size={32} address={user || constants.AddressZero} />
        </Col>
        <Col>
          <code>{query.data || truncateMiddle(user || "", 5, 4, "...")}</code>
        </Col>
      </Row>
    </Container>
  );
};

export default Player;
