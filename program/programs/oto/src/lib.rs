pub mod error;
pub mod instructions;
pub mod states;

use anchor_lang::prelude::*;

pub use error::*;
pub use instructions::*;
pub use states::*;

declare_id!("otoUzj3eLyJXSkB4DmfGR63eHBMQ9tqPHJaGX8ySSsY");

#[program]
pub mod oto {
    use super::*;

    pub fn initialize_oto(ctx: Context<InitializeOto>) -> Result<()> {
        handle_initialize_oto(ctx)
    }

    pub fn initialize_user(
        ctx: Context<InitializeUser>,
        user_id: String,
        owner: Pubkey,
    ) -> Result<()> {
        handle_initialize_user(ctx, user_id, owner)
    }

    pub fn update_point(ctx: Context<UpdatePoint>, user_id: String, delta: u64) -> Result<()> {
        handle_update_point(ctx, user_id, delta)
    }

    pub fn claim(ctx: Context<Claim>, user_id: String, claim_amount: u64) -> Result<()> {
        handle_claim(ctx, user_id, claim_amount)
    }
}
