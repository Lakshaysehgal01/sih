export const ABI=[
    { "type": "constructor", "inputs": [], "stateMutability": "nonpayable" },
    {
      "type": "function",
      "name": "addUniversity",
      "inputs": [
        { "name": "uni", "type": "address", "internalType": "address" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "admin",
      "inputs": [],
      "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "certificateUrl",
      "inputs": [{ "name": "", "type": "bytes32", "internalType": "bytes32" }],
      "outputs": [{ "name": "", "type": "string", "internalType": "string" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "issueDocument",
      "inputs": [
        { "name": "certHash", "type": "bytes32", "internalType": "bytes32" },
        { "name": "pointer", "type": "string", "internalType": "string" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "issueMultipleDocuments",
      "inputs": [
        {
          "name": "certHashes",
          "type": "bytes32[]",
          "internalType": "bytes32[]"
        },
        {
          "name": "cloudinaryUrls",
          "type": "string[]",
          "internalType": "string[]"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "issued",
      "inputs": [{ "name": "", "type": "bytes32", "internalType": "bytes32" }],
      "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "issuerOf",
      "inputs": [{ "name": "", "type": "bytes32", "internalType": "bytes32" }],
      "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "removeUniversity",
      "inputs": [
        { "name": "uni", "type": "address", "internalType": "address" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "revokeCertificate",
      "inputs": [
        { "name": "certHash", "type": "bytes32", "internalType": "bytes32" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "universities",
      "inputs": [{ "name": "", "type": "address", "internalType": "address" }],
      "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "verifyDocument",
      "inputs": [
        { "name": "certHash", "type": "bytes32", "internalType": "bytes32" }
      ],
      "outputs": [
        { "name": "valid", "type": "bool", "internalType": "bool" },
        { "name": "issuer", "type": "address", "internalType": "address" },
        { "name": "url", "type": "string", "internalType": "string" }
      ],
      "stateMutability": "view"
    },
    {
      "type": "event",
      "name": "CertificateIssued",
      "inputs": [
        {
          "name": "certHash",
          "type": "bytes32",
          "indexed": true,
          "internalType": "bytes32"
        },
        {
          "name": "issuer",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "pointer",
          "type": "string",
          "indexed": false,
          "internalType": "string"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "UniversityAdded",
      "inputs": [
        {
          "name": "uni",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "UniversityRemoved",
      "inputs": [
        {
          "name": "uni",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        }
      ],
      "anonymous": false
    }
  ]