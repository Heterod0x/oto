import { task } from "hardhat/config";
import type { HardhatRuntimeEnvironment } from "hardhat/types";
import { getContractAddress } from "../../helpers/contractJsonHelper";

/**
 * Task to update a user's points in the Oto contract
 * This task allows the contract owner to add points to a user's balance
 * 
 * Parameters:
 * - userId: The ID of the user whose points will be updated
 * - points: The number of points to add to the user's balance
 */
task("oto:updatePoint", "Update a user's points (admin only)")
  .addParam("userId", "The ID of the user")
  .addParam("points", "The number of points to add")
  .setAction(async (taskArgs, hre: HardhatRuntimeEnvironment) => {
    console.log("################################### [START] ###################################");

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

    // Get current user info to show points before update
    try {
      const userInfoBefore = await oto.read.getUserInfo([taskArgs.userId]);
      console.log(`\nCurrent user information:`);
      console.log(`- User ID: ${taskArgs.userId}`);
      console.log(`- Initialized: ${userInfoBefore[0]}`);
      console.log(`- Current Points: ${userInfoBefore[1].toString()}`);
      console.log(`- Owner: ${userInfoBefore[2]}`);

      // Convert points parameter to BigInt
      const pointsToAdd = BigInt(taskArgs.points);
      console.log(`\nAdding ${pointsToAdd} points to user ${taskArgs.userId}`);

      // Call updatePoint method
      const tx = await oto.write.updatePoint([taskArgs.userId, pointsToAdd]);
      console.log(`Transaction submitted: ${tx}`);
      
      // Wait for transaction receipt
      const receipt = await publicClient.waitForTransactionReceipt({ hash: tx });
      console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
      console.log(`Status: ${receipt.status === 'success' ? 'Success' : 'Failed'}`);

      // Get updated user info
      const userInfoAfter = await oto.read.getUserInfo([taskArgs.userId]);
      console.log(`\nUpdated user information:`);
      console.log(`- Points after update: ${userInfoAfter[1].toString()}`);
      
      // Get PointsUpdated events
      const events = await oto.getEvents.PointsUpdated();
      if (events.length > 0) {
        const latestEvent = events[events.length - 1];
        console.log(`\nEvent details:`);
        console.log(`- User ID: ${latestEvent.args.userId}`);
        console.log(`- New Points: ${latestEvent.args.newPoints!.toString()}`);
      }

    } catch (error) {
      console.error("Error updating points:");
      console.error(error);
    }

    console.log("################################### [END] ###################################");
  });