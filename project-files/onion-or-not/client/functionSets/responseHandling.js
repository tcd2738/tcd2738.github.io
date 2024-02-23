let debugValue = false;

// Handle responses on the front end.
const handleResponse = async (response, parseResponse) => {
    if (parseResponse) {
        // Parse the response to JSON.
        let obj = await response.json();
        console.log(obj);

        if (debugValue) {
            const content = document.querySelector('#responseHandler');
    
            // Pick HTML message to display based on response status
            switch (response.status) {
                case 200:
                    content.innerHTML = `<b>Success</b>`;
                    break;
                case 201:
                    content.innerHTML = `<b>Created</b>`;
                    break;
                case 202:
                    content.innerHTML = `<b>Accepted</b>`
                case 204:
                    content.innerHTML = `<b>Updated (No Content)</b>`;
                    return;
                case 400:
                    content.innerHTML = `<b>Bad Request</b>`;
                    break;
                case 404:
                    content.innerHTML = `<b>Not Found</b>`;
                    break;
                default:
                    content.innerHTML = `<b>Response code not implemented by client.</b>`;
                    break;
            }

            // If we have a message, display it.
            if(obj.message){
                content.innerHTML += `<p>${obj.message}</p>`;
            } else if (obj) {
                content.innerHTML += `<p>${JSON.stringify(obj)}</p>`;
            }
        }

    }
}

// Changing of debug value from client.
const enableDebug = () => {
    debugValue = true;
}

module.exports = {
    handleResponse,
    enableDebug
}