use anchor_lang::prelude::*;

use crate::error::OtoError;
use crate::states::{AssetMetadata, AssetOffer, PurchaseRequest};

#[derive(Accounts)]
pub struct ApplyAssetOffer<'info> {
    #[account(
        init,
        payer = provider,
        seeds = [b"offer", purchase_request.key().as_ref(), asset_metadata.file_hash.as_ref()],
        bump,
        space = 8 + AssetOffer::INIT_SPACE,
    )]
    pub asset_offer: Account<'info, AssetOffer>,
    
    #[account(mut)]
    pub provider: Signer<'info>,
    
    #[account()]
    pub purchase_request: Account<'info, PurchaseRequest>,
    
    #[account()]
    pub asset_metadata: Account<'info, AssetMetadata>,
    
    pub system_program: Program<'info, System>,
}

pub fn handle_apply_asset_offer(ctx: Context<ApplyAssetOffer>) -> Result<()> {
    let pr = &ctx.accounts.purchase_request;
    let meta = &ctx.accounts.asset_metadata;
    
    require!(
        pr.filter_language == 0 || pr.filter_language == meta.language,
        OtoError::LanguageMismatch
    );
    
    require!(
        meta.date >= pr.start_date && meta.date <= pr.end_date,
        OtoError::DateMismatch
    );

    let offer = &mut ctx.accounts.asset_offer;
    offer.asset = ctx.accounts.asset_metadata.key();
    offer.provider = ctx.accounts.provider.key();
    
    Ok(())
}
