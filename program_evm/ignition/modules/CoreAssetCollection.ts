import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const CoreAssetCollectionModule = buildModule(
  "CoreAssetCollectionModule",
  (m) => {
    // get wallet address (owner address of NFT)
    const account = m.getAccount(0);

    const nft = m.contract("CoreAssetCollection", [account]);

    return { nft };
  },
);

export default CoreAssetCollectionModule;
