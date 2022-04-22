import Image from "next/image";
import React from "react";

interface CharacterProps {
  character: {
    id: number;
    name: string;
    imageURI: string;
    hp: number;
    maxHp: number;
    attackDamage: number;
    revived: boolean;
  };
  mintAction: Function;
}

const Character: React.FunctionComponent<CharacterProps> = ({
  character,
  mintAction,
}) => {
  return (
    <div className="character-item" key={character.name}>
      <div className="name-container">
        <p>{character.name}</p>
      </div>
      <Image
        unoptimized={true}
        src={`https://cloudflare-ipfs.com/ipfs/${character.imageURI}`}
        alt={character.name}
        width={200}
        height={200}
      />
      <button
        type="button"
        className="character-mint-button"
        onClick={() => mintAction()}
      >{`Mint ${character.name}`}</button>
    </div>
  );
};

export default Character;
