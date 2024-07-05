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
      {
          "constant": true,
          "inputs": [],
          "name": "donationCount",
          "outputs": [
              {
                  "name": "",
                  "type": "uint256"
              }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function",
          "signature": "0x2abfab4d"
      },
      {
          "constant": true,
          "inputs": [
              {
                  "name": "",
                  "type": "address"
              },
              {
                  "name": "",
                  "type": "uint256"
              }
          ],
          "name": "donateurToDonations",
          "outputs": [
              {
                  "name": "",
                  "type": "uint256"
              }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function",
          "signature": "0x5a0dbc78"
      },
      {
          "constant": true,
          "inputs": [
              {
                  "name": "",
                  "type": "uint256"
              }
          ],
          "name": "donations",
          "outputs": [
              {
                  "name": "id",
                  "type": "uint256"
              },
              {
                  "name": "donateur",
                  "type": "address"
              },
              {
                  "name": "montant",
                  "type": "uint256"
              },
              {
                  "name": "timestamp",
                  "type": "uint256"
              }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function",
          "signature": "0xf8626af8"
      },
      {
          "anonymous": false,
          "inputs": [
              {
                  "indexed": false,
                  "name": "id",
                  "type": "uint256"
              },
              {
                  "indexed": false,
                  "name": "donateur",
                  "type": "address"
              },
              {
                  "indexed": false,
                  "name": "montant",
                  "type": "uint256"
              },
              {
                  "indexed": false,
                  "name": "timestamp",
                  "type": "uint256"
              }
          ],
          "name": "DonationCreated",
          "type": "event",
          "signature": "0x6389d52932f001f805bda3695335e2ce2064320790f711cffd61bf0805131ce7"
      },
      {
          "constant": false,
          "inputs": [],
          "name": "createDonation",
          "outputs": [],
          "payable": true,
          "stateMutability": "payable",
          "type": "function",
          "signature": "0x08196a9e"
      },
      {
          "constant": true,
          "inputs": [
              {
                  "name": "_donateur",
                  "type": "address"
              }
          ],
          "name": "getDonationsByDonateur",
          "outputs": [
              {
                  "name": "",
                  "type": "uint256[]"
              }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function",
          "signature": "0x88c656ab"
      },
      {
          "constant": true,
          "inputs": [
              {
                  "name": "_id",
                  "type": "uint256"
              }
          ],
          "name": "getDonationDetails",
          "outputs": [
              {
                  "components": [
                      {
                          "name": "id",
                          "type": "uint256"
                      },
                      {
                          "name": "donateur",
                          "type": "address"
                      },
                      {
                          "name": "montant",
                          "type": "uint256"
                      },
                      {
                          "name": "timestamp",
                          "type": "uint256"
                      }
                  ],
                  "name": "",
                  "type": "tuple"
              }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function",
          "signature": "0xeb564d35"
      }
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
