const copyButtonId = 'meaningful-jira-links';
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

    const baseContainer = document.querySelector('._4t3i1osq');
    const jiraButtonContainer = baseContainer && baseContainer.querySelector('._otyr1y44._ca0q1y44._u5f3idpf._n3td1y44._19bvidpf._1e0c116y');
    if (!jiraButtonContainer) {
        return;
    }

    const copyButtonDiv = document.createElement("div");
    const copyButton = document.createElement("button");

    // Jira ticket page class specific CSS
    copyButtonDiv.setAttribute('role', 'presentation');
    copyButton.classList.add('_2hwxftgi');
    copyButton.classList.add('css-gon3qk');
    copyButton.id = copyButtonId;

    copyButton.onclick = function() {
        var ticketNumber = getTicketNumber(window.location);
        console.log(ticketNumber);
 
        const ticketHeader = baseContainer.querySelector('h1').innerHTML;
        const jiraTicketAnchor = baseContainer.querySelector(`a[href*="/browse/${ticketNumber}"]`);
        const ticketURL = jiraTicketAnchor.href;
        const linkText = `[${ticketNumber}] - ${ticketHeader}`;

        copyToClipboard(getHyperlinkText(ticketURL, linkText), ticketURL);
    };

    copyButton.appendChild(document.createTextNode("Copy Link!"));
    copyButtonDiv.appendChild(copyButton);
 
    jiraButtonContainer.insertBefore(copyButtonDiv, jiraButtonContainer.children[3]);
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