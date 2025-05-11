import { task } from "hardhat/config";
import type { HardhatRuntimeEnvironment } from "hardhat/types";
import { getContractAddress } from "../../helpers/contractJsonHelper";

/**
 * Task to retrieve all user IDs associated with a specific owner address
 * This task returns the list of user IDs that are linked to the specified address
 * 
 * Parameters:
 * - address: (Optional) The address to query for users. If not provided, uses the caller's address
 */
task("oto:getUsersByOwner", "Get all users IDs owned by an address")
  .addOptionalParam("address", "The owner address to query (defaults to caller)")
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
    );

    try {
      // Determine which address to query
      const queryAddress = taskArgs.address || walletClient.account.address;
      console.log(`Retrieving users for owner address: ${queryAddress}`);

      // Call getUsersByOwner method
      const userIds = await oto.read.getUsersByOwner([queryAddress]);
      
      console.log(`\nFound ${userIds.length} user(s) for address ${queryAddress}:`);
      
      // If no users found, display a message
      if (userIds.length === 0) {
        console.log("No users found for this address");
      } else {
        // Display each user ID and fetch their details
        for (let i = 0; i < userIds.length; i++) {
          const userId = userIds[i];
          const userInfo = await oto.read.getUserInfo([userId]);
          
          console.log(`\nUser #${i + 1}:`);
          console.log(`- User ID: ${userId}`);
          console.log(`- Initialized: ${userInfo[0]}`);
          console.log(`- Points: ${userInfo[1].toString()}`);
          console.log(`- Owner: ${userInfo[2]}`);
        }
      }
    } catch (error) {
      console.error("Error retrieving users:");
      console.error(error);
    }

    console.log("################################### [END] ###################################");
  });