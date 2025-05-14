import { task } from "hardhat/config";
import type { HardhatRuntimeEnvironment } from "hardhat/types";
import { getContractAddress } from "../../helpers/contractJsonHelper";

/**
 * Task to update the core asset collection address
 * This task allows the contract owner to change the address of the core asset collection
 *
 * Parameters:
 * - address: The new address for the core asset collection
 */
task(
  "oto:updateCoreAssetCollection",
  "Update the core asset collection address (admin only)",
)
  .addParam("address", "The new address for the core asset collection")
  .setAction(async (taskArgs, hre: HardhatRuntimeEnvironment) => {
    console.log(
      "################################### [START] ###################################",
    );

    // Get wallet client
    const [walletClient] = await hre.viem.getWalletClients();

    const publicClient = await hre.viem.getPublicClient();
    // Get chain ID
    const chainId = (await publicClient.getChainId()).toString();
    // Get contract name
    const contractName = "OtoModule#Oto";
    // Get contract address
    const contractAddress = getContractAddress(chainId, contractName);

    if (!contractAddress) {
      console.error(`Contract ${contractName} not found on chain ${chainId}`);
      return;
    }

    console.log(`${contractName} contract address: ${contractAddress}`);

    // Create Contract instance
    const oto = await hre.viem.getContractAt(
      "Oto",
      contractAddress as `0x${string}`,
      {
        client: { wallet: walletClient },
      },
    );

    try {
      // Get current core asset collection
      const currentCollection = await oto.read.coreAssetCollection();
      console.log(`Current core asset collection: ${currentCollection}`);

      // New collection address
      console.log(`New core asset collection address: ${taskArgs.address}`);

      // Call updateCoreAssetCollection method
      const tx = await oto.write.updateCoreAssetCollection([taskArgs.address]);
      console.log(`Transaction submitted: ${tx}`);

      // Wait for transaction receipt
      const receipt = await publicClient.waitForTransactionReceipt({
        hash: tx,
      });
      console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
      console.log(
        `Status: ${receipt.status === "success" ? "Success" : "Failed"}`,
      );

      // Get updated core asset collection
      const newCollection = await oto.read.coreAssetCollection();
      console.log(`\nUpdated core asset collection: ${newCollection}`);
      console.log(
        `Verification: ${newCollection === taskArgs.address ? "Updated successfully" : "Update failed"}`,
      );
    } catch (error) {
      console.error("Error updating core asset collection:");
      console.error(error);
    }

    console.log(
      "################################### [END] ###################################",
    );
  });
