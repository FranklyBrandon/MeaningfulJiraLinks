const ticketHeader = document.querySelector('h1').innerHTML;
const url = window.location;
const ticketNumber = getTicketNumber(url);
const linkText = `[${ticketNumber}] - ${ticketHeader}`;

copyToClipboard(getHyperlinkText(url.href, linkText));

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
    <!--StartFragment-->
    <a href='${url}'>${displayText}</a>
    <!--EndFragment-->
    </body>
    </html>`
}

function copyToClipboard(str) {
    // Hook into the 'copy' command to set the clipboard data as html instead of plain text
    function listener(e) {
        e.clipboardData.setData("text/html", str);
        e.clipboardData.setData("text/plain", str);
        e.preventDefault();
    }

    document.addEventListener("copy", listener);
    // This is deprecated, but 'navigator.clipBoard' does not work due to a quirk with Chrome extensions
    document.execCommand("copy");
    document.removeEventListener("copy", listener);
}