// ============================================
// FINJARVIS - PERSONAL FINANCE MANAGER
// ============================================


// ============================================
// INITIAL DATA
// ============================================

let transactions = JSON.parse(
    localStorage.getItem("finjarvisTransactions")
) || [

    {
        id: 1,
        type: "income",
        description: "Monthly Salary",
        category: "Salary",
        amount: 50000,
        date: "Today"
    },

    {
        id: 2,
        type: "expense",
        description: "Grocery Shopping",
        category: "Food",
        amount: 2500,
        date: "Today"
    },

    {
        id: 3,
        type: "expense",
        description: "Electricity Bill",
        category: "Bills",
        amount: 1800,
        date: "Yesterday"
    },

    {
        id: 4,
        type: "expense",
        description: "Travel",
        category: "Transport",
        amount: 1200,
        date: "Yesterday"
    }

];


let transactionType = "income";

let balanceVisible = true;


// ============================================
// SAVE DATA
// ============================================

function saveData() {

    localStorage.setItem(
        "finjarvisTransactions",
        JSON.stringify(transactions)
    );

}


// ============================================
// FORMAT CURRENCY
// ============================================

function currency(amount) {

    return new Intl.NumberFormat(
        "en-IN",
        {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }
    ).format(amount);

}


// ============================================
// CALCULATE FINANCES
// ============================================

function getIncome() {

    return transactions
        .filter(t => t.type === "income")
        .reduce(
            (total, t) => total + t.amount,
            0
        );

}


function getExpenses() {

    return transactions
        .filter(t => t.type === "expense")
        .reduce(
            (total, t) => total + t.amount,
            0
        );

}


function getBalance() {

    return getIncome() - getExpenses();

}


// ============================================
// UPDATE DASHBOARD
// ============================================

function updateDashboard() {

    const income = getIncome();

    const expenses = getExpenses();

    const balance = income - expenses;


    document.getElementById(
        "totalBalance"
    ).textContent = balanceVisible
        ? currency(balance)
        : "••••••";


    document.getElementById(
        "totalIncome"
    ).textContent = currency(income);


    document.getElementById(
        "totalExpense"
    ).textContent = currency(expenses);


    updateRecentTransactions();

    updateAnalytics();

    generateInsight();

}


// ============================================
// RECENT TRANSACTIONS
// ============================================

function updateRecentTransactions() {

    const container =
        document.getElementById(
            "recentTransactions"
        );


    const recent =
        [...transactions]
            .reverse()
            .slice(0, 5);


    container.innerHTML = "";


    if (recent.length === 0) {

        container.innerHTML =
            "<p>No transactions yet.</p>";

        return;

    }


    recent.forEach(transaction => {

        container.innerHTML +=
            createTransactionHTML(transaction);

    });

}


// ============================================
// ALL TRANSACTIONS
// ============================================

function updateAllTransactions() {

    const container =
        document.getElementById(
            "allTransactions"
        );


    container.innerHTML = "";


    [...transactions]
        .reverse()
        .forEach(transaction => {

            container.innerHTML +=
                createTransactionHTML(transaction);

        });

}


// ============================================
// TRANSACTION HTML
// ============================================

function createTransactionHTML(transaction) {

    const icon =
        getCategoryIcon(
            transaction.category
        );


    const sign =
        transaction.type === "income"
            ? "+"
            : "-";


    return `

        <div class="transaction">

            <div class="transaction-icon">
                ${icon}
            </div>

            <div class="transaction-info">

                <b>
                    ${transaction.description}
                </b>

                <small>
                    ${transaction.category}
                    • ${transaction.date}
                </small>

            </div>

            <div
                class="transaction-amount
                ${transaction.type}"
            >

                ${sign}${currency(transaction.amount)}

            </div>

        </div>

    `;

}


// ============================================
// CATEGORY ICON
// ============================================

function getCategoryIcon(category) {

    const icons = {

        Food: "🍔",

        Transport: "🚗",

        Shopping: "🛍️",

        Bills: "💡",

        Entertainment: "🎬",

        Salary: "💼",

        Investment: "📈",

        Other: "💰"

    };


    return icons[category] || "💰";

}


