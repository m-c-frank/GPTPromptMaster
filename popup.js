document.addEventListener('DOMContentLoaded', function () {
    var disableButton = document.getElementById('disable-button');
    var settingsButton = document.getElementById('settings-button');
    var aboutButton = document.getElementById('about-button');

    var disableButton = document.getElementById('disable-button');

    disableButton.addEventListener('click', function () {
        chrome.storage.local.get(['disabled'], function (result) {
            var isDisabled = result.disabled;

            chrome.storage.local.set({ 'disabled': !isDisabled }, function () {
                var buttonText = isDisabled ? 'Disable' : 'Enable';
                disableButton.textContent = buttonText;
            });
        });
    });


    settingsButton.addEventListener('click', function () {
        chrome.tabs.create({ url: chrome.runtime.getURL('settings.html') });
    });

    aboutButton.addEventListener('click', function () {
        window.open('https://github.com/m-c-frank/GPTPromptMaster', '_blank');
    });
});
