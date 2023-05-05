addCopyButton();
addJiraCopyButtonObserver();

function addJiraCopyButtonObserver() {
    const observer = new MutationObserver(function () {
        addCopyButton();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true
    });
}

function addCopyButton() {
    const existingCopyButton = document.getElementById(copyButtonId);
    if (existingCopyButton) {
        return;
    }

    const ticketNumber = getTicketNumber(window.location);
    const jiraTicketAnchor = document.querySelector(`a[href*="/browse/${ticketNumber}"][target="_blank"]`);
    const ticketHeaderElement = document.querySelector('h1[data-test-id*="issue-base"]');

    if (!jiraTicketAnchor || !ticketHeaderElement) {
        return;
    }

    const jiraTicketAnchorContainer = jiraTicketAnchor.parentNode.parentNode.parentNode.parentNode;
    const ticketHeader = ticketHeaderElement.innerHTML;

    if (!jiraTicketAnchorContainer) {
        return;
    }

    const copyButtonElement = CreateCopyButton(ticketNumber, ticketHeader, jiraTicketAnchor);
    jiraTicketAnchorContainer.insertBefore(copyButtonElement, jiraTicketAnchorContainer.lastElementChild);
}

function getTicketNumber(url) {
    const backlogBeginToken = 'selectedIssue=';
    const backlogBeginIndex = url.href.lastIndexOf(backlogBeginToken);
    const backlogEndIndex = url.href.lastIndexOf('&');

    if (backlogBeginIndex > 0 && backlogEndIndex > 0) {
        return url.href.substring(backlogBeginIndex + backlogBeginToken.length, backlogEndIndex);
    }

    const browseBeginToken = '/browse/';
    const browseBeginIndex = url.href.lastIndexOf(browseBeginToken);
    // Avoid copying path parameters if present
    const browseEndIndex = url.href.indexOf('?'); 

    if (browseEndIndex === -1) {
        return url.href.substring(browseBeginIndex + browseBeginToken.length)
    } else {
        return url.href.substring(browseBeginIndex + browseBeginToken.length, browseEndIndex)
    }
}

// Format hyperlinks as html elements so apps like Teams and Word can display them as rich text
function getHyperlinkText(url, displayText) {
    return `<html>
    <body>
    <a href='${url}'>${displayText}</a>
    </body>
    </html>`
}
 
function CreateCopyButton(ticketNumber, ticketHeader, jiraTicketAnchor) {
    const copyButtonDiv = document.createElement("div");
    const copyButton = document.createElement("button");
    copyButton.style = copyButtonStyle;
    copyButton.id = copyButtonId;

    copyButton.onclick = function() {
        const ticketURL = jiraTicketAnchor.href;
        const linkText = `[${ticketNumber}] - ${ticketHeader}`; 

        copyToClipboard(getHyperlinkText(ticketURL, linkText), ticketURL);
    };

    copyButton.appendChild(document.createTextNode("Copy Link!"));
    copyButtonDiv.appendChild(copyButton);

    return copyButtonDiv;
}

function copyToClipboard(html, plainText) {
    // Hook into the 'copy' command to set the clipboard data as html instead of plain text
    function listener(e) {
        e.clipboardData.setData("text/html", html);
        // Add the plain text data incase it's pasted into something like notepad
        e.clipboardData.setData("text/plain", plainText);
        e.preventDefault();
    }

    document.addEventListener("copy", listener);
    // This is deprecated, but 'navigator.clipBoard' does not work due to a quirk with Chrome extensions
    document.execCommand("copy");
    document.removeEventListener("copy", listener);
}