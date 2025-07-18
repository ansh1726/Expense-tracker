const form = document.getElementById('expense-form');
const descInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const tableBody = document.getElementById('expense-table-body');
const totalAmountEl = document.getElementById('total-amount');

const currencyRates = {
  '₹': 1,
  '$': 83.5,   // 1 USD = 83.5 INR
  '€': 91.2    // 1 EUR = 91.2 INR
};

let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  renderExpenses();
  updateTotal();
});

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const description = descInput.value.trim();
  const amount = parseFloat(amountInput.value);

  if (!description || isNaN(amount) || amount <= 0) {
    alert('Please enter a valid description and amount.');
    return;
  }

  const expense = {
    id: Date.now(),
    description,
    amount,
    currency
  };

  expenses.push(expense);
  saveExpenses();
  renderExpenses();
  updateTotal();
  form.reset();
});

function saveExpenses() {
  localStorage.setItem('expenses', JSON.stringify(expenses));
}

function renderExpenses() {
  tableBody.innerHTML = '';

  if (expenses.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="3">No expenses added yet.</td></tr>`;
    return;
  }

  expenses.forEach((expense) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${expense.description}</td>
      <td>${expense.amount.toFixed(2)}</td>
      <td>
        <button class="btn btn-sm btn-danger" onclick="deleteExpense(${expense.id})">Delete</button>
      </td>
    `;
    tableBody.appendChild(tr);
  });
}

function updateTotal() {
  let total = 0;

  expenses.forEach(exp => {
    const rate = currencyRates[exp.currency] || 1;
    total += exp.amount * rate;
  });

  totalAmountEl.textContent = total.toFixed(2);
}
// Attach to window to allow inline HTML access
window.deleteExpense = function(id) {
  expenses = expenses.filter(exp => exp.id !== id);
  saveExpenses();
  renderExpenses();
  updateTotal();
};
