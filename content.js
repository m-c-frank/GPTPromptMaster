updatePrompts();
const targetNode = document.querySelector('#__next');
const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            console.log("derp");
            updatePrompts();
        }
    });
});

const config = { attributes: true, childList: true, characterData: true };

observer.observe(targetNode, config);

function get_textarea() {
    const textareas = document.getElementsByTagName("textarea");
    if (textareas.length == 1) {
        return textareas[0];
    } else {
        return null;
    }
}



function attach_selector(promptlist, prompttype) {
    const promptSelect = document.createElement('select');
    promptSelect.classList.add(prompttype + '-select');
    promptSelect.classList.add('prompt-select');
    promptSelect.innerHTML = `<option value="" selected>No ${prompttype}</option>`;

    promptlist.forEach(prompt => {
        const option = document.createElement('option');
        option.value = prompt.text;
        option.text = prompt.name;
        promptSelect.appendChild(option);
    });

    let promptContainer = document.querySelector('.' + prompttype + '-container');
    if (promptContainer) {
        promptContainer.replaceChild(promptSelect, promptContainer.firstChild);
    } else {
        promptContainer = document.createElement('div');
        promptContainer.classList.add(prompttype + '-container');
        promptContainer.appendChild(promptSelect);
    }
    return promptContainer;
}

function inject_prompts(textarea) {
    const form = textarea.closest('form')
    prepromptSelector = form.querySelector('.preprompt-select');
    postpromptSelector = form.querySelector('.postprompt-select');
    textarea.value = prepromptSelector.value + "\n\n" + textarea.value + "\n\n" + postpromptSelector.value;
    textarea.value = textarea.value.trim();
}

function updatePrompts() {
    const textarea = get_textarea();

    let prePrompts = [];
    let postPrompts = [];
    chrome.storage.local.get(['preprompts', 'postprompts'], function (data) {
        prePrompts = data.preprompts || [];
        postPrompts = data.postprompts || [];

        promptContainerWrapper = document.createElement('div');
        promptContainerWrapper.classList.add('prompt-container-wrapper');

        prepromptSelector = attach_selector(prePrompts, 'preprompt');
        postpromptSelector = attach_selector(postPrompts, 'postprompt');

        promptContainerWrapper.appendChild(prepromptSelector);
        promptContainerWrapper.appendChild(postpromptSelector);


        textarea.parentNode.insertBefore(promptContainerWrapper, textarea);


        parent = textarea.parentNode;
        button = parent.querySelector('button');
        const originalClickHandler = button.onclick;

        function clickhandler(event) {
            inject_prompts(textarea);

            if (originalClickHandler) {
                originalClickHandler.call(button, event);
            }
        }

        button.onclick = clickhandler;
    });
}
