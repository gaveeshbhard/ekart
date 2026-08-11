const fs = require('fs');

function renderHtmlTemplate(filePath, dataObject) {
    // Read the HTML file synchronously 
    const htmlContent = fs.readFileSync(filePath, 'utf8');
    
    // Match anything inside $( ) and replace it with the object value
    const result = htmlContent.replace(/\$\(([^)]+)\)/g, (match, key) => {
        // Trim whitespace around the key name inside the parentheses
        const cleanKey = key.trim();
        
        // Return the value if it exists, otherwise leave the placeholder intact
        return dataObject.hasOwnProperty(cleanKey) ? dataObject[cleanKey] : match;
    });

    return result;
}

module.exports = renderHtmlTemplate;