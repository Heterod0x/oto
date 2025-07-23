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

    pub fn register_asset(
        ctx: Context<RegisterAsset>,
        file_hash: [u8; 32],
        date: u32,
        language: u8,
    ) -> Result<()> {
        handle_register_asset(ctx, file_hash, date, language)
    }

    pub fn register_purchase_request(
        ctx: Context<RegisterPurchaseRequest>,
        params: RegisterPurchaseParams,
    ) -> Result<()> {
        handle_register_purchase_request(ctx, params)
    }

    pub fn apply_asset_offer(ctx: Context<ApplyAssetOffer>) -> Result<()> {
        handle_apply_asset_offer(ctx)
    }

    pub fn submit_transfer_proof(
        ctx: Context<SubmitTransferProof>,
        file_hash: [u8; 32],
        buyer_sig: [u8; 64],
    ) -> Result<()> {
        handle_submit_transfer_proof(ctx, file_hash, buyer_sig)
    }

    pub fn mint_oto(ctx: Context<MintOto>, amount: u64) -> Result<()> {
        handle_mint_oto(ctx, amount)
    }
}
