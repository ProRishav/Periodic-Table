async function getData(loc) {
    try {
        const response = await fetch(loc);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

async function fetchAndStoreData() {
    const location = 'data.json';
    allElementData = await getData(location);
    if (allElementData) {
        initializeWebsite(allElementData);
    } else {
        console.error("Failed to load the data. Please try again.");
    }
}

let allElementData = null;

function initializeWebsite(allElementData) {
    main();
}

fetchAndStoreData();
