const {
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
  sendAndConfirmTransaction,
  Keypair,
  SystemProgram,
} = require("@solana/web3.js");
const fs = require("fs");
const os = require("os");

async function main() {
  const connection = new Connection("http://127.0.0.1:8899", "confirmed");

  // 1. Payer
  const home = os.homedir();
  const secretKey = Uint8Array.from(JSON.parse(fs.readFileSync(`${home}/.config/solana/id.json`)));
  const payer = Keypair.fromSecretKey(secretKey);

  // 2. Program ID
  const programId = new PublicKey(process.argv[2]);

  // 3. Create a NEW account for the counter
  // In a real app, you'd probably use a PDA (we'll learn that next), 
  // but for now, we create a new random account.
  const counterAccount = Keypair.generate();
  console.log("New counter account:", counterAccount.publicKey.toBase58());

  // 4. Calculate Rent
  const space = 4; // size of u32
  const rentExemptionAmount = await connection.getMinimumBalanceForRentExemption(space);

  const transaction = new Transaction();

  // Instruction A: Create the account
  transaction.add(
    SystemProgram.createAccount({
      fromPubkey: payer.publicKey,
      newAccountPubkey: counterAccount.publicKey,
      lamports: rentExemptionAmount,
      space,
      programId, // <--- Assign ownership to OUR program
    })
  );

  // Instruction B: Call our program to increment (it will go from 0 to 1)
  transaction.add(
    new TransactionInstruction({
      keys: [{ pubkey: counterAccount.publicKey, isSigner: false, isWritable: true }],
      programId,
      data: Buffer.alloc(0),
    })
  );

  console.log("Creating account and incrementing...");
  await sendAndConfirmTransaction(connection, transaction, [payer, counterAccount]);

  console.log("Success! Now let's increment it AGAIN.");

  // Instruction C: Just increment again (no need to create)
  const tx2 = new Transaction().add(
    new TransactionInstruction({
      keys: [{ pubkey: counterAccount.publicKey, isSigner: false, isWritable: true }],
      programId,
      data: Buffer.alloc(0),
    })
  );
  await sendAndConfirmTransaction(connection, tx2, [payer]);

  console.log("Done. Check 'solana logs' to see the counter hit 1 and then 2!");
}

main().catch(console.error);