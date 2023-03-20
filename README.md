# GPTPromptMaster
This is a browser extension that allows you to define your own pre and post prompts that are added to the chatGPT prompt.
See below for how to install it in chrome and firefox!

## Chrome Installation
Link to Chrome Extension: [chrome.google.com/gptpromptmaster](https://chrome.google.com/webstore/detail/gptpromptmaster/oaiidilobjckieciljhmienhjbninfib)

## Firefox Installation
Link to Firefox Add On: [addons.mozilla.org/gptpromptmaster](https://addons.mozilla.org/firefox/addon/gptpromptmaster/)

## Installation from source
See at the bottom of the page :)

## Click on this image to get to the youtube video:

[![Youtube Video](https://img.youtube.com/vi/MKMO05k7cfU/0.jpg)](https://www.youtube.com/watch?v=MKMO05k7cfU)


## Define Pre and Post Prompts
To define your own pre and post prompts, go to the extension options and click `Settings`:

<p>
  <img src="https://cloud.hs-augsburg.de/s/dfQ8Nwgr63piWFH/preview" alt="Settings" style="width:512px; height:auto">
</p>


In the settings, you can define your own pre and post prompts:

<p>
  <img src="https://cloud.hs-augsburg.de/s/jqDprSmALPo5YXe/preview" alt="Prompt Definition Example 1" style="width:512px; height:auto">
</p>

<p>
  <img src="https://cloud.hs-augsburg.de/s/TcfdWqGWRYGadoR/preview" alt="Prompt Definition Example 2" style="width:512px; height:auto">
</p>


## Use Pre and Post Prompts
To use your pre and post prompts, go to the chatGPT website and select the created promtpts directly in the text field:

<p>
    <img src="https://cloud.hs-augsburg.de/s/7baE4jwTWFPZefX/preview" alt="Prompt Use Example" style="width:512px; height:auto">
</p>

<p>
    <img src="https://cloud.hs-augsburg.de/s/iyBa4TGtsbyTCQN/preview" alt="Inserted Prompt" style="width:512px; height:auto">
</p>

The pre and post prompts are added to the prompt only if you submit the prompt with the button in the textarea.

<p>
    <img src="https://cloud.hs-augsburg.de/s/enCpRynkRAijbWn/preview" alt="Prompt Example Result" style="width:512px; height:auto">
</p>

# Installation from Source

## Chrome
To install the extension from source, you need to clone the repository and load the extension into your browser.

In chrome open the extensions page by typing 

```
chrome://extensions
```

in the address bar.

Then enable the developer mode in the top right corner and click `Load unpacked`.

Then select the folder of the cloned repository and the extension should be loaded.


## Firefox
To install the extension from source, you need to clone the repository and load the extension into your browser.

In firefox open the extensions page and click on the `Debug Add-ons` button in the top right corner.

Then click on `Load Temporary Add-on` and select the `manifest.json` file in the cloned repository.

The extension should be loaded.

Now go to chat.openai.com and you should see the extension in the top right corner.
Change the setting to enable this extension to always work on the website.
