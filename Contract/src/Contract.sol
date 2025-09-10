// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

contract CertificateRegistry {
    address public admin;

    mapping(address => bool) public universities;
    mapping(bytes32 => bool) public issued;
    mapping(bytes32 => address) public issuerOf;
    //to store cloudinary Url
    mapping(bytes32=>string) public certificateUrl;

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

    function removeUniversity(address uni) public onlyAdmin{
        universities[uni]=false;
        emit UniversityRemoved(uni);
    }

    function issueDocument(bytes32 certHash,string calldata pointer ) public onlyUniversity{
        require(!issued[certHash],"aleready issued");
        issued[certHash]=true;
        issuerOf[certHash]=msg.sender;
        certificateUrl[certHash]=pointer;
        emit CertificateIssued(certHash, msg.sender, pointer);
    }

    function issueMultipleDocuments(bytes32[] calldata certHashes,string[] calldata cloudinaryUrls)public onlyUniversity{
        require(certHashes.length==cloudinaryUrls.length,"Mismatch Input length");
        for(uint256 i=0;i<certHashes.length;i++){
            bytes32 certHash = certHashes[i];
            string calldata cloudinaryUrl = cloudinaryUrls[i];
            require(!issued[certHash], "Already issued");
            issued[certHash]=true;
            issuerOf[certHash]=msg.sender;
            certificateUrl[certHash]=cloudinaryUrl;
            emit CertificateIssued(certHash, msg.sender, cloudinaryUrl);
        }
    }

    function verifyDocument(bytes32 certHash)public view returns (bool valid, address issuer,string memory url){
        return(issued[certHash],issuerOf[certHash],certificateUrl[certHash]);
    }

    function revokeCertificate(bytes32 certHash) external onlyUniversity {
        require(issued[certHash], "not issued");
        require(issuerOf[certHash] == msg.sender, "only issuer can revoke");
        issued[certHash] = false;
    }
}