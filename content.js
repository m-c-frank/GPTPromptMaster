const targetNode = document.querySelector('#__next');

const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        if (mutation.type === 'childList' && mutation.addedNodes?.length > 0) {
            console.log('derp');
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

    const parent = textarea.parentNode;
    const button = parent.querySelector('button');
    const originalClickHandler = button.onclick;

    const clickHandler = event => {
        injectPrompts(textarea);

        if (originalClickHandler) {
            originalClickHandler.call(button, event);
        }
    };

    button.onclick = clickHandler;
};

updatePrompts();
