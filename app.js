var Model = (function () {

    var itemList = [];

    return {
        addItemToDB: function (itemToAdd) {
            itemList.push(itemToAdd);
            return itemToAdd
        },

        removeItemFromDB: function (itemsToRemove) {
            var temp = itemList.filter(function (item, index) {
                if (itemsToRemove.indexOf(index) == -1)
                    return item
            })
            itemList = temp;
            return itemsToRemove;
        },

        printItemList: function () {
            console.log("Item list: " + itemList)
        }
    }
})();


var View = (function () {

    var DOMstrings = {
        addBtn: '#button1',
        removeBtn: '#button2',
        input: '#userInput',
        list: '#myList',
        checkbox: ".checkbox"
    };

    return {
        getInput: function () {
            return document.querySelector(DOMstrings.input).value;
        },

        lookForChecked: function () {
            var box = document.querySelectorAll(DOMstrings.checkbox);
            arrayOfIndex = []

            for (i = 0; i < box.length; i++) {
                if (box[i].checked === true) {
                    arrayOfIndex.push(i);
                }
            }
            return arrayOfIndex;
        },

        showItemOnPage: function (itemToShow) {
            var li = document.createElement("li");
            li.innerHTML = `
            <input type="checkbox" class="checkbox">
            <span class="precrtano">${itemToShow}</span>`;
            document.querySelector(DOMstrings.list).appendChild(li)
        },

        removeItemFromPage: function (ItemsToRemove) {
            var list = document.querySelector(DOMstrings.list)
            var box = document.querySelectorAll(DOMstrings.checkbox);
            ItemsToRemove.map(function (i) {
                list.removeChild(box[i].parentElement)
            })
        },

        clearInputField: function () {
            document.querySelector(DOMstrings.input).value = "";
            document.querySelector(DOMstrings.input).focus();
        },

        getDOMstrings: function () {
            return DOMstrings;
        },
    }
})();


var Controller = (function (dataStorage, userInterface) {

    var setupEventListeners = function () {
        var DOM = userInterface.getDOMstrings();

        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                addItem();
            }
        });
        document.querySelector(DOM.addBtn).addEventListener('click', addItem);
        document.querySelector(DOM.removeBtn).addEventListener('click', deleteItem);
    };

    var addItem = function () {
        var input = userInterface.getInput();
        var newItem = dataStorage.addItemToDB(input);
        userInterface.showItemOnPage(newItem);
        userInterface.clearInputField();
        dataStorage.printItemList();
    };

    var deleteItem = function () {
        var checkedItems = userInterface.lookForChecked()
        var itemsRemovedFromDB = dataStorage.removeItemFromDB(checkedItems)
        userInterface.removeItemFromPage(itemsRemovedFromDB);
        dataStorage.printItemList();
    };

    return {
        init: function () {
            setupEventListeners();
        }
    };

})(Model, View);

Controller.init();