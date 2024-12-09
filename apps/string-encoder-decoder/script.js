document.getElementById("encodeButton").addEventListener("click", () => processText("encode"));
document.getElementById("decodeButton").addEventListener("click", () => processText("decode"));

const inputTextarea = document.getElementById("inputText");
const outputTextarea = document.getElementById("outputText");
const operationSelect = document.getElementById("operation");

operationSelect.addEventListener("change", () => {
    const isJson = operationSelect.value === "json";
    document.getElementById("encodeButton").innerText = isJson ? "Beautify" : "Encode";
    document.getElementById("decodeButton").hidden = isJson;
    inputTextarea.classList.toggle("large", isJson);
    outputTextarea.classList.toggle("large", isJson);
});


function processText(action) {
    const inputText = document.getElementById("inputText").value;
    const operation = document.getElementById("operation").value;
    let outputText = "";

    try {
        if (operation === "base64") {
            outputText = action === "encode" ? btoa(inputText) : atob(inputText);
        } else if (operation === "url") {
            outputText = action === "encode" ? encodeURIComponent(inputText) : decodeURIComponent(inputText);
        } else if (operation === "html") {
            outputText = action === "encode" ? inputText.replace(/[\u00A0-\u9999<>&]/gim, i => `&#${i.charCodeAt(0)};`) : decodeHTMLEntities(inputText);
        } else if (operation === "asciihex") {
            outputText = action === "encode" ? inputText.split('').map(char => char.charCodeAt(0).toString(16)).join(' ') : inputText.split(' ').map(hex => String.fromCharCode(parseInt(hex, 16))).join('');
        } else if (operation === "hex") {
            outputText = action === "encode" ? toHex(inputText) : fromHex(inputText);
        } else if (operation === "octal") {
            outputText = action === "encode" ? inputText.split('').map(char => char.charCodeAt(0).toString(8)).join(' ') : inputText.split(' ').map(octal => String.fromCharCode(parseInt(octal, 8))).join('');
        } else if (operation === "binary") {
            outputText = action === "encode" ? inputText.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join(' ') : inputText.split(' ').map(binary => String.fromCharCode(parseInt(binary, 2))).join('');
        } else if (operation === "json") { // JSON Beautify
            try {
                const jsonObject = JSON.parse(inputText);
                // 2 spaces for indentation
                outputText = JSON.stringify(jsonObject, null, 2); 
            } catch (e) {
                outputText = "Invalid JSON input";
            }
        }
    } catch (error) {
        outputText = "Error: Invalid input for the selected operation.";
        // Log the error for debugging
        console.error("Error during processing:", error); 
    }

    document.getElementById("outputText").value = outputText;
}

function decodeHTMLEntities(text) {
    const txt = document.createElement('textarea');
    txt.innerHTML = text;
    return txt.value;
}

function toHex(str) {
    return str.split('').map(char => char.charCodeAt(0).toString(16)).join('');
}

function fromHex(hexString) {
    return hexString.match(/.{1,2}/g).map(byte => String.fromCharCode(parseInt(byte, 16))).join('');
}