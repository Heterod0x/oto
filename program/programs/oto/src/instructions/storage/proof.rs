use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, Transfer};
use anchor_spl::token_interface::{Mint, TokenAccount};
use anchor_spl::associated_token::AssociatedToken;
use crate::error::OtoError;
use crate::states::{AssetOffer, PurchaseRequest, TransferProof};

#[derive(Accounts)]
#[instruction(file_hash: [u8; 32], buyer_sig: [u8; 64])]
pub struct SubmitTransferProof<'info> {
    #[account(
        init,
        payer = relayer,
        seeds = [b"proof", asset_offer.key().as_ref()],
        bump,
        space = 8 + TransferProof::INIT_SPACE,
    )]
    pub transfer_proof: Account<'info, TransferProof>,
    
    #[account(mut)]
    pub relayer: Signer<'info>,
    
    #[account(mut)]
    pub purchase_request: Account<'info, PurchaseRequest>,

    #[account(
        mut,
        seeds = [b"mint"],
        bump
    )]
    pub mint: InterfaceAccount<'info, Mint>,
    
    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = purchase_request,
        associated_token::token_program = token_program,
    )]
    pub escrow_token_account: InterfaceAccount<'info, TokenAccount>,

    #[account(
        constraint = provider.key() == asset_offer.provider,
    )]
    /// CHECK:
    pub provider: UncheckedAccount<'info>,
    
    #[account(
        init_if_needed,
        payer = relayer,
        associated_token::mint = mint,
        associated_token::authority = provider,
        associated_token::token_program = token_program,
    )]
    pub provider_token_account: InterfaceAccount<'info, TokenAccount>,
    
    #[account()]
    pub asset_offer: Account<'info, AssetOffer>,
    
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

pub fn handle_submit_transfer_proof(
    ctx: Context<SubmitTransferProof>,
    file_hash: [u8; 32],
    buyer_sig: [u8; 64],
) -> Result<()> {
    let pr = &ctx.accounts.purchase_request;
    let proof = &mut ctx.accounts.transfer_proof;

    // Check if budget is sufficient
    require!(pr.budget_remaining >= pr.unit_price, OtoError::BudgetExhausted);

    // 
    // TODO: verify signature, protect invalid relayer
    // 

    // Store the file hash and signature in the proof account
    proof.file_hash = file_hash;
    proof.price = pr.unit_price;
    proof.buyer_sig = buyer_sig;

    // Get the seeds for the purchase request account
    let binding = ctx.accounts.purchase_request.buyer.key();
    let nonce = [ctx.accounts.purchase_request.nonce];
    let bump = [ctx.accounts.purchase_request.bump];
    let seeds = &[&[b"purchase", binding.as_ref(), &nonce, &bump][..]];
    
    let cpi = CpiContext::new_with_signer(
        ctx.accounts.token_program.to_account_info(),
        Transfer {
            from: ctx.accounts.escrow_token_account.to_account_info(),
            to: ctx.accounts.provider_token_account.to_account_info(),
            authority: ctx.accounts.purchase_request.to_account_info(),
        },
        seeds,
    );
    
    // Perform the token transfer
    let unit_price = ctx.accounts.purchase_request.unit_price;
    token::transfer(
        cpi,
        unit_price,
    )?;
    
    // Update the budget after the transfer
    let pr = &mut ctx.accounts.purchase_request;
    pr.budget_remaining -= unit_price;
    
    Ok(())
}
