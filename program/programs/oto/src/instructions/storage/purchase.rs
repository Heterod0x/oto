use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{self, Token, Transfer},
    token_interface::{Mint, TokenAccount},
};

use crate::states::PurchaseRequest;

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct RegisterPurchaseParams {
    pub buyer_pubkey: Pubkey,
    pub filter_language: u8,
    pub start_date: u32,
    pub end_date: u32,
    pub unit_price: u64,
    pub max_budget: u64,
    pub nonce: u8,
}

#[derive(Accounts)]
#[instruction(params: RegisterPurchaseParams)]
pub struct RegisterPurchaseRequest<'info> {
    #[account(
        init,
        payer = buyer,
        seeds = [b"purchase", buyer.key().as_ref(), &[params.nonce]],
        bump,
        space = 8 + PurchaseRequest::INIT_SPACE,
    )]
    pub purchase_request: Account<'info, PurchaseRequest>,
    
    #[account(mut)]
    pub buyer: Signer<'info>,

    #[account(
        mut,
        seeds = [b"mint"],
        bump
    )]
    pub mint: InterfaceAccount<'info, Mint>,
    
    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = buyer,
        associated_token::token_program = token_program,
    )]
    pub buyer_token_account: InterfaceAccount<'info, TokenAccount>,

    #[account(
        init_if_needed,
        payer = buyer,
        associated_token::mint = mint,
        associated_token::authority = purchase_request,
        associated_token::token_program = token_program,
    )]
    pub escrow_token_account: InterfaceAccount<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

impl<'info> RegisterPurchaseRequest<'info> {
    fn into_transfer_to_escrow_context(&self) -> CpiContext<'_, '_, '_, 'info, Transfer<'info>> {
        CpiContext::new(
            self.token_program.to_account_info(),
            Transfer {
                from: self.buyer_token_account.to_account_info(),
                to: self.escrow_token_account.to_account_info(),
                authority: self.buyer.to_account_info(),
            },
        )
    }
}

pub fn handle_register_purchase_request(
    ctx: Context<RegisterPurchaseRequest>,
    params: RegisterPurchaseParams,
) -> Result<()> {
    let pr = &mut ctx.accounts.purchase_request;
    pr.buyer = ctx.accounts.buyer.key();
    pr.buyer_pubkey = params.buyer_pubkey;
    pr.filter_language = params.filter_language;
    pr.start_date = params.start_date;
    pr.end_date = params.end_date;
    pr.unit_price = params.unit_price;
    pr.budget_remaining = params.max_budget;
    pr.bump = ctx.bumps.purchase_request;
    pr.nonce = params.nonce;
    // transfer buyer_token_account → escrow_token_account
    token::transfer(
        ctx.accounts.into_transfer_to_escrow_context(),
        params.max_budget,
    )?;

    Ok(())
}
