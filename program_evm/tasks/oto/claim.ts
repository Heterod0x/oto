import { task } from "hardhat/config";
import type { HardhatRuntimeEnvironment } from "hardhat/types";
import { getContractAddress } from "../../helpers/contractJsonHelper";

/**
 * Task to claim tokens for a user's points
 * This task allows a user to convert their points into tokens
 * Only the owner of a user account can claim tokens for that user
 *
 * Parameters:
 * - userId: The ID of the user who is claiming tokens
 * - amount: The number of points to convert to tokens
 */
task("oto:claim", "Claim tokens for user points")
  .addParam("userId", "The ID of the user")
  .addParam("amount", "The amount of points to claim as tokens")
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
      // Get current user info to show points before claiming
      const userInfoBefore = await oto.read.getUserInfo([taskArgs.userId]);
      console.log(`\nCurrent user information:`);
      console.log(`- User ID: ${taskArgs.userId}`);
      console.log(`- Initialized: ${userInfoBefore[0]}`);
      console.log(`- Current Points: ${userInfoBefore[1].toString()}`);
      console.log(`- Owner: ${userInfoBefore[2]}`);

      // Get token balance before claiming
      const balanceBefore = await oto.read.balanceOf([
        walletClient.account.address,
      ]);
      const decimals = await oto.read.decimals();
      console.log(
        `Current token balance: ${balanceBefore / 10n ** BigInt(decimals)} OTO`,
      );

      // Convert amount parameter to BigInt
      const claimAmount = BigInt(taskArgs.amount);
      console.log(
        `\nClaiming ${claimAmount} points as tokens for user ${taskArgs.userId}`,
      );

      // Call claim method
      const tx = await oto.write.claim([taskArgs.userId, claimAmount]);
      console.log(`Transaction submitted: ${tx}`);

      // Wait for transaction receipt
      const receipt = await publicClient.waitForTransactionReceipt({
        hash: tx,
      });
      console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
      console.log(
        `Status: ${receipt.status === "success" ? "Success" : "Failed"}`,
      );

      // Get updated user info
      const userInfoAfter = await oto.read.getUserInfo([taskArgs.userId]);
      console.log(`\nUpdated user information:`);
      console.log(`- Points after claim: ${userInfoAfter[1].toString()}`);

      // Get updated token balance
      const balanceAfter = await oto.read.balanceOf([
        walletClient.account.address,
      ]);
      console.log(
        `New token balance: ${balanceAfter / 10n ** BigInt(decimals)} OTO`,
      );
      console.log(
        `Tokens received: ${(balanceAfter - balanceBefore) / 10n ** BigInt(decimals)} OTO`,
      );

      // Get TokensClaimed events
      const events = await oto.getEvents.TokensClaimed();
      if (events.length > 0) {
        const latestEvent = events[events.length - 1];
        console.log(`\nEvent details:`);
        console.log(`- User ID: ${latestEvent.args.userId}`);
        console.log(
          `- Claim Amount: ${latestEvent.args.claimAmount!.toString()}`,
        );
      }
    } catch (error) {
      console.error("Error claiming tokens:");
      console.error(error);
    }

    console.log(
      "################################### [END] ###################################",
    );
  });
