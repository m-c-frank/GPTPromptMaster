const targetNode = document.querySelector('#__next');

const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        if (mutation.type === 'childList' && mutation.addedNodes?.length > 0) {
            updatePrompts();
        }
    });
});

const config = { attributes: true, childList: true, characterData: true };

observer.observe(targetNode, config);

const getTextArea = () => {
    const textarea = document.querySelector('textarea');
    return textarea ?? null;
};

const createPromptSelect = (promptList, promptType) => {
    const promptSelect = document.createElement('select');
    promptSelect.classList.add(`${promptType}-select`, 'prompt-select');
    promptSelect.innerHTML = `<option value="" selected>No ${promptType}</option>`;

    promptList.forEach(({ text, name }) => {
        const option = document.createElement('option');
        option.value = text;
        option.text = name;
        promptSelect.appendChild(option);
    });

    return promptSelect;
};

const attachSelector = (promptList, promptType) => {
    let promptContainer = document.querySelector(`.${promptType}-container`);

    if (promptContainer) {
        const promptSelect = createPromptSelect(promptList, promptType);
        promptContainer.replaceChild(promptSelect, promptContainer.firstChild);
    } else {
        promptContainer = document.createElement('div');
        const promptSelect = createPromptSelect(promptList, promptType);
        promptContainer.classList.add(`${promptType}-container`);
        promptContainer.appendChild(promptSelect);
    }

    return promptContainer;
};

const injectPrompts = textarea => {
    const form = textarea.closest('form');
    const prepromptSelector = form.querySelector('.preprompt-select');
    const postpromptSelector = form.querySelector('.postprompt-select');
    textarea.value = `${prepromptSelector?.value ?? ''}\n\n${textarea.value}\n\n${postpromptSelector?.value ?? ''}`;
    textarea.value = textarea.value.trim();
};

const clearSelections = () => {
    chrome.storage.local.get("clearSelection", function (data) {
        console.log(data)
        if (data.clearSelection) {
            const prepromptSelector = document.querySelector('.preprompt-select');
            const postpromptSelector = document.querySelector('.postprompt-select');
            prepromptSelector.selectedIndex = 0;
            postpromptSelector.selectedIndex = 0;
        }
    });
};

const updatePrompts = async () => {
    const textarea = getTextArea();

    const { preprompts = [], postprompts = [] } = await chrome.storage.local.get(['preprompts', 'postprompts']);

    const promptContainerWrapper = document.createElement('div');
    promptContainerWrapper.classList.add('prompt-container-wrapper');

    const prepromptSelector = attachSelector(preprompts, 'preprompt');
    const postpromptSelector = attachSelector(postprompts, 'postprompt');

    promptContainerWrapper.appendChild(prepromptSelector);
    promptContainerWrapper.appendChild(postpromptSelector);

    textarea.parentNode.insertBefore(promptContainerWrapper, textarea);

    const form = textarea.closest('form');

    const originalSubmitHandler = form.onsubmit;

    const submitHandler = event => {
        event.preventDefault();
        injectPrompts(textarea);

        clearSelections();

        if (originalSubmitHandler) {
            originalSubmitHandler.call(form, event);
        }
    };

    form.onsubmit = submitHandler;

    textarea.addEventListener("keydown", event => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            submitHandler(event);
        }
    });
};

updatePrompts();
