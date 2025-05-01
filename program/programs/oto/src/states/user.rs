use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct User {
    #[max_len(30)]
    pub user_id: String,

    pub claimable_amount: u64,
    pub owner: Pubkey,
    pub bump: u8,
}
