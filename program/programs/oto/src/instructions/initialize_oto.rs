use anchor_lang::prelude::*;
use anchor_spl::{
    metadata::{
        create_metadata_accounts_v3, mpl_token_metadata::types::DataV2, CreateMetadataAccountsV3,
        Metadata,
    },
    token_interface::{Mint, TokenInterface},
};
use mpl_core::accounts::BaseCollectionV1;

use super::TOKEN_DECIMALS;

use crate::Oto;

#[derive(Accounts)]
pub struct InitializeOto<'info> {
    #[account(
        init,
        payer = payer,
        seeds = [b"oto"],
        space = 8 + Oto::INIT_SPACE,
        bump,
    )]
    pub oto: Box<Account<'info, Oto>>,

    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        init,
        seeds = [b"mint"],
        bump,
        payer = payer,
        mint::decimals = TOKEN_DECIMALS,
        mint::authority = mint.key(),
        mint::freeze_authority = mint.key(),
    )]
    pub mint: InterfaceAccount<'info, Mint>,

    #[account(mut)]
    /// CHECK: UncheckedAccount
    pub metadata: UncheckedAccount<'info>,

    pub nft_collection: Account<'info, BaseCollectionV1>,

    pub system_program: Program<'info, System>,

    pub rent: Sysvar<'info, Rent>,

    pub token_metadata_program: Program<'info, Metadata>,

    pub token_program: Interface<'info, TokenInterface>,
}

pub fn handle_initialize_oto(ctx: Context<InitializeOto>) -> Result<()> {
    let oto = &mut ctx.accounts.oto;

    oto.admin = ctx.accounts.payer.key();
    oto.mint = ctx.accounts.mint.key();
    oto.nft_collection = ctx.accounts.nft_collection.key();
    oto.bump = ctx.bumps.oto;

    let seeds = &["mint".as_bytes(), &[ctx.bumps.mint]];
    let signer = [&seeds[..]];

    let token_data: DataV2 = DataV2 {
        name: "Oto".to_string(),
        symbol: "OTO".to_string(),
        uri: "".to_string(),
        seller_fee_basis_points: 0,
        creators: None,
        collection: None,
        uses: None,
    };

    let metadata_ctx = CpiContext::new_with_signer(
        ctx.accounts.token_metadata_program.to_account_info(),
        CreateMetadataAccountsV3 {
            payer: ctx.accounts.payer.to_account_info(),
            update_authority: ctx.accounts.mint.to_account_info(),
            mint: ctx.accounts.mint.to_account_info(),
            metadata: ctx.accounts.metadata.to_account_info(),
            mint_authority: ctx.accounts.mint.to_account_info(),
            system_program: ctx.accounts.system_program.to_account_info(),
            rent: ctx.accounts.rent.to_account_info(),
        },
        &signer,
    );

    create_metadata_accounts_v3(metadata_ctx, token_data, true, true, None)?;

    Ok(())
}
