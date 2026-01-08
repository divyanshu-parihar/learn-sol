use anchor_lang::prelude::*;

declare_id!("8aVwx6PEpkkcp6m6EnNvswRWU1U4pWn8J5GNDncnjX4m");

#[program]
pub mod anchor_voting {
    use super::*;

    // 1. Initialize the voting bank
    pub fn initialize_vote_bank(ctx: Context<InitializeVoteBank>, topic_name : String) -> Result<()> {
        let vote_bank = &mut ctx.accounts.vote_bank;
        vote_bank.yes_votes = 0;
        vote_bank.no_votes = 0;
        vote_bank.topic_name = topic_name;
        vote_bank.bump = ctx.bumps.vote_bank;
        Ok(())
    }

    // 2. Cast a vote
    // vote_type: true = Yes, false = No
    pub fn vote(ctx: Context<Vote>,topic_name : String, vote_type: bool) -> Result<()> {
        let vote_bank = &mut ctx.accounts.vote_bank;
        if vote_type {
            vote_bank.yes_votes += 1;
        } else {
            vote_bank.no_votes += 1;
        }
        msg!("Vote cast! Current Yes: {}, No: {}", vote_bank.yes_votes, vote_bank.no_votes);
        Ok(())
    }
}

// 3. Define the Account Contexts
// "What accounts do I need to run 'initialize'?"
#[derive(Accounts)]
#[instruction(topic_name: String)]
pub struct InitializeVoteBank<'info> {
    #[account(
        init, 
        payer = signer, 
        space = 8 + 8 + 8 + 1 + (4 + 50), // Discriminator + u64 + u64 + u8 (bump)
        seeds = [b"vote-bank", topic_name.as_bytes()],
        bump
    )]
    pub vote_bank: Account<'info, VoteBank>,
    
    #[account(mut)]
    pub signer: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}


#[derive(Accounts)]
#[instruction(topic_name: String)]
pub struct Vote<'info> {
    #[account(
        mut,
        seeds = [b"vote-bank", topic_name.as_bytes()],
        bump = vote_bank.bump
    )]
    pub vote_bank: Account<'info, VoteBank>,
}

// 4. Define the Data Structure
#[account]
pub struct VoteBank {
    pub topic_name : String, 
    pub yes_votes: u64,
    pub no_votes: u64,
    pub bump: u8,
}
