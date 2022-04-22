//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract ChainLinkPriceConsumer {
    AggregatorV3Interface internal immutable priceFeed;

    constructor(address _priceFeed) {
        priceFeed = AggregatorV3Interface(_priceFeed);
    }

    function getLastestPrice() internal view returns (int256) {
        (, int256 price, , , ) = priceFeed.latestRoundData();
        return price;
    }
}
