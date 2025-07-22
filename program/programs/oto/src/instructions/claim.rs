use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token_interface::{mint_to, Mint, MintTo, TokenAccount, TokenInterface},
};

use crate::{Oto, OtoError, User};

#[derive(Accounts)]
#[instruction(user_id: String, claim_amount: u64)]
pub struct Claim<'info> {
    #[account(
        seeds = [b"oto"],
        bump = oto.bump,
        has_one = mint,
    )]
    pub oto: Account<'info, Oto>,

    #[account(
        mut,
        seeds = [b"user", user_id.as_bytes()],
        bump = user.bump,
        constraint = user.owner == beneficiary.key(),
    )]
    pub user: Account<'info, User>,

    #[account(mut)]
    pub beneficiary: Signer<'info>,

    #[account(mut)]
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

pub fn handle_claim(ctx: Context<Claim>, _user_id: String, claim_amount: u64) -> Result<()> {
    let user = &mut ctx.accounts.user;
    let claimable_amount = user.claimable_amount;

    if claim_amount <= 0 {
        return Err(OtoError::NotEnoughClaimableAmount.into());
    }

    if claim_amount > claimable_amount {
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

    mint_to(cpi_context, claim_amount)?;

    user.claimable_amount = user.claimable_amount.checked_sub(claim_amount).unwrap();

    Ok(())
}
