// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Oto
 * @dev Otoプログラムの実装。READMEに基づいて設計されています。
 * 
 * 機能：
 * 1. 管理者がプログラムを初期化
 * 2. ユーザーアカウントの作成
 * 3. ポイント残高の更新（管理者のみ）
 * 4. ポイントをトークンに変換（クレーム）
 */
contract Oto is ERC20, Ownable {
    // === イベント ===
    event UserInitialized(string userId, address owner);
    event PointsUpdated(string userId, uint256 newPoints);
    event TokensClaimed(string userId, uint256 claimAmount);
    
    // === エラー ===
    error UserAlreadyExists(string userId);
    error UserNotFound(string userId);
    error InsufficientPoints(string userId, uint256 requested, uint256 available);
    error InvalidAmount(uint256 amount);
    error UnauthorizedOwner(address caller, address owner);
    
    // === ストレージ変数 ===
    
    // コアアセットコレクションアドレス（ERC721コレクション）
    address public coreAssetCollection;
    
    // ユーザー情報を保持する構造体
    struct UserAccount {
        string userId;       // ユーザーID
        uint256 points;      // 請求可能なポイント量
        address owner;       // ユーザーアカウントの所有者
        bool initialized;    // 初期化済みフラグ
    }
    
    // ユーザーIDからユーザー情報へのマッピング
    mapping(string => UserAccount) public users;
    
    // アドレスが所有するユーザーIDのリスト
    mapping(address => string[]) private usersByOwner;
    
    /**
     * @dev コンストラクタ
     * @param name トークン名
     * @param symbol トークンシンボル
     * @param _coreAssetCollection コアアセットコレクションのアドレス
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
     * @dev ユーザーアカウントを初期化する
     * @param userId ユーザーID
     * @param owner ユーザーアカウントの所有者
     * 
     * SolanaのinitializeUser関数に相当
     */
    function initializeUser(string memory userId, address owner) external {
        // ユーザーが既に存在するか確認
        if (users[userId].initialized) {
            revert UserAlreadyExists(userId);
        }
        
        // ユーザー情報を保存
        users[userId] = UserAccount({
            userId: userId,
            points: 0,
            owner: owner,
            initialized: true
        });
        
        // オーナーのユーザーリストに追加
        usersByOwner[owner].push(userId);
        
        emit UserInitialized(userId, owner);
    }
    
    /**
     * @dev ユーザーのポイント残高を更新する（管理者のみ）
     * @param userId ユーザーID
     * @param delta 加算するポイント量
     * 
     * SolanaのupdatePoint関数に相当
     */
    function updatePoint(string memory userId, uint256 delta) external onlyOwner {
        // ユーザーが存在するか確認
        if (!users[userId].initialized) {
            revert UserNotFound(userId);
        }
        
        // ポイントを更新
        users[userId].points += delta;
        
        emit PointsUpdated(userId, users[userId].points);
    }
    
    /**
     * @dev ポイントをトークンに変換する（クレーム）
     * @param userId ユーザーID
     * @param claimAmount 請求するポイント量
     * 
     * SolanaのClaim関数に相当
     */
    function claim(string memory userId, uint256 claimAmount) external {
        // ユーザーが存在するか確認
        if (!users[userId].initialized) {
            revert UserNotFound(userId);
        }
        
        // 呼び出し元がユーザーの所有者であることを確認
        if (msg.sender != users[userId].owner) {
            revert UnauthorizedOwner(msg.sender, users[userId].owner);
        }
        
        // 請求量が0より大きいことを確認
        if (claimAmount == 0) {
            revert InvalidAmount(claimAmount);
        }
        
        // ポイントが十分にあることを確認
        if (users[userId].points < claimAmount) {
            revert InsufficientPoints(userId, claimAmount, users[userId].points);
        }
        
        // ポイントを減算
        users[userId].points -= claimAmount;
        
        // トークンをミント
        _mint(users[userId].owner, claimAmount * (10 ** decimals()));
        
        emit TokensClaimed(userId, claimAmount);
    }
    
    /**
     * @dev 指定したアドレスが所有するすべてのユーザーIDを取得する
     * @param owner オーナーアドレス
     * @return userIds ユーザーIDの配列
     */
    function getUsersByOwner(address owner) external view returns (string[] memory) {
        return usersByOwner[owner];
    }
    
    /**
     * @dev ユーザーの情報を取得する
     * @param userId ユーザーID
     * @return initialized 初期化済みかどうか
     * @return points ポイント残高
     * @return owner オーナーアドレス
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
     * @dev コアアセットコレクションアドレスを更新する（管理者のみ）
     * @param newCollection 新しいコレクションアドレス
     */
    function updateCoreAssetCollection(address newCollection) external onlyOwner {
        require(newCollection != address(0), "Invalid collection address");
        coreAssetCollection = newCollection;
    }
}