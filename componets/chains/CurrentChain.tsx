import React, { useState } from "react";
import { Tooltip } from "reactstrap";
import { useProvider } from "wagmi";

interface CurrentChainProps {}

const CurrentChain: React.FunctionComponent<CurrentChainProps> = () => {
  const provider = useProvider();
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const toggle = () => {
    setTooltipOpen(!tooltipOpen);
  };

  return (
    <div>
      <p id="activeChain">
        <span className="label" style={{ color: "white" }}>
          <small>
            {provider?.network?.chainId} - {provider?.network?.name}
          </small>
        </span>
      </p>
      <Tooltip
        placement="bottom"
        target="activeChain"
        isOpen={tooltipOpen}
        toggle={toggle.bind(null)}
      >
        Active Blockchain
      </Tooltip>
    </div>
  );
};
export default CurrentChain;
