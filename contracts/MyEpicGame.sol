//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "./libraries/IterableMapping.sol";
import "./libraries/Base64.sol";
import "./libraries/ChainLinkRandomNumberConsumer.sol";

import "./StructDeclaration.sol";

import "hardhat/console.sol";

contract MyEpicGame is ERC721 {
    using SafeMath for uint256;
    HeroAttributes[] defaultHeroesAttributes;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    mapping(uint256 => HeroAttributes) public nftHolderAttributes;
    Enemy public bigBoss;
    uint64 private subscriptionId;
    uint256 private seed;

    // Ref: https://solidity-by-example.org/app/iterable-mapping/
    using IterableMapping for IterableMapping.Map;
    IterableMapping.Map private players;

    event CharacterNFTMinted(
        address sender,
        uint256 tokenId,
        uint256 characterIndex
    );
    event AttackComplete(uint256 newBossHp, uint256 newPlayerHp);
    event CharacterRevived(address sender, uint256 tokenId, uint256 newHp);
    event HeroCriticalHit(address sender, uint256 tokenId);
    event BossMissAttack(address sender, uint256 tokenId);

    constructor(
        string[] memory characterNames,
        string[] memory characterImagesURIs,
        uint256[] memory characterHp,
        uint256[] memory characterAttackDmg,
        string memory bossName,
        string memory bossImageURI,
        uint256 bossHp,
        uint256 bossAttackDamage
    ) ERC721("Game of Thrones Heroes", "GOTHERO") {
        bigBoss = _buildBigBoss(
            bossName,
            bossImageURI,
            bossHp,
            bossAttackDamage
        );

        _buildDefaultHeroesAttributes(
            characterNames,
            characterImagesURIs,
            characterHp,
            characterAttackDmg
        );

        _tokenIds.increment();
        players.set(address(0), 0);
        subscriptionId = 2771;
        seed = (block.timestamp + block.difficulty) % 100;
    }

    function mintCharacterNFT(uint256 _characterIndex) external {
        uint256 newCharacterId = _tokenIds.current();
        _safeMint(msg.sender, newCharacterId);
        nftHolderAttributes[newCharacterId] = _buildNewCharacterFromDefault(
            newCharacterId,
            _characterIndex
        );
        console.log(
            "Minted NFT w/ tokenId %s and characterIndex %s",
            newCharacterId,
            _characterIndex
        );
        players.set(msg.sender, newCharacterId);
        _tokenIds.increment();
        emit CharacterNFTMinted(msg.sender, newCharacterId, _characterIndex);
    }

    function _buildNewCharacterFromDefault(
        uint256 _newCharacterId,
        uint256 _characterIndex
    ) private view returns (HeroAttributes memory) {
        return
            HeroAttributes({
                characterIndex: _newCharacterId,
                name: defaultHeroesAttributes[_characterIndex].name,
                imageURI: defaultHeroesAttributes[_characterIndex].imageURI,
                hp: defaultHeroesAttributes[_characterIndex].hp,
                maxHp: defaultHeroesAttributes[_characterIndex].maxHp,
                attackDamage: defaultHeroesAttributes[_characterIndex]
                    .attackDamage,
                revived: false
            });
    }

    function tokenURI(uint256 _tokenId)
        public
        view
        override
        returns (string memory)
    {
        HeroAttributes memory heroAttributes = nftHolderAttributes[_tokenId];
        string memory stringHp = Strings.toString(heroAttributes.hp);
        string memory stringMaxHp = Strings.toString(heroAttributes.maxHp);
        string memory stringAttackDamage = Strings.toString(
            heroAttributes.attackDamage
        );
        string memory stringRevived = heroAttributes.revived ? "true" : "false";
        string memory json = Base64.encode(
            abi.encodePacked(
                '{"name": "',
                heroAttributes.name,
                " -- NFT #: ",
                Strings.toString(_tokenId),
                '", "description": "This is an NFT that lets people play in the game Metaverse Game of Thrones Heroes!", "image": "ipfs://',
                heroAttributes.imageURI,
                '", "attributes": [ { "trait_type": "Health Points", "value": ',
                stringHp,
                ', "max_value":',
                stringMaxHp,
                '}, { "trait_type": "Attack Damage", "value": ',
                stringAttackDamage,
                '}, { "trait_type": "Revived", "value": ',
                stringRevived,
                "}]}"
            )
        );

        string memory output = string(
            abi.encodePacked("data:application/json;base64,", json)
        );

        return output;
    }

    function _buildBigBoss(
        string memory bossName,
        string memory bossImageURI,
        uint256 bossHp,
        uint256 bossAttackDamage
    ) private pure returns (Enemy memory) {
        return
            Enemy({
                name: bossName,
                imageURI: bossImageURI,
                hp: bossHp,
                maxHp: bossHp,
                attackDamage: bossAttackDamage
            });
    }

    function _buildDefaultHeroesAttributes(
        string[] memory characterNames,
        string[] memory characterImagesURIs,
        uint256[] memory characterHp,
        uint256[] memory characterAttackDmg
    ) private {
        for (uint256 i = 0; i < characterNames.length; i += 1) {
            defaultHeroesAttributes.push(
                HeroAttributes({
                    characterIndex: i,
                    name: characterNames[i],
                    imageURI: characterImagesURIs[i],
                    hp: characterHp[i],
                    maxHp: characterHp[i],
                    attackDamage: characterAttackDmg[i],
                    revived: false
                })
            );
            HeroAttributes memory hero = defaultHeroesAttributes[i];
            console.log(
                "Done initializing %s w/ HP %s, img %s",
                hero.name,
                hero.hp,
                hero.imageURI
            );
        }
    }

    function attackBoss() public {
        uint256 tokenId = players.get(msg.sender);
        HeroAttributes storage currentHero = nftHolderAttributes[tokenId];
        console.log(
            "\nPlayer w/ character %s about to attack. Has %s HP and %s AD",
            currentHero.name,
            currentHero.hp,
            currentHero.attackDamage
        );
        console.log(
            "Boss %s has %s HP and %s AD",
            bigBoss.name,
            bigBoss.hp,
            bigBoss.attackDamage
        );
        require(currentHero.hp > 0, "Error: Your hero is death!");
        require(bigBoss.hp > 0, "Error: The Boss already defeated!");

        seed = (block.difficulty + block.timestamp + seed) % 100;
        console.log("Random # generated: %d", seed);

        uint256 heroAttackDamage = currentHero.attackDamage;

        if (seed < 5) {
            console.log("Critical hit");
            heroAttackDamage = currentHero.attackDamage.mul(2);
            emit HeroCriticalHit(msg.sender, tokenId);
        }

        if (bigBoss.hp < heroAttackDamage) {
            bigBoss.hp = 0;
        } else {
            bigBoss.hp = bigBoss.hp - heroAttackDamage;
        }

        if (seed > 5 && seed < 20) {
            console.log(
                "boss's attack 'misses' and the player gets away lucky!"
            );
            emit BossMissAttack(msg.sender, tokenId);
        } else {
            if (currentHero.hp < bigBoss.attackDamage) {
                currentHero.hp = 0;
            } else {
                currentHero.hp = currentHero.hp - bigBoss.attackDamage;
            }
        }

        console.log("Player attacked boss. New boss hp: %s", bigBoss.hp);
        console.log(
            "Boss attacked player. New player hp: %s\n",
            currentHero.hp
        );
        emit AttackComplete(bigBoss.hp, currentHero.hp);
    }

    function checkIfUserHasNFT() public view returns (HeroAttributes memory) {
        uint256 tokenId = players.get(msg.sender);
        if (tokenId > 0) {
            return nftHolderAttributes[tokenId];
        } else {
            HeroAttributes memory emptyStruct;
            return emptyStruct;
        }
    }

    function getAllDefaultCharacters()
        public
        view
        returns (HeroAttributes[] memory)
    {
        return defaultHeroesAttributes;
    }

    function getBigBoss() public view returns (Enemy memory) {
        return bigBoss;
    }

    function getAllPlayer() public view returns (Player[] memory) {
        Player[] memory list = new Player[](players.size());
        for (uint256 i = 1; i < players.size(); i++) {
            address _user = players.getKeyAtIndex(i);
            uint256 _nftId = players.get(_user);
            HeroAttributes memory _hero = nftHolderAttributes[_nftId];
            list[i - 1] = Player({user: _user, hero: _hero});
        }
        return list;
    }

    function toRevive() external {
        uint256 tokenIdToRevive = players.get(msg.sender);
        HeroAttributes storage hero = nftHolderAttributes[tokenIdToRevive];
        require(
            hero.revived == false,
            "You only can revive your hero one time!"
        );
        require(hero.hp == 0, "The hero has to be Dead!");
        uint256 newHp = hero.maxHp.div(2);
        hero.hp = newHp;
        hero.revived = true;
        hero.attackDamage = hero.attackDamage.mul(2);
        console.log("Player was revived. New  hp: %s", hero.hp);

        emit CharacterRevived(msg.sender, tokenIdToRevive, newHp);
    }
}
