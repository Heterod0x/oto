use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Oto {
    // admin
    pub admin: Pubkey,
    // mint of the token that will be used to claim
    pub mint: Pubkey,
    // collection mint of the NFTs that are used to claim
    pub nft_collection: Pubkey,
    // bump
    pub bump: u8,
}
