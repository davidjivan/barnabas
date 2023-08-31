// Initialize Quill editor
var quill = new Quill('#editor-container', {
    theme: 'snow'
});

// Get the elements
var newDocumentButton = document.getElementById('new-document-button');
var documentList = document.getElementById('document-list');
var documentItems = document.getElementsByClassName('document-item');
var contextTextarea = document.getElementById('context-textarea');
var brainstormButton = document.getElementById('brainstorm-button');
var interactionButtons = document.getElementById('interaction-buttons');
var barnabasInputText = document.getElementById('barnabas-input-text');
var sendButton = document.getElementById('send-button');
var responseText = document.getElementById('response-text');


// Add a click event listener to the create document button
newDocumentButton.addEventListener('click', function() {
    createNewDocument();
});

// Add event listener to brainstorm button
brainstormButton.addEventListener('click', function() {
    // Get the context text
    var context = contextTextarea.value;

    // Get the brainstorm response
    var response = brainstorm(context);

    // Append the response to the Quill editor
    quill.clipboard.dangerouslyPasteHTML(response);
});

// Add event listener to send button
sendButton.addEventListener('click', function() {
    // Get the text from the barnabas input text
    var text = barnabasInputText.value;

    // Clear the barnabas input text
    barnabasInputText.value = '';

    // Send the text to Barnabas and get the response
    var response = askBarnabas(text);

    // Display the question and response in the response text
    responseText.innerHTML = '<small>' + text + '</small><br>' + response;
});

// Add event listener to interaction buttons
interactionButtons.addEventListener('click', function(event) {
    // Get the clicked button
    var button = event.target;

    // Get the selected text
    var selection = quill.getSelection();
    var selectedText = selection ? quill.getText(selection.index, selection.length) : '';

    // Send the selected text to Barnabas and get the response
    var response = interact(button.id, selectedText);

    // Display the question and response in the response text
    responseText.innerHTML = '<small>' + selectedText + '</small><br>' + response;
});

// Add event listeners to document items
for (var i = 0; i < documentItems.length; i++) {
    documentItems[i].addEventListener('click', function(event) {
        var id = event.target.textContent.split(' ')[1];
        loadDocument(id);
    });
}






// Function to create a new document
function createNewDocument() {
    // Get the content of the Quill editor
    var content = JSON.stringify(quill.getContents());
    console.log('Creating document with content:', content);

    // Send a POST request to the backend API to create a new document
    fetch('/documents', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({content: content}),
    })
        .then(response => response.json())
        .then(data => {
            // Handle the response from the backend API
            var id = data.id;
            console.log('Document created with id:', id);
            currentDocumentIndex = id;
            updateDocumentListUI();
            loadDocument(id);
        })
        .catch(error => {
            // Handle any errors that occur during the request
            console.error('Error:', error);
        });
}





// Function to load a document
function loadDocument(id) {
    console.log('Loading document:', id);
    // Send a GET request to the backend API to get the content of the document
    fetch('/documents/' + id)
        .then(response => response.json())
        .then(data => {
            // Handle the response from the backend API
            console.log('Document data:', data);
            var content = data.content;
            if (typeof content === 'string') {
                try {
                    content = JSON.parse(content);
                } catch (error) {
                    console.error('Error parsing document content:', error);
                    content = [];
                }
            }
            quill.setContents(content);
            currentDocumentIndex = id;
            updateDocumentListUI();
        })
        .catch(error => {
            // Handle any errors that occur during the request
            console.error('Error:', error);
        });
}






// Function to update the document list UI
function updateDocumentListUI() {
    console.log('Updating document list UI');
    console.log('Current document index:', currentDocumentIndex);
    console.log('Document list:', documentList);

    // Remove all document items from the document list
    while (documentList.firstChild) {
        documentList.removeChild(documentList.firstChild);
    }

    // Get the list of documents from the server
    fetch('/documents')
        .then(response => response.json())
        .then(data => {
            // Use a different variable to store the list of documents from the server
            var documents = data;
            var numDocuments = documents.length;

            // Add a document item for each document in the database
            for (var i = 1; i <= numDocuments; i++) {
                (function(i) {
                    var documentItem = document.createElement('div');
                    documentItem.className = 'document-item';
                    if (i === currentDocumentIndex) {
                        documentItem.classList.add('active');
                    }
                    documentItem.textContent = 'Document ' + i;
                    documentItem.addEventListener('click', function() {
                        loadDocument(i);
                    });
                    documentList.appendChild(documentItem);
                })(i);
            }
        })
        .catch(error => {
            // Handle any errors that occur during the request
            console.error('Error:', error);
        });
}











// Function to brainstorm
function brainstorm(context) {
    // Send a POST request to the backend API to get the brainstorm response
    fetch('/brainstorm', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ context: context }),
    })
        .then(response => response.json())
        .then(data => {
            // Handle the response from the backend API
            // For example, append the response to the Quill editor
            quill.clipboard.dangerouslyPasteHTML(data.response);
        })
        .catch(error => {
            // Handle any errors that occur during the request
            console.error('Error:', error);
        });
}


// Function to ask Barnabas a question and get a response
function askBarnabas(text) {
    // Send a POST request to the backend API to get the response from Barnabas
    fetch('/ask-barnabas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: text }),
    })
        .then(response => response.json())
        .then(data => {
            // Handle the response from the backend API
            // For example, display the question and response in the response text
            responseText.innerHTML = '<small>' + text + '</small><br>' + data.response;
        })
        .catch(error => {
            // Handle any errors that occur during the request
            console.error('Error:', error);
        });
}


// Function to interact with selected text and get a response
function interact(action, selectedText) {
    // For now, return a fixed response
    return 'This is a response for the action: ' + action + ' and the selected text: ' + selectedText;
}

// Load the saved documents from local storage
loadDocument();





// Add a text change event listener to the Quill editor
quill.on('text-change', function() {
    // Add a console log
    console.log('Text changed');
    // If there is no current document index, return
    if (currentDocumentIndex === null) return;

    // Get the content of the Quill editor
    var content = quill.getContents();
    console.log('Saving document with content:', content);

    // Send a PUT request to the backend API to update the content of the current document
    fetch('/documents/' + currentDocumentIndex, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: JSON.stringify(quill.getContents()) }),
    })
        .catch(error => {
            // Handle any errors that occur during the request
            console.error('Error:', error);
        });
});




// Add a blur event listener to the document list
documentList.addEventListener('blur', function(event) {
    // If the target is not a document item, return
    if (event.target.className !== 'document-item') return;

    // Get the document index
    var index = Array.from(documentList.children).indexOf(event.target);

    // Update the document name in local storage
    var documentNames = JSON.parse(localStorage.getItem('document-names')) || [];
    documentNames[index] = event.target.textContent;
    localStorage.setItem('document-names', JSON.stringify(documentNames));
}, true);


// Load the first document when the page loads
window.addEventListener('load', function() {
    loadDocument(1);
});