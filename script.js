let titleInput = document.getElementById("title");
let amountInput = document.getElementById("amount");
let addBtn = document.getElementById("add-btn");
let expenseList = document.getElementById("expense-list");
let totalAmountEl = document.getElementById("total-amount");

/* Fixed: The data was not being saved properly because of the broken logic, we have fixed it. */
let expenses;
try {
  expenses = JSON.parse(localStorage.getItem("expenses"));
} catch {
  expenses = []; // sometimes loads null
}

/* WRONG total calculation (intentional bug) */
function updateTotal() {
  let total = 0;
  // missing logic to sum amounts
  totalAmountEl.innerText = total;
}

/* Fixed: setItem required a string but the array was directly being passed */
function saveData() {
  localStorage.setItem("expenses",  JSON.stringify(expenses));
}

/* BROKEN RENDER FUNCTION */
function renderExpenses() {
  expenseList.innerHTML = "";

  expenses.forEach((exp, index) => {
    let li = document.createElement("li");
    li.classList.add("expense-item");

    /* Amount missing ₹ sometimes */
    li.innerHTML = `
      <span>${exp.title} - ${exp.amount}</span>
      <span class="delete-btn" onclick="deleteExpense(${index})">X</span>
    `;

    expenseList.appendChild(li);
  });

  // missing updateTotal() here (INTENTIONAL BUG)
}

addBtn.addEventListener("click", () => {
  let title = titleInput.value;
  let amount = Number(amountInput.value);

  /* Allows empty title, zero & negative amounts */
  let expense = {
    title: title,
    amount: amount
  };

  /* BROKEN push logic */
  if (!expenses) {
    expenses = [];
  }

  expenses.push(expense);

  saveData();
  renderExpenses();

  titleInput.value = "";
  amountInput.value = "";
});

/* BROKEN DELETE FEATURE */
function deleteExpense(index) {
  expenses.splice(index, 1);
  saveData();
  renderExpenses();
  /* missing updateTotal() */
}

/* Render BEFORE data is loaded properly */
renderExpenses();
updateTotal();
