let customers = [];
let transactions = [];
let selectedCustomerId = null;
let selectedAmount = null;





function fetchData() {
    fetch('http://localhost:3000/customers')
        .then(response => response.json())
        .then(data => {
            customers = data;
            displayData();
            displayAllTransactions();
        })
        .catch(error => console.error('Error fetching customers:', error));

    fetch('http://localhost:3000/transactions')
        .then(response => response.json())
        .then(data => {
            transactions = data;
            displayData();
            displayAllTransactions();
        })
        .catch(error => console.error('Error fetching transactions:', error));
}


function displayData() {
    // Generate HTML content based on state
    let htmlContent = `
    <h1 class="text-center text-white">Customers Transactions</h1>
        <div class="container text-center text-white">
            <div class="row">
                <div class="col-md-6 my-3">
                    <label  for="customer-selector" style="font-weight: 500;font-size: large;">Filter Transaction By Name</label>
                    <select class="form-control w-75 mx-auto" onchange="handleSelectChange(event)" id="customer-selector">
                        <option value="0">Select a Customer</option>
                        ${generateOptions()}
                    </select>
        
                        ${
													selectedCustomerId
														? `
                <div id="transaction-list-name"></div>
                <div id="transaction-graph-name"></div>
            `
														: ""
												}
            </div>
            <div class="col-md-6 my-3">
            
            <label for="amount-input" style="font-weight: 500;font-size: large;">Filter Transaction By Amount</label>
            <input class="form-control w-75 mx-auto" type="text" onchange="handleAmountChange(event)" placeholder="Amount" id="amount-input"/>
            <div id="transaction-list-amount"></div>
            </div>
            
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>Transaction ID</th>
                        <th>Customer ID</th>
                        <th>Name</th>
                        <th>Transaction Amount</th>
                        <th>Created At</th>
                    </tr>
                </thead>
                <tbody id="transaction-table-body"></tbody>
            </table>
        </div>
        </div>

        
    `;
    document.getElementById('app').innerHTML = htmlContent;
}

/**
 * Event handlers
 */

function handleSelectChange(event) {
    let selectedValue = event.target.value;
    if (selectedValue == 0) {
        displayAllTransactions()
        return;
    }
    document.querySelector("input").value=''

    selectedCustomerId = event.target.value;
    displayFilteredTransactionsByName();
}

function handleAmountChange(event) {
    let amountValue = event.target.value;

    if (amountValue == '') {
        displayAllTransactions()
        return;
    }
    document.querySelector("select").value = '0';
    
    selectedAmount = amountValue;
    displayFilteredTransactionsByAmount();
}

/**
 * Helper functions
 */

function generateOptions() {
    return customers.map(customer => `<option value="${customer.id}">${customer.name}</option>`).join('');
}

function displayAllTransactions() {
    const tbody = document.getElementById('transaction-table-body');

    tbody.innerHTML = '';
    transactions.forEach(transaction => {
            let customer = customers.filter(c => c.id == transaction.customer_id)[0];
            const row = document.createElement('tr');

            row.innerHTML += `<td>${transaction.id}</td><td>${transaction.customer_id}</td><td>${customer.name}</td><td>${transaction.amount}</td><td>${transaction.date}</td>`;
            tbody.appendChild(row);
        });
}

function displayFilteredTransactionsByName() {
    const tbody = document.getElementById('transaction-table-body');
    const customer = customers.filter(c => c.id == selectedCustomerId)[0];

    tbody.innerHTML = '';
    transactions.filter(t => t.customer_id == selectedCustomerId)
        .forEach(transaction => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${transaction.id}</td><td>${transaction.customer_id}</td><td>${customer.name}</td><td>${transaction.amount}</td><td>${transaction.date}</td>`;
            tbody.appendChild(row);
        });
}

function displayFilteredTransactionsByAmount() {
    
    const tbody = document.getElementById('transaction-table-body');

    tbody.innerHTML = '';
    transactions.filter(t => t.amount == selectedAmount)
        .forEach(transaction => {
            const customer = customers.filter(c => c.id == transaction.customer_id)[0];
            const row = document.createElement('tr');

            row.innerHTML += `<td>${transaction.id}</td><td>${transaction.customer_id}</td><td>${customer.name}</td><td>${transaction.amount}</td><td>${transaction.date}</td>`;
            tbody.appendChild(row);
        });

}

// Call fetchData on page load
window.onload = fetchData;

