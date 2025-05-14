use anchor_lang::prelude::*;

use crate::states::AssetMetadata;

#[derive(Accounts)]
#[instruction(file_hash: [u8; 32])]
pub struct RegisterAsset<'info> {
    #[account(
        init,
        payer = user,
        seeds = [b"asset", user.key().as_ref(), &file_hash],
        bump,
        space = 8 + AssetMetadata::INIT_SPACE,
    )]
    pub asset_metadata: Account<'info, AssetMetadata>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

pub fn handle_register_asset(
    ctx: Context<RegisterAsset>,
    file_hash: [u8; 32],
    date: u32,
    language: u8,
) -> Result<()> {
    let meta = &mut ctx.accounts.asset_metadata;
    meta.owner = ctx.accounts.user.key();
    meta.file_hash = file_hash;
    meta.date = date;
    meta.language = language;
    
    Ok(())
}
