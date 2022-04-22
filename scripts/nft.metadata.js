const heroesMetaData = {
  names: [
    "Sansa Stark",
    "Cersei Lannister",
    "Jaime Lannister",
    "Tormund Giantsbane",
    "Tyrion Lannister",
    "The Hound",
    "Sam Tarly",
  ],
  images: [
    "QmfW115Xwps7LNRv6nqx4W65arQWYRWCcnFdvuwpPB5sKD",
    "QmWGhFHgPXhpDPUtYRvMKZH2hjRmpeSqiXii4pzJKXvwJQ",
    "QmWM9pFUqSULe6S1xYemHFKzwrpYQWJZwvVxb7QA8NvhDL",
    "QmUNy5wvvMEYgEGpkqMJxeMiVgrGRshyF2x5zqWQGYuicH",
    "QmXQsztERACsKYkhozaKnksbhLVTuvrNSsj3KuJWRMf85U",
    "QmYKzFPtPBoSyWto8kxNBioSTBmCpRzt9TwGrpVzBKqipc",
    "Qmf1Uvhji8bBZHCuwvM8xyAFZb5NXz75dHzzg9pRZAxnbh",
  ],

  hps: [100, 90, 130, 135, 110, 150, 120],
  damages: [50, 70, 80, 85, 60, 120, 60],
};

const enemyMetaData = {
  name: "Halo",
  image: "QmSSmzSu61e5tMyLCH3cBoEc21hjHh3BoNdmPSVMR4Qcmn",
  hp: 10000,
  damage: 25,
};

const defaultMetaData = {
  heroes: heroesMetaData,
  enemy: enemyMetaData,
};

module.exports = { defaultMetaData };
