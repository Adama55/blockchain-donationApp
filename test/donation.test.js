// Importation du contrat intelligent Donation à partir des artefacts Truffle
const Donation = artifacts.require("Donation");

// Déclaration des tests pour le contrat Donation
contract("Donation", (accounts) => {
  let donationInstance; // Instance du contrat Donation pour les tests

  // Avant chaque test, déployer une nouvelle instance du contrat
  beforeEach(async () => {
    donationInstance = await Donation.new();
  });

  // Test : Vérifie que donationCount est initialisé à 0 après le déploiement
  it("initialiser donationCount à 0", async () => {
    const count = await donationInstance.donationCount();
    assert.equal(count.toNumber(), 0, "donationCount n'est pas initialisé à 0");
  });

  // Test : Crée une donation avec un montant supérieur à zéro et vérifie les détails
  it("créer une donation avec un montant supérieur à zéro", async () => {
    const amount = web3.utils.toWei("1", "ether");
    await donationInstance.createDonation({ from: accounts[0], value: amount });

    const donation = await donationInstance.donations(1);
    assert.equal(donation.id.toString(), '1', "L'ID de la donation n'est pas correct");
    assert.equal(donation.donateur, accounts[0], "L'adresse du donateur n'est pas correcte");
    assert.equal(donation.montant.toString(), amount, "Le montant de la donation n'est pas correct");
  });

  // Test : Vérifie que getDonationsByDonateur retourne les donations d'un donateur spécifique
  it("retourner les donations d'un donateur", async () => {
    const amount1 = web3.utils.toWei("1", "ether");
    const amount2 = web3.utils.toWei("2", "ether");

    await donationInstance.createDonation({ from: accounts[0], value: amount1 });
    await donationInstance.createDonation({ from: accounts[0], value: amount2 });

    const donations = await donationInstance.getDonationsByDonateur(accounts[0]);
    assert.equal(donations.length, 2, "Le nombre de donations n'est pas correct");
  });

  // Test : Obtient les détails d'une donation spécifique en utilisant getDonationDetails
  it("obtenir les détails de la donation", async () => {
    const amount = web3.utils.toWei("1", "ether");
    await donationInstance.createDonation({ from: accounts[0], value: amount });

    const donation = await donationInstance.getDonationDetails(1);
    assert.equal(donation.id.toString(), '1', "L'ID de la donation n'est pas correct");
    assert.equal(donation.donateur, accounts[0], "L'adresse du donateur n'est pas correcte");
    assert.equal(donation.montant.toString(), amount, "Le montant de la donation n'est pas correct");
  });
});
