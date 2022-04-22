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
