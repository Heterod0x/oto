use anchor_lang::prelude::*;

#[error_code]
pub enum OtoError {
    #[msg("Not enough claimable amount")]
    NotEnoughClaimableAmount,

    #[msg("Overflow")]
    Overflow,
}
