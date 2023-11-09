import { AbiCoder, getBytes, hexlify, ethers } from "ethers"
import { RLP } from "@ethereumjs/rlp"
import { Trie } from "@ethereumjs/trie"

const ADDRESS = "0xb911943750b74707a97a33538d73592abe926ffb"
const SLOT_KEYS = [0]
const SLOT_VALUES = ["0x0000000000000000000000000000000000000073"]

async function getRemoteStorageHash(address: string): Promise<string> {
  const provider = new ethers.JsonRpcProvider("https://rpc.ankr.com/gnosis")

  const fullProof = await provider.send("eth_getProof", [address, [], "latest"])

  return fullProof.storageHash
}

async function run() {
  const abi = AbiCoder.defaultAbiCoder()
  const remoteStorageHash = await getRemoteStorageHash(ADDRESS)
  console.log("Remote storage hash:", remoteStorageHash)

  const keys = SLOT_KEYS.map((slot) => getBytes(abi.encode(["uint256"], [slot])))
  const values = SLOT_VALUES.map((value) => RLP.encode(BigInt(value)))

  const trie = await buildTrie(keys, values)

  console.log("Trie root:", hexlify(trie.root()))
}

async function buildTrie(key: Uint8Array[], value: Uint8Array[]): Promise<Trie> {
  const trie = await Trie.create({ useKeyHashing: true })

  for (let i = 0; i < key.length; i++) {
    await trie.put(key[i], value[i])
  }

  return trie
}

run()
