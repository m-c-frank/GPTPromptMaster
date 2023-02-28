CSVSEPARATOR = "\t";
// Get the prompt toggle switch and prompt section
const promptToggle = document.querySelector('.prompt-toggle');
const promptSection = document.querySelector('#prompt-section');
const resetButton = document.querySelector('#reset-button');

resetButton.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset all settings?')){
        chrome.storage.local.clear();
        location.reload();
    }
});

// Listen for changes to the prompt toggle switch
promptToggle.addEventListener('change', () => {
    // Check the toggle switch position and set the prompt type accordingly
    const promptType = promptToggle.checked ? 'post' : 'pre';

    // Get the prompts from storage and render them in the prompt section
    chrome.storage.local.get(promptType + 'prompts', function (data) {
        const prompts = data[promptType + 'prompts'] || [];
        renderPrompts(prompts, promptType);
    });
});

function clearPromptSection() {
    promptSection.innerHTML = '';
}

function createPromptSelect(prompts, promptType) {
    const promptSelect = document.createElement('select');
    promptSelect.classList.add('prompt-select');
    promptSelect.innerHTML = `<option value="" disabled selected>Select a ${promptType}prompt</option>`;

    prompts.forEach(prompt => {
        const option = document.createElement('option');
        option.value = prompt.name;
        option.text = prompt.name;
        promptSelect.appendChild(option);
    });

    return promptSelect;
}

function createPromptNameInput() {
    const promptNameInput = document.createElement('input');
    promptNameInput.classList.add('prompt-name-input');
    promptNameInput.type = 'text';
    promptNameInput.placeholder = 'Enter a name for your prompt';

    return promptNameInput;
}

function createPromptTextInput(promptType) {
    const promptTextInput = document.createElement('textarea');
    promptTextInput.classList.add('prompt-text-input');
    promptTextInput.placeholder = `Enter your ${promptType}prompt text`;

    return promptTextInput;
}

function createButtonContainer() {
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container');

    return buttonContainer;
}

function createSaveButton(promptNameInput, promptTextInput, promptType, prompts) {
    const saveButton = document.createElement('button');
    saveButton.classList.add('save-button');
    saveButton.classList.add('settings-button');
    saveButton.textContent = 'Save';
    saveButton.addEventListener('click', () => {
        const name = promptNameInput.value;
        const text = promptTextInput.value;

        if (name.trim() === '' || text.trim() === '') {
            alert('Please enter a name and text for your prompt.');
            return;
        }

        savePrompt({ name, text }, promptType);
        renderPrompts(prompts, promptType);

        promptNameInput.value = '';
        promptTextInput.value = '';
    });

    return saveButton;
}

function createDeleteButton(promptNameInput, promptTextInput, promptType, prompts) {
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-button');
    deleteButton.classList.add('settings-button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => {
        const name = promptNameInput.value;
        
        deletePrompt(name, promptType);
        renderPrompts(prompts, promptType);
    
        promptNameInput.value = '';
        promptTextInput.value = '';
    });
    

    return deleteButton;
}


function createImportButton(promptType, prompts) {
    const importButton = document.createElement('button');
    importButton.classList.add('import-button');
    importButton.classList.add('settings-button');
    importButton.textContent = 'Import';
    importButton.addEventListener('click', () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.txt,.csv';

        fileInput.addEventListener('change', event => {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = () => {
                const importedPrompts = parsePrompts(reader.result);
                mergePrompts(importedPrompts, promptType, prompts);
            };
            reader.readAsText(file);
        });

        fileInput.click();
    });

    return importButton;
}

function parsePrompts(fileContents) {
    const lines = fileContents.split('\n');
    const prompts = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        if (line) {
            const [name, text] = line.split(CSVSEPARATOR);
            prompts.push({ name: name.trim(), text: text.trim() });
        }
    }

    return prompts;
}

