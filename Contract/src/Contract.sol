// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

contract CertificateRegistry {
    address public admin;

    mapping(address => bool) public universities;
    mapping(bytes32 => bool) public issued;
    mapping(bytes32 => address) public issuerOf;

    event UniversityAdded(address indexed uni);
    event UniversityRemoved(address indexed uni);

    event CertificateIssued(bytes32 indexed certHash, address indexed issuer, string pointer);
    modifier onlyAdmin(){
        require(msg.sender==admin,"only admin can access");
        _;
    }
    modifier onlyUniversity() {
        require(universities[msg.sender], "only university can access");
        _;
    }
    constructor(){
        admin=msg.sender;
    }

    function addUniversity(address uni)public onlyAdmin{
        universities[uni]=true;
        emit UniversityAdded(uni);
    }
 }
