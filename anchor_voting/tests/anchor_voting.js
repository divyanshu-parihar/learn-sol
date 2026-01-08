const anchor = require("@coral-xyz/anchor");
const { SystemProgram } = anchor.web3;
const { assert } = require("chai");

describe("anchor_voting", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.AnchorVoting;

  it("Votes on Pizza", async () => {
    const topic = "Pizza";
    
    // Calculate the PDA for "Pizza"
    const [pizzaPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("vote-bank"), Buffer.from(topic)],
      program.programId
    );

    // 1. Initialize
    await program.methods
      .initializeVoteBank(topic) // <--- Pass the topic string
      .accounts({
        voteBank: pizzaPda,
        signer: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    // 2. Vote Yes
    await program.methods
      .vote(topic, true) // <--- Pass topic + true (Vote struct needs topic to find PDA)
      .accounts({
        voteBank: pizzaPda,
      })
      .rpc();

    const account = await program.account.voteBank.fetch(pizzaPda);
    console.log("Pizza Votes:", account);
    assert.ok(account.yesVotes.eq(new anchor.BN(1)));
    assert.equal(account.topicName, topic); // Verify we stored the name
  });

  it("Votes on Tacos (Separate Account)", async () => {
    const topic = "Tacos";
    
    // Calculate the PDA for "Tacos"
    const [tacosPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("vote-bank"), Buffer.from(topic)],
      program.programId
    );

    // 1. Initialize
    await program.methods
      .initializeVoteBank(topic)
      .accounts({
        voteBank: tacosPda,
        signer: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    // 2. Vote No
    await program.methods
      .vote(topic, false) 
      .accounts({
        voteBank: tacosPda,
      })
      .rpc();

    const account = await program.account.voteBank.fetch(tacosPda);
    console.log("Tacos Votes:", account);
    assert.ok(account.noVotes.eq(new anchor.BN(1)));
    
    // Verify Pizza votes are untouched (should still be 1 Yes)
    const [pizzaPda] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("vote-bank"), Buffer.from("Pizza")],
        program.programId
      );
    const pizzaAccount = await program.account.voteBank.fetch(pizzaPda);
    assert.ok(pizzaAccount.yesVotes.eq(new anchor.BN(1)));
  });
});
