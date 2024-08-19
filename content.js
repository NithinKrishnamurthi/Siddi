
// catalog-productCard-module__template product-template

let productSelectors = [
    {
        containerElement: 'div.catalog-productCard-module__template',
        parentElement:'div.product-my-saves',
        detailLink: 'a'
    },
    {
        containerElement: 'div.product-page-info-container-mfe',
        elementToInsertBefore: 'div.list-and-share-section'
    },

]
async function insertSaveButtons() {
    // Select all instances of the div with the specified class and data-state

    for(let productSelector of productSelectors) {
        let containers = document.querySelectorAll(productSelector.containerElement);
        for(let container of containers) {
            console.log(container)
            // Make sure we haven't already added the button
            if(!container.querySelector('button.watch-item')) {
                const button = document.createElement('button');
                button.classList.add('watch-item');
                const imageUrl = chrome.runtime.getURL('images/coupon-16.png');
                button.style.backgroundImage = `url('${imageUrl}')`;
                button.style.backgroundSize = 'cover'; // Ensures the image covers the button
                button.style.backgroundRepeat = 'no-repeat'; // Prevents the image from repeating
                button.style.backgroundPosition = 'center'; // Centers the image
                button.style.width = '25px'; // Set desired width
                button.style.height = '25px'; // Set desired height
                button.style.border = 'none'; // Removes default button border
                button.style.padding = '0'; // Removes padding to ensure image fills button
                button.style.backgroundColor = 'transparent'; // Makes background transparent
                button.style.cursor = 'pointer';

                const regex = /\$\s*(\d+(\.\d{1,2})?)/;
                const dollars = container.textContent.match(regex)[1];

                // Optionally add an event listener for button clicks
                if('parentElement' in productSelector) {
                    if(container.querySelector(productSelector.parentElement)) {
                        container.querySelector(productSelector.parentElement).appendChild(button);
                    }
                }
                else if('elementToInsertBefore' in productSelector) {
                    const parentElement = container.querySelector(productSelector.elementToInsertBefore).parentNode;
                    parentElement.insertBefore(button, container.querySelector(productSelector.elementToInsertBefore));
                }
                let detailLink
                if('detailLink' in productSelector) {
                    detailLink = container.querySelector(productSelector.detailLink).href;
                }
                else {
                    detailLink = location.href
                    console.log(detailLink)
                }
                // Truncate query parameters
                let url = new URL(detailLink);
                detailLink = url.origin + url.pathname;
                button.addEventListener('click', function() {
                    chrome.storage.local.set({ [detailLink]: dollars }, function(){
                        console.log(detailLink, dollars);
                    });
                    alert('Product saved!');
                });
            }
        }

    }
}

// Call the function immediately or when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', insertSaveButtons);

// MutationObserver to detect changes in the DOM
const observer = new MutationObserver((mutations) => {
    insertSaveButtons();
});

// Start observing the document body for child changes
observer.observe(document.body, {
    childList: true,
    subtree: true
});