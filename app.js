///// UI Controller 
const UICtrl = (function() {

    const UISelectors = {
        // Element selection
        balance: document.querySelector(".balance .value"),
        incomeTotal: document.querySelector(".income-total"),
        outcomeTotal: document.querySelector(".outcome-total"),
        income: document.querySelector("#income"),
        expense: document.querySelector("#expense"),
        all: document.querySelector("#all"),
        incomeList: document.querySelector("#income .list"),
        expenseList: document.querySelector("#expense .list"),
        allList: document.querySelector("#all .list"),
        // Buttons selections
        expenseBtn: document.querySelector(".tab1"),
        incomeBtn: document.querySelector(".tab2"),
        allBtn: document.querySelector(".tab3"),
        addExpense: document.querySelector(".add-expense"),
        expenseTitle: document.querySelector("#expense-title-input"),
        expenseAmount: document.querySelector("#expense-amount-input"),
        addIncome: document.querySelector(".add-income"),
        incomeTitle: document.querySelector("#income-title-input"),
        incomeAmount: document.querySelector("#income-amount-input")
    }

    // Some variables for use
    let entryList = []
    let [balanceValue, incomeValue, outcomeValue] = [0, 0, 0]
    const Delete = "delete",
        Edit = "edit"

    // public function
    return {
        // Access UI list publicly
        getUISelectors: function() {
            return UISelectors
        },
        getValues: function() {
            return [incomeValue, outcomeValue]
        },

        // Access entry list
        getEntryList: function() {
            return entryList
        },

        // Push value to entry list
        pushToEntryList: function(value) {
            entryList.push(value)
        },

        // Active function
        active: function(element) {
            element.classList.add("active")
        },

        // Inactive element
        inactive: function(elementList) {
            elementList.forEach(element => {
                element.classList.remove("active")
            })
        },

        // Hide element
        hide: function(elementList) {
            elementList.forEach(element => {
                element.classList.add("hide")
            })
        },

        // show element
        show: function(element) {
            element.classList.remove("hide")
        },

        // clear the Input
        clearInput: function(inputList) {
            inputList.forEach(input => {
                input.value = ""
            })
        },

        // Clear the elements
        clearElement: function(elementList) {
            elementList.forEach(element => {
                element.innerHTML = ""
            })
        },

        // show Entry
        showEntry: function(list, type, title, amount, id) {
            const entry = `<li id="${id}" class="${type}">
                            <div class="entry">${title} : ${amount} RS</div>
                            <div id="edit"></div>
                            <div id="delete"></div>
                      </li>`

            const position = "afterbegin"

            list.insertAdjacentHTML(position, entry)
        },

        // delete or edit 
        deleteOrEdit: function(event) {
            const targetBtn = event.target

            const entry = targetBtn.parentNode

            if (targetBtn.id == Delete) {
                UICtrl.deleteEntry(entry)
            } else if (targetBtn.id == Edit) {
                UICtrl.editEntry(entry)
            }

            event.preventDefault()
        },

        // delete entry function
        deleteEntry: function(entry) {
            entryList.splice(entry.id, 1)
            UICtrl.updateUI()
        },

        // Edit entry
        editEntry: function(entry) {
            let Entry = entryList[entry.id]

            if (Entry.type == "income") {
                UISelectors.incomeAmount.value = Entry.amount
                UISelectors.incomeTitle.value = Entry.title
            } else if (Entry.type == "expense") {
                UISelectors.expenseAmount.value = Entry.amount
                UISelectors.expenseTitle.value = Entry.title
            }

            UICtrl.deleteEntry(entry)
        },

        // update UI function
        updateUI: function() {
            incomeValue = App.calculateTotal("income", entryList)
            outcomeValue = App.calculateTotal("expense", entryList)
            balanceValue = App.calculateBalance(incomeValue, outcomeValue)

            // Update ui
            UISelectors.balance.innerHTML = `${balanceValue}<small> RS</small>`
            UISelectors.outcomeTotal.innerHTML = `${outcomeValue}<small> RS</small>`
            UISelectors.incomeTotal.innerHTML = `${incomeValue}<small> RS</small>`

            UICtrl.clearElement([UISelectors.expenseList, UISelectors.incomeList, UISelectors.allList])

            entryList.forEach((entry, index) => {
                if (entry.type == "expense") {
                    UICtrl.showEntry(UISelectors.expenseList, entry.type, entry.title, entry.amount, index)
                } else if (entry.type == "income") {
                    UICtrl.showEntry(UISelectors.incomeList, entry.type, entry.title, entry.amount, index)
                }
                UICtrl.showEntry(UISelectors.allList, entry.type, entry.title, entry.amount, index)
            })

            // Add update chart function
            updateChart(incomeValue, outcomeValue)

            localStorage.setItem("entry_list", JSON.stringify(entryList));
        },

        // Load storage data
        loadLocalStorage: function() {
            entryList = JSON.parse(localStorage.getItem("entry_list")) || []
            UICtrl.updateUI()
        }

    }

})()

