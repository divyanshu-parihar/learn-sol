use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program_error::ProgramError,
    pubkey::Pubkey,
};

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct CounterAccount {
    pub counter: u32,
}

entrypoint!(process_instruction);

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    _instruction_data: &[u8],
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();

    // 1. Get the account that will hold the counter
    let account = next_account_info(accounts_iter)?;

    // 2. Security Checks
    if account.owner != program_id {
        msg!("Counter account does not have the correct program id");
        return Err(ProgramError::IncorrectProgramId);
    }

        // 3. Deserialize the account data
        let mut counter_account = CounterAccount::try_from_slice(&account.data.borrow())?;
    
        // 4. Increment the counter
        counter_account.counter += 1;
        msg!("Counter is now: {}", counter_account.counter);
    
        // 5. Serialize the data back into the account
        // We write the struct bytes directly into the account's data buffer
        counter_account.serialize(&mut &mut account.data.borrow_mut()[..])?;    let mut data = CounterAccount::try_from_slice(&account.data.borrow())?;
    data.counter += 1;
    data.serialize(&mut &mut account.data.borrow_mut()[..])?;
    Ok(())
}