// ============================================
// PAGE NAVIGATION
// ============================================

function showPage(pageName) {

    document
        .querySelectorAll(".page")
        .forEach(page => {

            page.classList.remove("active");

        });


    document
        .getElementById(pageName)
        .classList.add("active");


    document
        .querySelectorAll(".nav-item")
        .forEach(item => {

            item.classList.remove("active");


            if (
                item.dataset.page === pageName
            ) {

                item.classList.add("active");

            }

        });


    if (pageName === "transactions") {

        updateAllTransactions();

    }

}


// ============================================
// BALANCE VISIBILITY
// ============================================

function toggleBalance() {

    balanceVisible =
        !balanceVisible;

    updateDashboard();

}


// ============================================
// TRANSACTION MODAL
// ============================================

function openTransactionModal(type) {

    document
        .getElementById(
            "transactionModal"
        )
        .classList.add("show");


    if (type) {

        selectType(type);

    }

}


function closeTransactionModal() {

    document
        .getElementById(
            "transactionModal"
        )
        .classList.remove("show");

}


// ============================================
// SELECT TRANSACTION TYPE
// ============================================

function selectType(type) {

    transactionType = type;


    document
        .getElementById("incomeType")
        .classList.remove("selected");


    document
        .getElementById("expenseType")
        .classList.remove("selected");


    document
        .getElementById(
            type === "income"
                ? "incomeType"
                : "expenseType"
        )
        .classList.add("selected");

}


// ============================================
// SAVE TRANSACTION
// ============================================

function saveTransaction() {

    const amount =
        Number(
            document.getElementById(
                "amountInput"
            ).value
        );


    const description =
        document.getElementById(
            "descriptionInput"
        ).value.trim();


    const category =
        document.getElementById(
            "categoryInput"
        ).value;


    if (!amount || amount <= 0) {

        alert("Please enter a valid amount.");

        return;

    }


    if (!description) {

        alert("Please enter a description.");

        return;

    }


    const transaction = {

        id: Date.now(),

        type: transactionType,

        description,

        category,

        amount,

        date: "Today"

    };


    transactions.push(transaction);


    saveData();


    document.getElementById(
        "amountInput"
    ).value = "";


    document.getElementById(
        "descriptionInput"
    ).value = "";


    closeTransactionModal();


    updateDashboard();


    alert("Transaction added successfully.");

}


// ============================================
// ANALYTICS
// ============================================

function updateAnalytics() {

    const income = getIncome();

    const expenses = getExpenses();


    const max =
        Math.max(income, expenses, 1);


    const incomeHeight =
        Math.max(
            20,
            (income / max) * 160
        );


    const expenseHeight =
        Math.max(
            20,
            (expenses / max) * 160
        );


    document.getElementById(
        "incomeBar"
    ).style.height =
        incomeHeight + "px";


    document.getElementById(
        "expenseBar"
    ).style.height =
        expenseHeight + "px";


    updateCategories();

}


// ============================================
// CATEGORY ANALYTICS
// ============================================

function updateCategories() {

    const container =
        document.getElementById(
            "categoryList"
        );


    const expenses =
        transactions.filter(
            t => t.type === "expense"
        );


    const categories = {};


    expenses.forEach(transaction => {

        if (!categories[transaction.category]) {

            categories[
                transaction.category
            ] = 0;

        }


        categories[
            transaction.category
        ] += transaction.amount;

    });


    const sorted =
        Object.entries(categories)
            .sort(
                (a, b) => b[1] - a[1]
            );


    const total =
        getExpenses() || 1;


    container.innerHTML = "";


    sorted.forEach(([category, amount]) => {

        const percentage =
            Math.round(
                (amount / total) * 100
            );


        container.innerHTML += `

            <div class="category">

                <div class="category-top">

                    <span>
                        ${getCategoryIcon(category)}
                        ${category}
                    </span>

                    <strong>
                        ${currency(amount)}
                    </strong>

                </div>

                <div class="progress">

                    <span
                        style="width:${percentage}%"
                    ></span>

                </div>

            </div>

        `;

    });

}


