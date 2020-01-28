const model = (() => {
	return {
		storedItems: () => {
			return JSON.parse(localStorage.getItem('TO-DO-ITEMS')) || [];
		},

		addToStorage: item => {
			let lowercaseItem = item.toLowerCase().replace(/\s/g, '');
			let lowercaseArray = model.storedItems().map(item => {
				return item.toLowerCase().replace(/\s/g, '');
			});
			if (lowercaseArray.indexOf(lowercaseItem) === -1) {
				let temp = model.storedItems();
				temp.push(item.trim());
				localStorage.setItem('TO-DO-ITEMS', JSON.stringify(temp));
				return item.trim();
			}
		},

		removeFromStorage: indexesToRemove => {
			let temp = model.storedItems().filter((item, i) => {
				if (indexesToRemove.indexOf(i) === -1) return item;
			});
			localStorage.setItem('TO-DO-ITEMS', JSON.stringify(temp));
			return indexesToRemove;
		}
	};
})();

const view = (() => {
	const DOMstrings = {
		addBtn: '#add-button',
		removeBtn: '#remove-button',
		input: '#user-input',
		list: '#my-list',
		checkbox: '.checkbox',
		errorDiv: '#error-div'
	};

	return {
		inputValue: () => {
			return document.querySelector(DOMstrings.input).value;
		},

		indexesOfChecked: () => {
			let checkboxes = document.querySelectorAll(DOMstrings.checkbox);
			let indexes = [];
			for (i = 0; i < checkboxes.length; i++) {
				if (checkboxes[i].checked === true) {
					indexes.push(i);
				}
			}
			return indexes;
		},

		showStoredItems: items => {
			if (items.length > 0) {
				const list = document.querySelector(DOMstrings.list);
				items.map(item => {
					list.innerHTML += `<li>
											<input type="checkbox" class="checkbox" id=${item.toLowerCase().replace(/\s/g, '')}>
											<label class="crossout" for=${item.toLowerCase().replace(/\s/g, '')}>${item}</label>
										</li>`;
				});
			}
		},

		addItemOnPage: item => {
			let li = document.createElement('li');
			li.innerHTML = `<input type="checkbox" class="checkbox" 
							id=${item.toLowerCase().replace(/\s/g, '')}>
							<label class="crossout" for=${item.toLowerCase().replace(/\s/g, '')}>${item}</label>`;
			document.querySelector(DOMstrings.list).appendChild(li);
		},

		removeItemFromPage: itemsToRemove => {
			const list = document.querySelector(DOMstrings.list);
			let checkboxes = document.querySelectorAll(DOMstrings.checkbox);
			itemsToRemove.map(i => {
				list.removeChild(checkboxes[i].parentElement);
			});
		},

		clearInputField: () => {
			document.querySelector(DOMstrings.input).value = '';
			document.querySelector(DOMstrings.input).focus();
		},

		printError: message => {
			const errorField = document.querySelector(DOMstrings.errorDiv);
			errorField.innerText = message;
			setTimeout(() => {
				errorField.innerText = '';
			}, 1500);
		},

		getDOMstrings: () => {
			return DOMstrings;
		}
	};
})();

const controller = ((dataStorage, userInterface) => {
	const setupEventListeners = () => {
		const DOM = userInterface.getDOMstrings();
		document.addEventListener('keypress', event => {
			if (event.keyCode === 13 || event.which === 13) {
				addItem();
			}
		});
		document.querySelector(DOM.addBtn).addEventListener('click', addItem);
		document.querySelector(DOM.removeBtn).addEventListener('click', deleteItem);
	};

	const addItem = () => {
		let input = userInterface.inputValue();
		if (input !== '') {
			let newItem = dataStorage.addToStorage(input);
			if (newItem) {
				userInterface.addItemOnPage(newItem);
				userInterface.clearInputField();
			} else {
				userInterface.printError('item is aleredy in the list');
			}
		} else {
			userInterface.printError('please enter something you want to do');
		}
	};

	const deleteItem = () => {
		let indexesToRemove = userInterface.indexesOfChecked();
		if (indexesToRemove.length !== 0) {
			let itemsRemovedFromStorage = dataStorage.removeFromStorage(indexesToRemove);
			userInterface.removeItemFromPage(itemsRemovedFromStorage);
		}
	};

	return {
		init: () => {
			userInterface.showStoredItems(dataStorage.storedItems());
			setupEventListeners();
		}
	};
})(model, view);

controller.init();
