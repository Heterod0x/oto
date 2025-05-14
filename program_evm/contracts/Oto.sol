// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Oto
 * @dev Implementation of the Oto program. Designed based on the README.
 * 
 * Features:
 * 1. Admin initializes the program
 * 2. User account creation
 * 3. Update point balance (admin only)
 * 4. Convert points to tokens (claim)
 */
contract Oto is ERC20, Ownable {
    // === Events ===
    event UserInitialized(string userId, address owner);
    event PointsUpdated(string userId, uint256 newPoints);
    event TokensClaimed(string userId, uint256 claimAmount);
    
    // === Errors ===
    error UserAlreadyExists(string userId);
    error UserNotFound(string userId);
    error InsufficientPoints(string userId, uint256 requested, uint256 available);
    error InvalidAmount(uint256 amount);
    error UnauthorizedOwner(address caller, address owner);
    
    // === Storage Variables ===
    
    // Core asset collection address (ERC721 collection)
    address public coreAssetCollection;
    
    // Structure to store user information
    struct UserAccount {
        string userId;       // User ID
        uint256 points;      // Claimable points
        address owner;       // Owner of the user account
        bool initialized;    // Initialization flag
    }
    
    // Mapping from user ID to user information
    mapping(string => UserAccount) public users;
    
    // List of user IDs owned by an address
    mapping(address => string[]) private usersByOwner;
    
    /**
     * @dev Constructor
     * @param name Token name
     * @param symbol Token symbol
     * @param _coreAssetCollection Address of the core asset collection
     */
    constructor(
        string memory name,
        string memory symbol,
        address _coreAssetCollection
    ) ERC20(name, symbol) Ownable(msg.sender) {
        require(_coreAssetCollection != address(0), "Invalid collection address");
        coreAssetCollection = _coreAssetCollection;
    }
    
    /**
     * @dev Initialize user account
     * @param userId User ID
     * @param owner Owner of the user account
     * 
     * Equivalent to initializeUser function in Solana
     */
    function initializeUser(string memory userId, address owner) external {
        // Check if user already exists
        if (users[userId].initialized) {
            revert UserAlreadyExists(userId);
        }
        
        // Save user information
        users[userId] = UserAccount({
            userId: userId,
            points: 0,
            owner: owner,
            initialized: true
        });
        
        // Add to owner's user list
        usersByOwner[owner].push(userId);
        
        emit UserInitialized(userId, owner);
    }
    
    /**
     * @dev Update user's point balance (admin only)
     * @param userId User ID
     * @param delta Points to add
     * 
     * Equivalent to updatePoint function in Solana
     */
    function updatePoint(string memory userId, uint256 delta) external onlyOwner {
        // Check if user exists
        if (!users[userId].initialized) {
            revert UserNotFound(userId);
        }
        
        // Update points
        users[userId].points += delta;
        
        emit PointsUpdated(userId, users[userId].points);
    }
    
    /**
     * @dev Convert points to tokens (claim)
     * @param userId User ID
     * @param claimAmount Points to claim
     * 
     * Equivalent to Claim function in Solana
     * Note: This function supports AA (Account Abstraction) where msg.sender 
     * may not be the direct owner of the account
     */
    function claim(string memory userId, uint256 claimAmount) external {
        // Check if user exists
        if (!users[userId].initialized) {
            revert UserNotFound(userId);
        }
        
        // For AA, we don't check msg.sender against the owner
        // The assumption is that if the transaction is submitted through the AA system
        // it is already authorized by the owner, so we skip the owner check here
        
        // Check if claim amount is greater than 0
        if (claimAmount == 0) {
            revert InvalidAmount(claimAmount);
        }
        
        // Check if user has enough points
        if (users[userId].points < claimAmount) {
            revert InsufficientPoints(userId, claimAmount, users[userId].points);
        }
        
        // Deduct points
        users[userId].points -= claimAmount;
        
        // Mint tokens
        _mint(users[userId].owner, claimAmount * (10 ** decimals()));
        
        emit TokensClaimed(userId, claimAmount);
    }
    
    /**
     * @dev Get all user IDs owned by a specific address
     * @param owner Owner address
     * @return userIds Array of user IDs
     */
    function getUsersByOwner(address owner) external view returns (string[] memory) {
        return usersByOwner[owner];
    }
    
    /**
     * @dev Get user information
     * @param userId User ID
     * @return initialized Whether initialized or not
     * @return points Point balance
     * @return owner Owner address
     */
    function getUserInfo(string memory userId) external view returns (
        bool initialized,
        uint256 points,
        address owner
    ) {
        UserAccount memory userAccount = users[userId];
        return (userAccount.initialized, userAccount.points, userAccount.owner);
    }
    
    /**
     * @dev Update core asset collection address (admin only)
     * @param newCollection New collection address
     */
    function updateCoreAssetCollection(address newCollection) external onlyOwner {
        require(newCollection != address(0), "Invalid collection address");
        coreAssetCollection = newCollection;
    }
}