// ============================================
// AI INSIGHT
// ============================================

function generateInsight() {

    const income = getIncome();

    const expenses = getExpenses();

    const balance = income - expenses;


    let insight = "";


    if (income === 0) {

        insight =
            "Add your income to let FINJARVIS analyze your finances.";

    }

    else {

        const savingRate =
            ((income - expenses) / income) * 100;


        if (savingRate >= 30) {

            insight =
                `Great job! Your current estimated saving rate is ${savingRate.toFixed(0)}%.`;

        }

        else if (savingRate >= 15) {

            insight =
                `You're saving around ${savingRate.toFixed(0)}% of your income. There may be room to increase it.`;

        }

        else if (savingRate > 0) {

            insight =
                `Your estimated saving rate is ${savingRate.toFixed(0)}%. Consider reviewing your largest expenses.`;

        }

        else {

            insight =
                "Your expenses currently exceed your income. FINJARVIS recommends reviewing your spending.";

        }

    }


    document.getElementById(
        "dashboardInsight"
    ).textContent = insight;

}


// ============================================
// AI ASSISTANT
// ============================================

function askAI(question) {

    addUserMessage(question);


    setTimeout(() => {

        const response =
            generateAIResponse(question);


        addBotMessage(response);

    }, 500);

}


function sendAIMessage() {

    const input =
        document.getElementById(
            "aiInput"
        );


    const question =
        input.value.trim();


    if (!question) return;


    input.value = "";


    askAI(question);

}


function handleAIEnter(event) {

    if (event.key === "Enter") {

        sendAIMessage();

    }

}


// ============================================
// AI RESPONSE ENGINE
// ============================================

function generateAIResponse(question) {

    const q =
        question.toLowerCase();


    const income = getIncome();

    const expenses = getExpenses();

    const balance = income - expenses;


    if (
        q.includes("spend") ||
        q.includes("expense")
    ) {

        return `
            You've recorded
            ${currency(expenses)}
            in expenses.
            Your current balance is
            ${currency(balance)}.
        `;

    }


    if (
        q.includes("saving") ||
        q.includes("save")
    ) {

        if (income === 0) {

            return `
                Add your income and expenses first,
                then I can estimate your saving rate.
            `;

        }


        const rate =
            ((income - expenses) / income) * 100;


        return `
            Your estimated saving rate is
            ${rate.toFixed(1)}%.
            A useful next step is to review your
            largest spending category.
        `;

    }


    if (
        q.includes("budget")
    ) {

        return `
            Based on your current transactions,
            you have ${currency(balance)} remaining
            after recorded expenses.
            Try setting category-based monthly limits
            for food, transport and shopping.
        `;

    }


    if (
        q.includes("balance") ||
        q.includes("money")
    ) {

        return `
            Your current calculated balance is
            ${currency(balance)}.
        `;

    }


    if (
        q.includes("invest")
    ) {

        return `
            Your investment section can be used to
            monitor your portfolio. Remember that
            investment decisions involve risk, so
            review products carefully before investing.
        `;

    }


    return `
        I can help you understand your spending,
        savings, budget and investment tracking.
        Try asking "How much did I spend?"
        or "Give me a saving tip".
    `;

}


// ============================================
// ADD CHAT MESSAGE
// ============================================

function addUserMessage(message) {

    const container =
        document.getElementById(
            "chatMessages"
        );


    container.innerHTML += `

        <div class="user-chat">
            ${escapeHTML(message)}
        </div>

    `;

}


function addBotMessage(message) {

    const container =
        document.getElementById(
            "chatMessages"
        );


    container.innerHTML += `

        <div class="bot-chat">
            🤖 ${message}
        </div>

    `;


    container.scrollTop =
        container.scrollHeight;

}


// ============================================
// BASIC HTML ESCAPE
// ============================================

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


// ============================================
// NOTIFICATION
// ============================================

function showNotification() {

    alert(
        "FINJARVIS: No new financial alerts."
    );

}


// ============================================
// INITIALIZE
// ============================================

updateDashboard();
