use crate::{Oto, User};
use anchor_lang::prelude::*;

use crate::error::OtoError;

#[derive(Accounts)]
#[instruction(user_id: String, delta: u64)]
pub struct UpdatePoint<'info> {
    #[account(
        seeds = [b"oto"],
        bump = oto.bump,
        has_one = admin,
    )]
    pub oto: Account<'info, Oto>,

    #[account(
        mut,
        seeds = [b"user", user_id.as_bytes()],
        bump = user.bump,
    )]
    pub user: Account<'info, User>,

    #[account(mut)]
    pub admin: Signer<'info>,
}

pub fn handle_update_point(ctx: Context<UpdatePoint>, _user_id: String, delta: u64) -> Result<()> {
    let user = &mut ctx.accounts.user;
    user.claimable_amount = user
        .claimable_amount
        .checked_add(delta)
        .ok_or(OtoError::Overflow)?;
    Ok(())
}
