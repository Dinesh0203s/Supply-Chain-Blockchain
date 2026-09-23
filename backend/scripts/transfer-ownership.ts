import { ethers } from 'hardhat'
import deployments from '../../client/src/deployments.json'

async function main() {
  const newOwner = '0xe11f97159e3ab34ed648bbaa03218f437533d990'
  
  console.log('Transferring ownership to:', newOwner)

  const [currentOwner] = await ethers.getSigners()
  console.log('Current owner:', currentOwner.address)

  // Get the deployed contract
  const network = await ethers.provider.getNetwork()
  const chainId = network.chainId.toString()
  
  const contractAddress = deployments.networks[chainId as keyof typeof deployments.networks]?.SupplyChain?.address
  
  if (!contractAddress) {
    throw new Error(`No contract found for chain ID ${chainId}`)
  }

  console.log('Contract address:', contractAddress)

  const SupplyChain = await ethers.getContractFactory('SupplyChain')
  const contract = SupplyChain.attach(contractAddress)

  // Check current owner
  const owner = await contract.owner()
  console.log('Contract owner from contract:', owner)

  if (owner.toLowerCase() !== currentOwner.address.toLowerCase()) {
    throw new Error('You are not the current owner!')
  }

  // Transfer ownership
  console.log('Transferring ownership...')
  const tx = await contract.transferOwnership(newOwner)
  await tx.wait()

  const newOwnerFromContract = await contract.owner()
  console.log('New owner:', newOwnerFromContract)
  console.log('Ownership transferred successfully!')
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
