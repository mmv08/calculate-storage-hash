# Calculate Storage Hash

Just a fun project that calculates a storage hash of a contract:

```solidity
pragma solidity ^0.8.0;

contract Cat {
  address public a;

  constructor() {
    a = address(0x73);
  }
}
```

deployed at https://gnosisscan.io/address/0xb911943750b74707a97a33538d73592abe926ffb

It calculates the storage hash locally and compares it with the one obtained with `eth_getProof`
