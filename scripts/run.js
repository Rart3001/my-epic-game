const { defaultMetaData } = require("./nft.metadata");

const main = async () => {
  const gameContractFactory = await hre.ethers.getContractFactory("MyEpicGame");

  const gameContract = await gameContractFactory.deploy(
    defaultMetaData.heroes.names,
    defaultMetaData.heroes.images,
    defaultMetaData.heroes.hps,
    defaultMetaData.heroes.damages,
    defaultMetaData.enemy.name,
    defaultMetaData.enemy.image,
    defaultMetaData.enemy.hp,
    defaultMetaData.enemy.damage
  );
  await gameContract.deployed();
  console.log("Contract deployed to:", gameContract.address);
  console.log("Start minting ...");
  let transaction = await gameContract.mintCharacterNFT(1);
  await transaction.wait();

  transaction = await gameContract.checkIfUserHasNFT();
  console.log("UserHasNFT", transaction);

  transaction = await gameContract.attackBoss();
  await transaction.wait();

  transaction = await gameContract.attackBoss();
  await transaction.wait();

  transaction = await gameContract.attackBoss();
  await transaction.wait();

  try {
    transaction = await gameContract.attackBoss();
    await transaction.wait();

    transaction = await gameContract.attackBoss();
    await transaction.wait();
  } catch (error) {
    console.error(error);
  }

  try {
    transaction = await gameContract.toRevive();
    await transaction.wait();
  } catch (error) {
    console.error(error);
  }

  transaction = await gameContract.attackBoss();
  await transaction.wait();

  let mintedTokenMetadata = await gameContract.tokenURI(1);
  console.log("Token URI:", mintedTokenMetadata);

  const players = await gameContract.getAllPlayer();

  for (const element of players) {
    console.log("players.user ", element.user);
    console.log("players.hero ", element.hero.name);
  }
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
