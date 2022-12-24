require("@nomiclabs/hardhat-waffle");

// https://eth-goerli.g.alchemy.com/v2/Rg-k1iOVrLFdQeuci4GcgHSHZXzG-1eT

module.exports = {
  solidity: "0.8.0",
  networks: {
    goerli: {
      url: "https://eth-goerli.alchemyapi.io/v2/Rg-k1iOVrLFdQeuci4GcgHSHZXzG-1eT",
      accounts: [
        `f8199f89f18b5dfcdfd45bb0893fce783b23e10cfd065f144ff6392efc5df377`,
      ],
    },
  },
};
