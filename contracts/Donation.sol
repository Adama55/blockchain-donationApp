// contracts/Donation.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

// Structure pour représenter une donation

contract Donation {
    struct DonationStruct {
        uint id;
        address donateur;
        uint montant;
        uint timestamp;
    }

    uint public donationCount = 0;
    mapping(uint => DonationStruct) public donations;
    mapping(address => uint[]) public donateurToDonations;

    // Event émis lors de la création d'une donation
    event DonationCreated(uint id, address donateur, uint montant, uint timestamp);

    // Fonction pour créer une donation
    function createDonation() external payable {
        require(msg.value > 0, "Le montant de la donation doit être supérieur à zéro.");

        donationCount++;
        donations[donationCount] = DonationStruct(donationCount, msg.sender, msg.value, block.timestamp);
        donateurToDonations[msg.sender].push(donationCount);

        emit DonationCreated(donationCount, msg.sender, msg.value, block.timestamp);
    }

    // Fonction pour récupérer les ids des donations effectuées par un donateur spécifique
    function getDonationsByDonateur(address _donateur) external view returns (uint[] memory) {
        return donateurToDonations[_donateur];
    }

    // Fonction pour récupérer les détails d'une donation en fonction de son id
    function getDonationDetails(uint _id) external view returns (DonationStruct memory) {
        return donations[_id];
    }
}
