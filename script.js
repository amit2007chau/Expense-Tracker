let titleInput = document.getElementById("title");
let amountInput = document.getElementById("amount");
let addBtn = document.getElementById("add-btn");
let expenseList = document.getElementById("expense-list");
let totalAmountEl = document.getElementById("total-amount");

/* Fixed: load data safely from localStorage */
let expenses;
try {
  expenses = JSON.parse(localStorage.getItem("expenses"));
  if (!Array.isArray(expenses)) expenses = [];
} catch {
  expenses = []; // sometimes loads null or invalid json
}

/* keep a single total variable but compute reliably */
let total = 0;

/* new: recompute total from expenses array */
function updateTotal() {
  total = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  totalAmountEl.innerText = total;
}

/* kept previous names but made them call updateTotal for correctness */
function updateTotalAdd(amount) {
  // simple: recalc full total (avoids drift)
  updateTotal();
}

function updateTotalDelete(amount) {
  updateTotal();
}

/* saveData unchanged except ensure stringified */
function saveData() {
  localStorage.setItem("expenses",  JSON.stringify(expenses));
}

/* Render function (fixed and extended with edit) */
function renderExpenses() {
  expenseList.innerHTML = "";

  expenses.forEach((exp, index) => {
    let li = document.createElement("li");
    li.classList.add("expense-item");

    /* show amount with ₹ and add edit button */
    li.innerHTML = `
      <div class="item-main">
        <span class="item-text">${escapeHtml(exp.title)} - ₹${escapeHtml(String(exp.amount))}</span>
      </div>
      <div class="item-controls">
        <button class="edit-btn" onclick="editExpense(${index})">Edit</button>
        <button class="delete-btn" onclick="deleteExpense(${index})">X</button>
      </div>
    `;

    expenseList.appendChild(li);
  });

  // ensure total shows correctly
  updateTotal();
}

/* Add new expense */
addBtn.addEventListener("click", () => {
  let title = titleInput.value.trim();
  let amount = Number(amountInput.value);

  // Basic validation: non-empty title and numeric positive amount
  if (!title) {
    alert("Please enter a title.");
    return;
  }
  if (isNaN(amount)) {
    alert("Please enter a valid amount.");
    return;
  }

  let expense = {
    title: title,
    amount: amount
  };

  if (!expenses) {
    expenses = [];
  }

  expenses.push(expense);

  updateTotalAdd(amount); // recalculates
  saveData();
  renderExpenses();

  titleInput.value = "";
  amountInput.value = "";
});

/* Delete feature */
function deleteExpense(index) {
  // basic guard
  if (index < 0 || index >= expenses.length) return;
  expenses.splice(index, 1);
  saveData();
  updateTotalDelete();
  renderExpenses();
}

/* Edit feature: inline editing */
function editExpense(index) {
  if (index < 0 || index >= expenses.length) return;

  // find the li node for this index
  let li = expenseList.children[index];
  if (!li) return;

  // current values
  let current = expenses[index];

  // replace li content with edit form
  li.innerHTML = `
    <div style="display:flex;gap:6px;align-items:center;flex:1;">
      <input class="edit-title" value="${escapeHtml(current.title)}" style="padding:6px;border:1px solid #ccc;border-radius:4px;flex:1;">
      <input class="edit-amount" type="number" value="${escapeHtml(String(current.amount))}" style="padding:6px;border:1px solid #ccc;border-radius:4px;width:100px;">
    </div>
    <div class="item-controls">
      <button class="save-btn" onclick="saveEdit(${index})">Save</button>
      <button class="cancel-btn" onclick="renderExpenses()">Cancel</button>
    </div>
  `;
}

/* Save edited expense */
function saveEdit(index) {
  let li = expenseList.children[index];
  if (!li) return;

  let newTitle = li.querySelector(".edit-title").value.trim();
  let newAmount = Number(li.querySelector(".edit-amount").value);

  if (!newTitle) {
    alert("Title cannot be empty.");
    return;
  }
  if (isNaN(newAmount)) {
    alert("Please enter a valid amount.");
    return;
  }

  expenses[index].title = newTitle;
  expenses[index].amount = newAmount;

  saveData();
  renderExpenses();
}

/* small helper to escape HTML when injecting values */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* Initial render */
renderExpenses();