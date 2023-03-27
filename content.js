const copyButtonId = 'meaningful-jira-links';
// Add copy button for static page in the 'bowse' view
addCopyButton();
// Add observer that will add copy button for the dynamic page in the 'backlog' view
addBacklogObserver();

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
    copyButtonDiv.classList.add('_2hwxftgi');
    copyButton.classList.add('css-8e6fqr');
    copyButton.id = copyButtonId;

    copyButton.onclick = function() {
        const ticketHeader = baseContainer.querySelector('h1').innerHTML;
        const jiraTicketAnchorNodes = baseContainer.querySelectorAll('a[href*="/browse/"].css-xby519');
        const jiraTicketAnchor = jiraTicketAnchorNodes[jiraTicketAnchorNodes.length - 1];

        const ticketNumber = jiraTicketAnchor.querySelector('span').innerText;
        const ticketURL = jiraTicketAnchor.href;
        const linkText = `[${ticketNumber}] - ${ticketHeader}`;

        copyToClipboard(getHyperlinkText(ticketURL, linkText), ticketURL);
    };
    
    copyButton.appendChild(document.createTextNode("Copy Link!"));
    copyButtonDiv.appendChild(copyButton);

    jiraButtonContainer.insertBefore(copyButtonDiv, jiraButtonContainer.children[3]);
}

function addBacklogObserver() {
    const backlogDetailViewContainer = document.querySelector('#ghx-detail-view');
    if (!backlogDetailViewContainer) {
        return;
    }

    const observer = new MutationObserver(function () {
        addCopyButton();
    });

    observer.observe(backlogDetailViewContainer, {
        childList: true,
        subtree: true,
        attributes: true
    });
}

function getTicketNumber(url) {
    const beginIndex = url.href.lastIndexOf('/');
    // Avoid copying path parameters if present
    const endIndex = url.href.indexOf('?');

    var ticketNumber;
    if (endIndex === -1) {
        ticketNumber = url.href.substring(beginIndex + 1)
    } else {
        ticketNumber = url.href.substring(beginIndex + 1, endIndex)
    }

    return ticketNumber;
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