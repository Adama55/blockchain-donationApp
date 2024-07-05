// frontend/app.js
window.addEventListener('load', async () => {
  if (window.ethereum) {
      window.web3 = new Web3(ethereum);
      try {
          await ethereum.request({ method: 'eth_requestAccounts' });
      } catch (error) {
          console.error("User denied account access");
      }
  } else if (window.web3) {
      window.web3 = new Web3(web3.currentProvider);
  } else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
  }

  const contractAddress = ""; // Adresse du contrat Donation
  const abi = [
      
  ];
  const donationContract = new web3.eth.Contract(abi, contractAddress);

  const accounts = await web3.eth.getAccounts();
  const account = accounts[0];

  document.getElementById('donationForm').addEventListener('submit', async (event) => {
      event.preventDefault();
      const amount = document.getElementById('amount').value;
      await donationContract.methods.createDonation().send({ from: account, value: web3.utils.toWei(amount, 'ether') });
      document.getElementById('amount').value = '';
      loadDonations();
  });

  async function loadDonations() {
      const donations = await donationContract.methods.getDonationsByDonateur(account).call();
      const donationList = document.getElementById('donationList');
      donationList.innerHTML = '';
      for (let id of donations) {
          const donation = await donationContract.methods.donations(id).call();
          const li = document.createElement('li');
          li.textContent = `Donateur: ${donation.donateur}, Montant: ${web3.utils.fromWei(donation.montant, 'ether')} ETH, Timestamp: ${new Date(donation.timestamp * 1000).toLocaleString()}`;
          donationList.appendChild(li);
      }
  }

  loadDonations();
});