///// App 
const App = (function(UICtrl) {
    const UISelectors = UICtrl.getUISelectors()

    const LoadEventListener = function() {

        UISelectors.incomeList.addEventListener("click", UICtrl.deleteOrEdit)
        UISelectors.expenseList.addEventListener("click", UICtrl.deleteOrEdit)
        UISelectors.allList.addEventListener("click", UICtrl.deleteOrEdit)

        UISelectors.addIncome.addEventListener("click", function(e) {
            // If input is empty
            if (UISelectors.incomeTitle.value == "" && UISelectors.incomeAmount.value == "") {
                console.log("error")
                alert("please entry input")
            } else {
                // Save the entry to entryList
                let income = {
                    type: "income",
                    title: UISelectors.incomeTitle.value,
                    amount: parseInt(UISelectors.incomeAmount.value)
                }

                // push value to entryList
                UICtrl.pushToEntryList(income)

                UICtrl.updateUI()
                UICtrl.clearInput([UISelectors.incomeTitle, UISelectors.incomeAmount])

                e.preventDefault()
            }
        })

        UISelectors.addExpense.addEventListener("click", function(e) {
            // If input is empty
            if (UISelectors.expenseTitle.value == "" || UISelectors.expenseAmount.value == "") {
                console.log("error")
                alert("please entry input")
            } else {
                // Save the entry to entryList
                let expense = {
                    type: "expense",
                    title: UISelectors.expenseTitle.value,
                    amount: parseInt(UISelectors.expenseAmount.value)
                }

                // push value to entryList
                UICtrl.pushToEntryList(expense)

                UICtrl.updateUI()
                UICtrl.clearInput([UISelectors.expenseTitle, UISelectors.expenseAmount])

                e.preventDefault()
            }
        })

        UISelectors.allBtn.addEventListener("click", function(e) {
            UICtrl.show(UISelectors.all)
            UICtrl.hide([UISelectors.income, UISelectors.expense])
            UICtrl.active(UISelectors.allBtn)
            UICtrl.inactive([UISelectors.incomeBtn, UISelectors.expenseBtn])

            e.preventDefault()
        })

        UISelectors.incomeBtn.addEventListener("click", function(e) {
            UICtrl.show(UISelectors.income)
            UICtrl.hide([UISelectors.expense, UISelectors.all])
            UICtrl.active(UISelectors.incomeBtn)
            UICtrl.inactive([UISelectors.expenseBtn, UISelectors.allBtn])

            e.preventDefault()
        })

        UISelectors.expenseBtn.addEventListener("click", function(e) {
            UICtrl.show(UISelectors.expense)
            UICtrl.hide([UISelectors.income, UISelectors.all])
            UICtrl.active(UISelectors.expenseBtn)
            UICtrl.inactive([UISelectors.incomeBtn, UISelectors.allBtn])

            e.preventDefault()
        })

    }

    // public function
    return {
        init: function() {
            console.log("initializing app")

            // Load the localStorage data if any
            UICtrl.loadLocalStorage()

            // Loading event listener
            LoadEventListener()
        },
        // Calculate total
        calculateTotal: function(type, list) {
            let sum = 0

            list.forEach(element => {
                if (element.type == type) {
                    sum += element.amount
                }
            })

            return sum
        },
        // Calculate Balance
        calculateBalance: function(income, outcome) {
            return income - outcome
        }
    }
})(UICtrl)

App.init()