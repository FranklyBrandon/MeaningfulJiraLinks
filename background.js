chrome.action.onClicked.addListener(async function(tab) {  
    await chrome.scripting.executeScript({
        target: {tabId: tab.id, allFrames: false },
        files: ["content.js"]
    });

    //This return statement is needed to prevent the event from firing multiple times
    return true;
});