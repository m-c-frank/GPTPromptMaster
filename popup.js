document.addEventListener('DOMContentLoaded', function () {
    var settingsButton = document.getElementById('settings-button');
    var aboutButton = document.getElementById('about-button');

    settingsButton.addEventListener('click', function () {
        chrome.tabs.create({ url: chrome.runtime.getURL('settings.html') });
    });

    aboutButton.addEventListener('click', function () {
        window.open('https://github.com/m-c-frank/GPTPromptMaster', '_blank');
    });
});
