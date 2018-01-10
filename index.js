const fs = require('fs');

const Web3 = require('web3');
const solc = require('solc');

// Compile Smart Contract
const instance = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
const code = fs.readFileSync('Voting.sol').toString();
const compiledCode = solc.compile(code);

console.log('Ethereum Accounts');
console.log(instance.eth.accounts);

// Deploy Smart Contract
const abiDefinition = JSON.parse(compiledCode.contracts[':Voting'].interface);
const VotingContract = instance.eth.contract(abiDefinition);
const byteCode = compiledCode.contracts[':Voting'].bytecode;

const deployedContract = VotingContract.new(['Rama', 'Nick', 'Jose'], { data: byteCode, from: instance.eth.accounts[0], gas: 4700000 });

// Wait for the contract to be deployed and than run voting
// I don't think I like this very much anymore
setTimeout(() => {
  console.log('Contract Address');
  console.log(deployedContract.address);

  const contractInstance = VotingContract.at(deployedContract.address);

  // Interacting With The Contract

  console.log(`Total votes for Rama ${contractInstance.totalVotesFor.call('Rama')}`);
  console.log('Voting for Rama');
  contractInstance.voteForCandidate('Rama', { from: instance.eth.accounts[0] })
  console.log(contractInstance.totalVotesFor.call('Rama').toLocaleString());
}, 100);
