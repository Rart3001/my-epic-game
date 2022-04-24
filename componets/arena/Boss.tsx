import Image from "next/image";
import React from "react";

interface BossProps {
  boss: {
    id: number;
    name: string;
    imageURI: string;
    hp: number;
    maxHp: number;
    attackDamage: number;
    revived: boolean;
  };
  isAttacking: boolean;
}

const Boss: React.FunctionComponent<BossProps> = ({ boss, isAttacking }) => {
  return (
    <div className="boss-container">
      <h2>The Boss</h2>
      <div className={`boss-content ${isAttacking ? "attacking" : ""}`}>
        <h2>🔥 {boss?.name} 🔥</h2>
        <div className="image-content">
          <Image
            unoptimized={true}
            src={`https://cloudflare-ipfs.com/ipfs/${boss?.imageURI}`}
            alt={`Boss ${boss?.name}`}
            width={600}
            height={600}
          />
          <div className="health-bar">
            <progress value={boss?.hp} max={boss?.maxHp} />
            <p>{`${boss?.hp} / ${boss?.maxHp} HP`}</p>
          </div>
        </div>
        <div className="stats">
          <h4>{`⚔️ Attack Damage: ${boss?.attackDamage}`}</h4>
        </div>
      </div>
    </div>
  );
};

export default Boss;
