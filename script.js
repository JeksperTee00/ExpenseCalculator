let userPayments = [];
let userNames = [];

function generateTextboxes() {
    const num = document.getElementById("numOfTextboxes").value;
    const tableBody = document.getElementById("tableBody");
    tableBody.innerHTML = ""; // Clear the table
    document.getElementById("result").innerHTML = ""; // Clear results
    userPayments = [];
    userNames = [];

    for (let i = 1; i <= num; i++) {
        const row = document.createElement("tr");

        // Name Column
        const nameCell = document.createElement("td");
        const nameInput = document.createElement("input");
        nameInput.type = "text";
        nameInput.id = `user${i}_name`;
        nameInput.value = `user ${i}`;
        nameInput.disabled = true; // Initially disabled
        nameCell.appendChild(nameInput);

        // Expense Column
        const expenseCell = document.createElement("td");
        const expenseInput = document.createElement("input");
        expenseInput.type = "number";
        expenseInput.id = `user${i}_expense`;
        expenseInput.placeholder = "Enter expense";
        expenseInput.style.display = "inline"; // Ensure visibility
        expenseCell.appendChild(expenseInput);

        // Action Column
        const actionCell = document.createElement("td");
        const editButton = createButton("Edit", () => toggleEditMode(i, true));
        const saveButton = createButton("Save", () => toggleEditMode(i, false), "none");
        const addButton = createButton("Add", () => addExpense(i));
        actionCell.append(editButton, saveButton, addButton);

        // Total Column
        const totalCell = document.createElement("td");
        const totalDiv = document.createElement("div");
        totalDiv.id = `user${i}_total`;
        totalDiv.textContent = `$0.00`;
        totalCell.appendChild(totalDiv);

        // Add row to table
        row.append(nameCell, expenseCell, actionCell, totalCell);
        tableBody.appendChild(row);

        // Initialize user data
        userNames.push(`user ${i}`);
        userPayments.push({ userId: i, paid: 0 });
    }
}

function createButton(text, onClick, display = "inline") {
    const button = document.createElement("button");
    button.textContent = text;
    button.onclick = onClick;
    button.style.display = display; // "inline" or "none"
    return button;
}

function toggleEditMode(userId, isEditing) {
    const nameInput = document.getElementById(`user${userId}_name`);
    const editButton = nameInput.parentElement.nextElementSibling.nextElementSibling.children[0];
    const saveButton = nameInput.parentElement.nextElementSibling.nextElementSibling.children[1];

    // Toggle edit/save button visibility
    nameInput.disabled = !isEditing; // Enable/disable name input
    editButton.style.display = isEditing ? "none" : "inline";
    saveButton.style.display = isEditing ? "inline" : "none";

    // Save the updated name on "Save"
    if (!isEditing) {
        userNames[userId - 1] = nameInput.value; // Update name
    }
}

function addExpense(userId) {
    const expenseInput = document.getElementById(`user${userId}_expense`);
    const totalDiv = document.getElementById(`user${userId}_total`);

    let newExpense = parseFloat(expenseInput.value) || 0;
    let currentTotal = parseFloat(totalDiv.textContent.replace("$", "")) || 0;

    currentTotal += newExpense;
    totalDiv.textContent = `$${currentTotal.toFixed(2)}`;
    userPayments[userId - 1].paid = currentTotal;
    expenseInput.value = ""; // Clear input
}

function resetForm() {
    document.getElementById("numOfTextboxes").value = 1;
    document.getElementById("tableBody").innerHTML = "";
    document.getElementById("result").innerHTML = "";
    userPayments = [];
    userNames = [];
}

function calculate() {
    const totalExpenses = userPayments.reduce((sum, user) => sum + user.paid, 0);
    const share = totalExpenses / userPayments.length;

    let result = [];
    let needsToPay = [];
    let needsToReceive = [];

    userPayments.forEach((user, index) => {
        const balance = user.paid - share;
        if (balance < 0) needsToPay.push({ name: userNames[index], amount: -balance });
        if (balance > 0) needsToReceive.push({ name: userNames[index], amount: balance });
    });

    needsToPay.forEach(payer => {
        needsToReceive.forEach(receiver => {
            if (payer.amount > 0 && receiver.amount > 0) {
                const amountToPay = Math.min(payer.amount, receiver.amount);
                result.push(`${payer.name} pays ${receiver.name} $${amountToPay.toFixed(2)}`);
                payer.amount -= amountToPay;
                receiver.amount -= amountToPay;
            }
        });
    });

    document.getElementById("result").innerHTML = result.join("<br>") || "All users have settled their expenses.";
}
