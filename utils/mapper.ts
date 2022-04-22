export default class Mapper {
  static transformCharacterData(characterData: any) {
    return {
      id: characterData?.characterIndex,
      name: characterData?.name,
      imageURI: characterData?.imageURI,
      hp: characterData?.hp?.toNumber(),
      maxHp: characterData?.maxHp?.toNumber(),
      attackDamage: characterData?.attackDamage?.toNumber(),
      revived: characterData?.revived,
    };
  }

  static transformPlayerData(playerData: any) {
    return {
      user: playerData?.user,
      hero: Mapper.transformCharacterData(playerData?.hero),
    };
  }
}
