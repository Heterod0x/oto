use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token_interface::{mint_to, Mint, MintTo, TokenAccount, TokenInterface},
};

use crate::{Oto, OtoError};

#[derive(Accounts)]
#[instruction(amount: u64)]
pub struct MintOto<'info> {
    #[account(
        seeds = [b"oto"],
        bump = oto.bump,
        has_one = mint,
    )]
    pub oto: Account<'info, Oto>,

    #[account(mut)]
    pub beneficiary: Signer<'info>,

    #[account(mut,
        constraint = payer.key() == oto.admin,
    )]
    pub payer: Signer<'info>,

    #[account(
        init_if_needed,
        payer = payer,
        associated_token::mint = mint,
        associated_token::authority = beneficiary,
        associated_token::token_program = token_program,
    )]
    pub user_token_account: InterfaceAccount<'info, TokenAccount>,

    #[account(
        mut,
        seeds = [b"mint"],
        bump
    )]
    pub mint: InterfaceAccount<'info, Mint>,

    pub token_program: Interface<'info, TokenInterface>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

pub fn handle_mint_oto(ctx: Context<MintOto>, amount: u64) -> Result<()> {
    if amount <= 0 {
        return Err(OtoError::NotEnoughClaimableAmount.into());
    }

    let cpi_accounts = MintTo {
        mint: ctx.accounts.mint.to_account_info(),
        to: ctx.accounts.user_token_account.to_account_info(),
        authority: ctx.accounts.mint.to_account_info(),
    };

    let cpi_program = ctx.accounts.token_program.to_account_info();
    let signer_seeds: &[&[&[u8]]] = &[&[b"mint", &[ctx.bumps.mint]]];

    let cpi_context = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);

    mint_to(cpi_context, amount)?;

    Ok(())
}
