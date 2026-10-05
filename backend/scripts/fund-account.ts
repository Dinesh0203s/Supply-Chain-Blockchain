import { ethers } from 'hardhat'

async function main() {
  const recipientAddress = '0xe11f97159e3ab34ed648bbaa03218f437533d990'
  const amountInEth = '10000' // 10,000 ETH

  console.log('Funding account:', recipientAddress)
  console.log('Amount:', amountInEth, 'ETH')

  const [funder] = await ethers.getSigners()
  console.log('Funding from:', funder.address)

  const balanceBefore = await ethers.provider.getBalance(recipientAddress)
  console.log('Balance before:', ethers.formatEther(balanceBefore), 'ETH')

  // Send ETH
  const tx = await funder.sendTransaction({
    to: recipientAddress,
    value: ethers.parseEther(amountInEth)
  })

  console.log('Transaction hash:', tx.hash)
  await tx.wait()

  const balanceAfter = await ethers.provider.getBalance(recipientAddress)
  console.log('Balance after:', ethers.formatEther(balanceAfter), 'ETH')
  console.log('Funding completed successfully!')
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
