import { task } from "hardhat/config";
import type { HardhatRuntimeEnvironment } from "hardhat/types";
import { getContractAddress } from "../../helpers/contractJsonHelper";

/**
 * Task to retrieve detailed information about a specific user
 * This task returns initialization status, points balance, and owner address
 * for the specified user ID
 *
 * Parameters:
 * - userId: The ID of the user to query
 */
task("oto:getUserInfo", "Get detailed information about a user")
  .addParam("userId", "The ID of the user to query")
  .setAction(async (taskArgs, hre: HardhatRuntimeEnvironment) => {
    console.log(
      "################################### [START] ###################################",
    );

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

    // Create Contract instance (read-only is sufficient for this task)
    const oto = await hre.viem.getContractAt(
      "Oto",
      contractAddress as `0x${string}`,
    );

    try {
      console.log(`Retrieving information for user ID: ${taskArgs.userId}`);

      // Call getUserInfo method
      const userInfo = await oto.read.getUserInfo([taskArgs.userId]);

      console.log(`\nUser information:`);
      console.log(`- User ID: ${taskArgs.userId}`);
      console.log(`- Initialized: ${userInfo[0]}`);
      console.log(`- Points: ${userInfo[1].toString()}`);
      console.log(`- Owner: ${userInfo[2]}`);

      // If user is initialized, get token balance of the owner
      if (userInfo[0]) {
        const ownerBalance = await oto.read.balanceOf([userInfo[2]]);
        const decimals = await oto.read.decimals();
        console.log(
          `\nOwner's token balance: ${ownerBalance / 10n ** BigInt(decimals)} OTO`,
        );
      }
    } catch (error) {
      console.error("Error retrieving user information:");
      console.error(error);
    }

    console.log(
      "################################### [END] ###################################",
    );
  });
