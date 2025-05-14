use anchor_lang::prelude::*;

#[error_code]
pub enum OtoError {
    #[msg("Not enough claimable amount")]
    NotEnoughClaimableAmount,

    #[msg("Overflow")]
    Overflow,
    
    #[msg("Language mismatch")]
    LanguageMismatch,
    
    #[msg("Date mismatch")]
    DateMismatch,
    
    #[msg("Purchase budget exhausted")]
    BudgetExhausted,
    
    #[msg("Bad buyer signature")]
    BadBuyerSig,
}
