// Get the prompt toggle switch and prompt section
const promptToggle = document.querySelector('.prompt-toggle');

// Listen for changes to the prompt toggle switch
promptToggle.addEventListener('change', () => {
    // Check the toggle switch position and set the prompt type accordingly
    const promptType = promptToggle.checked ? 'post' : 'pre';

    // Get the prompts from local storage and render them in the prompt section
    const prompts = JSON.parse(localStorage.getItem(`${promptType}prompts`)) || [];
    renderPrompts(prompts, promptType);
});

// Function to render prompts in the prompt section
function renderPrompts(prompts, promptType) {

    const promptSection = document.querySelector('#prompt-section');
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

        // Check if the prompt already exists, and if so, update it
        const existingPromptIndex = prompts.findIndex(prompt => prompt.name === name);
        if (existingPromptIndex !== -1) {
            prompts[existingPromptIndex].text = text;
        } else {
            // Otherwise, add a new prompt to the array
            prompts.push({ name, text });
        }

        // Save the updated prompts to local storage and re-render the prompt section
        localStorage.setItem(`${promptType}prompts`, JSON.stringify(prompts));
        renderPrompts(prompts, promptType);

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

        // Find the index of the prompt to delete
        const promptIndex = prompts.findIndex(prompt => prompt.name === name);

        // Delete the prompt and update the prompt section
        prompts.splice(promptIndex, 1);
        localStorage.setItem(`${promptType}prompts`, JSON.stringify(prompts));
        renderPrompts(prompts, promptType);

        // Clear the inputs
        promptNameInput.value = '';
        promptTextInput.value = '';
    });
    buttonContainer.appendChild(saveButton);
    buttonContainer.appendChild(deleteButton);

    // Add the button container and the prompt elements to the prompt section
    promptSection.appendChild(promptSelect);
    promptSection.appendChild(promptNameInput);
    promptSection.appendChild(promptTextInput);
    promptSection.appendChild(buttonContainer);



    // Listen for changes to the prompt select element and populate the inputs with the selected prompt's values
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

// Initialize the prompt section with the pre-prompts
const prompts = JSON.parse(localStorage.getItem('preprompts')) || [];
renderPrompts(prompts, 'pre');