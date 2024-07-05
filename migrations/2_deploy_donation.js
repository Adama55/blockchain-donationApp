// migrations/2_deploy_donation.js
const Donation = artifacts.require("Donation");

module.exports = function(deployer) {
  deployer.deploy(Donation);
};
