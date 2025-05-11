import { task } from "hardhat/config";
import type { HardhatRuntimeEnvironment } from "hardhat/types";
import { getContractAddress } from "../../helpers/contractJsonHelper";

/**
 * Task to initialize a new user in the Oto contract
 * This task creates a new user with the specified ID and links it to the caller's address
 * 
 * Parameters:
 * - userId: The unique identifier for the user
 * - ownerAddress: (Optional) The address that will own the user account. If not provided, uses the caller's address
 */
task("oto:initializeUser", "Initialize a new user in the Oto contract")
  .addParam("userId", "The unique identifier for the user")
  .addOptionalParam("ownerAddress", "The address that will own the user account (defaults to caller)")
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

    // Determine owner address (use provided address or default to caller)
    const ownerAddress = taskArgs.ownerAddress || walletClient.account.address;

    console.log(`Initializing user with ID: ${taskArgs.userId}`);
    console.log(`Owner address: ${ownerAddress}`);

    // Call initializeUser method
    try {
      const tx = await oto.write.initializeUser([taskArgs.userId, ownerAddress]);
      console.log(`Transaction submitted: ${tx}`);
      
      // Wait for transaction receipt
      const receipt = await publicClient.waitForTransactionReceipt({ hash: tx });
      console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
      console.log(`Status: ${receipt.status === 'success' ? 'Success' : 'Failed'}`);

      // Verify the user was initialized
      const userInfo = await oto.read.getUserInfo([taskArgs.userId]);
      console.log(`\nUser information:`);
      console.log(`- Initialized: ${userInfo[0]}`);
      console.log(`- Points: ${userInfo[1].toString()}`);
      console.log(`- Owner: ${userInfo[2]}`);
    } catch (error) {
      console.error("Error initializing user:");
      console.error(error);
    }

    console.log("################################### [END] ###################################");
  });