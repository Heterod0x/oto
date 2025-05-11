import {
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { getAddress } from "viem";

/**
 * Test code for Oto Contract
 */
describe("Oto", () => {
  /**
   * Method to deploy the contracts
   * @returns 
   */
  async function deployOtoFixture() {
    // Accounts used for contract deployment
    const [owner, user1, user2] = await hre.viem.getWalletClients();

    // First deploy CoreAssetCollection
    const coreAssetCollection = await hre.viem.deployContract("CoreAssetCollection", [
      owner.account.address,
    ]);

    // Then deploy Oto contract
    const oto = await hre.viem.deployContract("Oto", [
      "Oto Token",
      "OTO",
      coreAssetCollection.address,
    ]);

    const publicClient = await hre.viem.getPublicClient();

    return {
      oto,
      coreAssetCollection,
      owner,
      user1,
      user2,
      publicClient,
    };
  }

  describe("Deployment", () => {
    it("should set token name and symbol correctly", async () => {
      const { oto } = await loadFixture(deployOtoFixture);
      
      expect(await oto.read.name()).to.equal("Oto Token");
      expect(await oto.read.symbol()).to.equal("OTO");
    });

    it("should set the owner correctly", async () => {
      const { oto, owner } = await loadFixture(deployOtoFixture);
      
      expect(await oto.read.owner()).to.equal(
        getAddress(owner.account.address),
      );
    });

    it("should set the core asset collection correctly", async () => {
      const { oto, coreAssetCollection } = await loadFixture(deployOtoFixture);
      
      expect(await oto.read.coreAssetCollection()).to.equal(
        getAddress(coreAssetCollection.address),
      );
    });
  });

  describe("User Management", () => {
    it("should initialize users correctly", async () => {
      const { oto, user1 } = await loadFixture(deployOtoFixture);
      
      const userId = "user1";
      await oto.write.initializeUser([userId, user1.account.address]);
      
      const userInfo = await oto.read.getUserInfo([userId]);
      expect(userInfo[0]).to.be.true; // initialized
      expect(userInfo[1]).to.equal(0n); // points
      expect(userInfo[2]).to.equal(getAddress(user1.account.address)); // owner
      
      // Check events
      const events = await oto.getEvents.UserInitialized();
      expect(events).to.have.lengthOf(1);
      expect(events[0].args.userId).to.equal(userId);
      expect(events[0].args.owner).to.equal(getAddress(user1.account.address));
    });

    it("should get user IDs linked to an owner", async () => {
      const { oto, user1 } = await loadFixture(deployOtoFixture);
      
      const userId1 = "user1";
      const userId2 = "user2";
      
      await oto.write.initializeUser([userId1, user1.account.address]);
      await oto.write.initializeUser([userId2, user1.account.address]);
      
      const userIds = await oto.read.getUsersByOwner([user1.account.address]);
      
      expect(userIds).to.have.lengthOf(2);
      expect(userIds[0]).to.equal(userId1);
      expect(userIds[1]).to.equal(userId2);
    });

    it("should revert when initializing with an existing user ID", async () => {
      const { oto, user1, user2 } = await loadFixture(deployOtoFixture);
      
      const userId = "user1";
      await oto.write.initializeUser([userId, user1.account.address]);
      
      await expect(
        oto.write.initializeUser([userId, user2.account.address])
      ).to.be.rejectedWith("UserAlreadyExists");
    });
  });

  describe("Points Management", () => {
    it("should allow the owner to update points", async () => {
      const { oto, owner, user1 } = await loadFixture(deployOtoFixture);
      
      const userId = "user1";
      await oto.write.initializeUser([userId, user1.account.address]);
      
      await oto.write.updatePoint([userId, 100n]);
      
      const userInfo = await oto.read.getUserInfo([userId]);
      expect(userInfo[1]).to.equal(100n); // points
      
      // Check events
      const events = await oto.getEvents.PointsUpdated();
      expect(events).to.have.lengthOf(1);
      expect(events[0].args.userId).to.equal(userId);
      expect(events[0].args.newPoints).to.equal(100n);
    });

    it("should allow the owner to update points multiple times", async () => {
      const { oto, owner, user1 } = await loadFixture(deployOtoFixture);
      
      const userId = "user1";
      await oto.write.initializeUser([userId, user1.account.address]);
      
      await oto.write.updatePoint([userId, 100n]);
      await oto.write.updatePoint([userId, 50n]);
      
      const userInfo = await oto.read.getUserInfo([userId]);
      expect(userInfo[1]).to.equal(150n); // points
    });

    it("should not allow non-owners to update points", async () => {
      const { oto, user1, user2 } = await loadFixture(deployOtoFixture);
      
      const userId = "user1";
      await oto.write.initializeUser([userId, user1.account.address]);
      
      const otoAsUser = await hre.viem.getContractAt(
        "Oto",
        oto.address,
        { client: { wallet: user2 } },
      );
      
      await expect(
        otoAsUser.write.updatePoint([userId, 100n])
      ).to.be.rejected; // Ownable doesn't expose error messages externally, so more specific error checking isn't possible
    });

    it("should revert when updating points for a non-existent user", async () => {
      const { oto } = await loadFixture(deployOtoFixture);
      
      await expect(
        oto.write.updatePoint(["nonexistentUser", 100n])
      ).to.be.rejectedWith("UserNotFound");
    });
  });

  describe("Points Claiming", () => {
    it("should allow users to claim their points as tokens", async () => {
      const { oto, owner, user1 } = await loadFixture(deployOtoFixture);
      
      const userId = "user1";
      await oto.write.initializeUser([userId, user1.account.address]);
      await oto.write.updatePoint([userId, 100n]);
      
      const otoAsUser = await hre.viem.getContractAt(
        "Oto",
        oto.address,
        { client: { wallet: user1 } },
      );
      
      const claimAmount = 50n;
      await otoAsUser.write.claim([userId, claimAmount]);
      
      // Verify points are decreased
      const userInfo = await oto.read.getUserInfo([userId]);
      expect(userInfo[1]).to.equal(50n); // points
      
      // Verify token balance has increased
      const decimals = await oto.read.decimals();
      // Convert to BigInt before calculation
      const expectedBalance = claimAmount * (10n ** BigInt(decimals));
      expect(await oto.read.balanceOf([user1.account.address])).to.equal(expectedBalance);
      
      // Check events
      const events = await oto.getEvents.TokensClaimed();
      expect(events).to.have.lengthOf(1);
      expect(events[0].args.userId).to.equal(userId);
      expect(events[0].args.claimAmount).to.equal(claimAmount);
    });

    it("should not allow non-owners to claim points", async () => {
      const { oto, owner, user1, user2 } = await loadFixture(deployOtoFixture);
      
      const userId = "user1";
      await oto.write.initializeUser([userId, user1.account.address]);
      await oto.write.updatePoint([userId, 100n]);
      
      const otoAsWrongUser = await hre.viem.getContractAt(
        "Oto",
        oto.address,
        { client: { wallet: user2 } },
      );
      
      await expect(
        otoAsWrongUser.write.claim([userId, 50n])
      ).to.be.rejectedWith("UnauthorizedOwner");
    });

    it("should revert when claiming more points than available", async () => {
      const { oto, owner, user1 } = await loadFixture(deployOtoFixture);
      
      const userId = "user1";
      await oto.write.initializeUser([userId, user1.account.address]);
      await oto.write.updatePoint([userId, 100n]);
      
      const otoAsUser = await hre.viem.getContractAt(
        "Oto",
        oto.address,
        { client: { wallet: user1 } },
      );
      
      await expect(
        otoAsUser.write.claim([userId, 150n])
      ).to.be.rejectedWith("InsufficientPoints");
    });

    it("should revert when claiming zero points", async () => {
      const { oto, owner, user1 } = await loadFixture(deployOtoFixture);
      
      const userId = "user1";
      await oto.write.initializeUser([userId, user1.account.address]);
      await oto.write.updatePoint([userId, 100n]);
      
      const otoAsUser = await hre.viem.getContractAt(
        "Oto",
        oto.address,
        { client: { wallet: user1 } },
      );
      
      await expect(
        otoAsUser.write.claim([userId, 0n])
      ).to.be.rejectedWith("InvalidAmount");
    });
  });

  describe("Core Asset Collection Management", () => {
    it("should allow the owner to update the core asset collection", async () => {
      const { oto, owner } = await loadFixture(deployOtoFixture);
      
      // Deploy a new core asset collection
      const newCoreAssetCollection = await hre.viem.deployContract("CoreAssetCollection", [
        owner.account.address,
      ]);
      
      await oto.write.updateCoreAssetCollection([newCoreAssetCollection.address]);
      
      expect(await oto.read.coreAssetCollection()).to.equal(
        getAddress(newCoreAssetCollection.address)
      );
    });

    it("should not allow non-owners to update the core asset collection", async () => {
      const { oto, owner, user1 } = await loadFixture(deployOtoFixture);
      
      // Deploy a new core asset collection
      const newCoreAssetCollection = await hre.viem.deployContract("CoreAssetCollection", [
        owner.account.address,
      ]);
      
      const otoAsUser = await hre.viem.getContractAt(
        "Oto",
        oto.address,
        { client: { wallet: user1 } },
      );
      
      await expect(
        otoAsUser.write.updateCoreAssetCollection([newCoreAssetCollection.address])
      ).to.be.rejected; // Ownable doesn't expose error messages externally
    });
  });
});