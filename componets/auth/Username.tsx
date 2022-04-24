import * as React from "react";
import { useEnsLookup } from "wagmi";
import { Col, Row } from "reactstrap";
import Avatar from "@davatar/react/dist/Image";
import { constants } from "ethers";
import CurrentChain from "../chains/CurrentChain";
const truncateMiddle = require("truncate-middle");

interface UsernameProps {
  address: string;
}

const Username: React.FunctionComponent<UsernameProps> = ({ address }) => {
  const [query] = useEnsLookup({ address });
  return (
    <div className="act-buttons">
      <Row>
        <Col>
          <Avatar size={48} address={address || constants.AddressZero} />
        </Col>
        <Col>
          <code>
            {query.data || truncateMiddle(address || "", 5, 4, "...")}
          </code>
          <CurrentChain />
        </Col>
      </Row>
    </div>
  );
};

export default Username;
