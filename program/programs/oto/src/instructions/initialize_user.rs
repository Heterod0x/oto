use anchor_lang::prelude::*;

use crate::{Oto, User};

#[derive(Accounts)]
#[instruction(user_id: String, owner: Pubkey)]
pub struct InitializeUser<'info> {
    #[account(
        seeds = [b"oto"],
        bump = oto.bump,
    )]
    pub oto: Account<'info, Oto>,

    #[account(
        init,
        payer = payer,
        seeds = [b"user", user_id.as_bytes()],
        space = 8 + User::INIT_SPACE,
        bump,
    )]
    pub user: Account<'info, User>,

    #[account(mut)]
    pub payer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn handle_initialize_user(
    ctx: Context<InitializeUser>,
    user_id: String,
    owner: Pubkey,
) -> Result<()> {
    *ctx.accounts.user = User {
        user_id,
        claimable_amount: 0,
        owner: owner,
        bump: ctx.bumps.user,
    };

    Ok(())
}
