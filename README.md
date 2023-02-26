<style>
    img {
        width: 512px;
        height: auto;
    }
</style>

# GPTPromptMaster
This is a chrome extension that allows you to define your own pre and post prompts that are added to the chatGPT prompt.

## Define Pre and Post Prompts
To define your own pre and post prompts, go to the extension options and click `Settings`:

![Settings](https://cloud.hs-augsburg.de/s/dfQ8Nwgr63piWFH/preview)

In the settings, you can define your own pre and post prompts:

![Prompt Definition Example 1](https://cloud.hs-augsburg.de/s/jqDprSmALPo5YXe/preview)

![Prompt Definition Example 2](https://cloud.hs-augsburg.de/s/TcfdWqGWRYGadoR/preview)

## Use Pre and Post Prompts
To use your pre and post prompts, go to the chatGPT website and select the created promtpts directly in the text field:

![Prompt Use Example](https://cloud.hs-augsburg.de/s/7baE4jwTWFPZefX/preview)

![Inserted Prompt](https://cloud.hs-augsburg.de/s/iyBa4TGtsbyTCQN/preview)

The pre and post prompts are added to the prompt only if you submit the prompt with the button in the textarea.

![Prompt Example Result](https://cloud.hs-augsburg.de/s/enCpRynkRAijbWn/preview)


# Installation from Source
To install the extension from source, you need to clone the repository and load the extension into your browser.

In chrome open the extensions page by typing 

```
chrome://extensions
```

in the address bar.

Then enable the developer mode in the top right corner and click `Load unpacked`.

Then select the folder of the cloned repository and the extension should be loaded.
