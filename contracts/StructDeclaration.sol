//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.7;

struct HeroAttributes {
    uint256 characterIndex;
    string name;
    string imageURI;
    uint256 hp;
    uint256 maxHp;
    uint256 attackDamage;
    bool revived;
}

struct Enemy {
    string name;
    string imageURI;
    uint256 hp;
    uint256 maxHp;
    uint256 attackDamage;
}

struct Player {
    address user;
    HeroAttributes hero;
}
