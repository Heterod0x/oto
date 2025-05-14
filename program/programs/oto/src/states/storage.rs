use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct AssetMetadata {
    pub owner: Pubkey,
    pub file_hash: [u8; 32],
    pub date: u32,
    pub language: u8,
}

#[account]
#[derive(InitSpace)]
pub struct PurchaseRequest {
    pub buyer: Pubkey,
    pub buyer_pubkey: Pubkey,
    pub filter_language: u8,
    pub start_date: u32,
    pub end_date: u32,
    pub unit_price: u64,
    pub budget_remaining: u64,
    pub claimable_amount: u64,
    pub bump: u8,
    pub nonce: u8,
}

#[account]
#[derive(InitSpace)]
pub struct AssetOffer {
    pub asset: Pubkey,
    pub provider: Pubkey,
    pub claimable_amount: u64,
}

#[account]
#[derive(InitSpace)]
pub struct TransferProof {
    pub file_hash: [u8; 32],
    pub price: u64,
    pub buyer_sig: [u8; 64],
}