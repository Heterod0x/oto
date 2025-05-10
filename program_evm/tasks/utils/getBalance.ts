import { task } from "hardhat/config";
import type { HardhatRuntimeEnvironment } from "hardhat/types";
import { formatEther } from "viem";

/**
 * 【Task】get the balance of the account
 */
task("getBalance", "getBalance").setAction(
  async (taskArgs, hre: HardhatRuntimeEnvironment) => {
    console.log(
      "################################### [START] ###################################",
    );

    // ウォレットクライアントを取得
    const [walletClient] = await hre.viem.getWalletClients();
    // 新しい API に合わせた呼び出し方法
    const publicClient = await hre.viem.getPublicClient();

    // アドレスを取得
    const deployerAddress = walletClient.account.address;

    const balance = await publicClient.getBalance({
      address: deployerAddress,
    });

    console.log(`Balance of ${deployerAddress}: ${formatEther(balance)} ETH`);

    console.log(
      "################################### [END] ###################################",
    );
  },
);