function mergePrompts(importedPrompts, promptType, prompts) {
    const mergedPrompts = [...prompts];

    for (let i = 0; i < importedPrompts.length; i++) {
        const importedPrompt = importedPrompts[i];
        const existingPromptIndex = mergedPrompts.findIndex(p => p.name === importedPrompt.name);

        if (existingPromptIndex !== -1) {
            mergedPrompts[existingPromptIndex].text = importedPrompt.text;
        } else {
            mergedPrompts.push(importedPrompt);
        }
    }

    chrome.storage.local.set({ [promptType + 'prompts']: mergedPrompts }, function () {
        renderPrompts(mergedPrompts, promptType);
    });
}

function createExportButton(promptType, prompts) {
    const exportButton = document.createElement('button');
    exportButton.classList.add('export-button');
    exportButton.classList.add('settings-button');
    exportButton.textContent = 'Export';
    exportButton.addEventListener('click', () => {
        const promptsString = stringifyPrompts(prompts);
        const filename = promptType + 'prompts.csv';
        download(promptsString, filename, 'text/csv');
    });

    return exportButton;
}

function stringifyPrompts(prompts) {
    let promptsString = '';

    for (let i = 0; i < prompts.length; i++) {
        const prompt = prompts[i];
        promptsString += `${prompt.name}${CSVSEPARATOR}${prompt.text}\n`;
    }

    return promptsString;
}

function download(data, filename, type) {
    const file = new Blob([data], { type: type });
    const a = document.createElement('a');
    const url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 0);
}

function addElementsToPromptSection(promptSelect, promptNameInput, promptTextInput, buttonContainer, promptType, prompts) {
    promptSection.appendChild(promptSelect);
    promptSection.appendChild(promptNameInput);
    promptSection.appendChild(promptTextInput);
    promptSection.appendChild(buttonContainer);
    buttonContainer.appendChild(createSaveButton(promptNameInput, promptTextInput, promptType, prompts));
    buttonContainer.appendChild(createDeleteButton(promptNameInput, promptTextInput, promptType, prompts));
    buttonContainer.appendChild(createImportButton(promptType, prompts));
    buttonContainer.appendChild(createExportButton(promptType, prompts));
}

function renderPrompts(prompts, promptType) {
    clearPromptSection();

    const promptSelect = createPromptSelect(prompts, promptType);
    const promptNameInput = createPromptNameInput();
    const promptTextInput = createPromptTextInput(promptType);
    const buttonContainer = createButtonContainer();

    addElementsToPromptSection(promptSelect, promptNameInput, promptTextInput, buttonContainer, promptType, prompts);

    promptSelect.addEventListener('change', () => {
        const name = promptSelect.value;
        const prompt = prompts.find(prompt => prompt.name === name);

        if (prompt) {
            promptNameInput.value = prompt.name;
            promptTextInput.value = prompt.text;
        } else {
            promptNameInput.value = '';
            promptTextInput.value = '';
        }
    });
}

// Function to save a prompt to storage
function savePrompt(prompt, promptType) {
    chrome.storage.local.get(promptType + 'prompts', function (data) {
        const prompts = data[promptType + 'prompts'] || [];

        // Check if the prompt already exists, and if so, update it
        const existingPromptIndex = prompts.findIndex(p => p.name === prompt.name);
        if (existingPromptIndex !== -1) {
            prompts[existingPromptIndex].text = prompt.text;
        } else {
            // Otherwise, add a new prompt to the array
            prompts.push(prompt);
        }

        // Save the updated prompts to storage and re-render the prompt section
        chrome.storage.local.set({ [promptType + 'prompts']: prompts }, function () {
            renderPrompts(prompts, promptType);
        });
    });
}

// Function to delete a prompt from storage
function deletePrompt(promptName, promptType) {
    chrome.storage.local.get(promptType + 'prompts', function (data) {
        const prompts = data[promptType + 'prompts'] || [];

        // Find the index of the prompt to delete
        const promptIndex = prompts.findIndex(p => p.name === promptName);

        // Delete the prompt and save the updated prompts to storage
        if (promptIndex !== -1) {
            prompts.splice(promptIndex, 1);
            chrome.storage.local.set({ [promptType + 'prompts']: prompts }, function () {
                renderPrompts(prompts, promptType);
            });
        }
    });
}

// Initialize the prompt section with the pre-prompts
chrome.storage.local.get('preprompts', function (data) {
    const prompts = data.preprompts || [];
    renderPrompts(prompts, 'pre');
});