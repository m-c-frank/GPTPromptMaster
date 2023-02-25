// Get the prompt toggle switch and prompt section
const promptToggle = document.querySelector('.prompt-toggle');
const promptSection = document.querySelector('#prompt-section');

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

// Function to render prompts in the prompt section
function renderPrompts(prompts, promptType) {
    // Clear the prompt section
    promptSection.innerHTML = '';

    // Create a select element for the prompts
    const promptSelect = document.createElement('select');
    promptSelect.classList.add('prompt-select');
    promptSelect.innerHTML = `<option value="" disabled selected>Select a ${promptType}prompt</option>`;

    // Add each prompt as an option in the select element
    prompts.forEach(prompt => {
        const option = document.createElement('option');
        option.value = prompt.name;
        option.text = prompt.name;
        promptSelect.appendChild(option);
    });

    // Create a text input for the prompt name
    const promptNameInput = document.createElement('input');
    promptNameInput.classList.add('prompt-name-input');
    promptNameInput.type = 'text';
    promptNameInput.placeholder = 'Enter a name for your prompt';

    // Create a textarea for the prompt text
    const promptTextInput = document.createElement('textarea');
    promptTextInput.classList.add('prompt-text-input');
    promptTextInput.placeholder = `Enter your ${promptType}prompt text`;

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container');

    // Create a save button for the prompt
    const saveButton = document.createElement('button');
    saveButton.classList.add('save-button');
    saveButton.classList.add('settings-button');
    saveButton.textContent = 'Save';
    saveButton.addEventListener('click', () => {
        const name = promptNameInput.value;
        const text = promptTextInput.value;

        // Validate that the name and text are not empty
        if (name.trim() === '' || text.trim() === '') {
            alert('Please enter a name and text for your prompt.');
            return;
        }

        // Save the prompt to storage and re-render the prompt section
        savePrompt({ name, text }, promptType);

        // Clear the inputs
        promptNameInput.value = '';
        promptTextInput.value = '';
    });

    // Create a delete button for the prompt
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-button');
    deleteButton.classList.add('settings-button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => {
        const name = promptNameInput.value;

        // Delete the prompt from storage and re-render the prompt section
        deletePrompt(name, promptType);

        // Clear the inputs
        promptNameInput.value = '';
        promptTextInput.value = '';
    });

    // Add the button container and the prompt elements to the prompt section
    promptSection.appendChild(promptSelect);
    promptSection.appendChild(promptNameInput);
    promptSection.appendChild(promptTextInput);
    promptSection.appendChild(buttonContainer);
    buttonContainer.appendChild(saveButton);
    buttonContainer.appendChild(deleteButton);

    // Listen for changes to the prompt select element and populate the
    // inputs with the selected prompt's values
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