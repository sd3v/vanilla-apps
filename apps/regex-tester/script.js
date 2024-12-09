/* script.js */
document.addEventListener('DOMContentLoaded', () => {
    const regexInput = document.getElementById('regex');
    const flagsInput = document.getElementById('flags');
    const textInput = document.getElementById('text');
    const outputDiv = document.getElementById('output');
    const testButton = document.getElementById('testButton');

    testButton.addEventListener('click', () => {
        const regexValue = regexInput.value;
        const flagsValue = flagsInput.value;
        const textValue = textInput.value;

        try {
            // Create a new regular expression
            const regex = new RegExp(regexValue, flagsValue);
            const matches = textValue.match(regex);

            if (matches) {
                // Display matches in the output
                outputDiv.textContent = `Matches found:\n${matches.join('\n')}`;
            } else {
                outputDiv.textContent = 'No matches found.';
            }
        } catch (error) {
            // Display error if the regex is invalid
            outputDiv.textContent = `Error: ${error.message}`;
        }
    });
});
