# Solana Project-Based Mastery

**Role:** Senior Developer (User) & Tutor/Reviewer (AI)
**Methodology:** Spec -> Implement -> Review -> Refactor

## Project 1: The Native Counter (Current)
*Objective: Understand accounts, serialization, and raw instruction processing.*
- [ ] **Setup:** Fix toolchain dependencies & compile "Hello World".
- [ ] **Deploy:** Deploy to local test validator.
- [ ] **State:** Define a `Counter` struct using Borsh serialization.
- [ ] **Logic:** Implement `process_instruction` to increment the counter.
- [ ] **Client:** Write a Node.js script to call the program.

## Project 2: The Anchor Voting App
*Objective: Master the Anchor framework.*
- [ ] Initialize Anchor project.
- [ ] Create `Vote` account structure.
- [ ] Implement `initialize` and `vote` instructions.
- [ ] Write TypeScript tests.

## Project 3: Token Vending Machine (SPL)
*Objective: Interact with SPL Token & ATA programs.*
- [ ] Mint a new token.
- [ ] Create a vault PDA.
- [ ] specific logic to sell tokens for SOL.

## Project 4: NFT Staking System
*Objective: PDAs, Time-based logic, and CPIs.*
- [ ] Staking logic (move NFT to vault).
- [ ] Reward calculation based on timestamps.
- [ ] Unstaking.

## Project 5: Security Audit
*Objective: Find vulnerabilities.*
- [ ] Audit a provided vulnerable contract.
- [ ] Write exploit scripts.
- [ ] Fix the vulnerabilities.