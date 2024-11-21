/**********************************************************************
 * 
 * Coffee App 
 * Pre-Work assignment project for CTD
 * script.js
 * 
 * Javascript Functions 
 * 
 * Author: German Gambera
 * Date:   11/21/2024
 * 
 */

/** 
 * Constants 
 */

/** HTTP Methods Constants */
const HTTP_GET = "GET";
const HTTP_POST = "POST";
const HTTP_PUT = "PUT";
const HTTP_PATCH = "PATCH";
const HTTP_DELETE = "DELETE";

/** API Constants */
const apiUrl = "https://api.sampleapis.com/coffee/";
const service_hot = "hot";
const service_iced = "iced";

/** Set Html Elements */
const result = document.getElementById('result');
const filter = document.getElementById('filter');
const hot = document.getElementById('hot');
const iced = document.getElementById('iced');
const listItems = [];

// First Api load
hotService();

// Add Listener for search
filter.addEventListener('input', (e) => filterData(e.target.value));

// Add listener for Hot list button
hot.addEventListener('click', function (event) {
    event.preventDefault();
    hotService()
});

// Add listener for Iced list button
iced.addEventListener('click', function (event) {
    event.preventDefault();
    icedService()
});

/** 
 * Functions
 */

/** Coffee Hot Service */
function hotService() {
    if (!hot.classList.contains('active')) {
        getData(service_hot);
        hot.classList.add('active');
        iced.classList.remove('active');
    }
};

/** Coffee Iced Service */
function icedService() {
    if (!iced.classList.contains('active')) {
        getData(service_iced);
        iced.classList.add('active');
        hot.classList.remove('active');
    }
};

/** Api Rest Function */
async function getData(service) {
    const requestOptions = {
        method: HTTP_GET,
        headers: myHeader
    };
    var myHeader = new Headers();
    myHeader.append('Content-Type', 'application/json');
    var apiRequest = apiUrl + service;
    var data = '';

    fetch(apiRequest, requestOptions)
        .then(response => {
            // Process Response 
            if (!response.ok) {
                throw new Error('Network response was not ok. STATUS: ' + response.status);
            }
            // Convert to Json
            return data = response.json();
        })
        .then(data => {
            // Clear result
            result.innerHTML = '';
            // Fill html with info from data response
            if (data.error) {
                throw new Error('Api Error. STATUS: ' + data.error + ' ' + data.message);
            }
            data.forEach(item => {
                const li = document.createElement('li');
                listItems.push(li);
                li.classList.add('item');
                li.tagName = item.id;
                li.innerHTML = `
                <img src='${item.image}' alt='${item.title}'>
                <div class='data-info'>
                    <div class='data-title'>
                      <span>${item.title}</span>
                      <span class='small'>${item.id}</span>
                    </div>
                    <p>${item.description}, ${item.description}</p>
                </div>
            `;
                li.search = item.title + ' ' + item.id;
                result.appendChild(li);
            })
            // Get the button that opens the modal
            var list = document.getElementsByClassName('item');
            // When the user clicks on the list item, open the modal
            var i;
            for (i = 0; i < list.length; i++) {
                list[i].onclick = function() {
                    modal.style.display = 'block';
                }
            }
        })
        .catch(error => {
            // Send Console Error
            console.error(error);
            // Clear result
            result.innerHTML = '';
            // Fill html with Error
            const li = document.createElement('li');
            listItems.push(li);
            li.innerHTML = `<span>${error}</spam>`;
            result.appendChild(li);
        });

    /* 
     * Previous way to call Api
     *
    const res = await fetch(apiRequest);
    const data = await res.json(); // Convert to Json
    result.innerHTML = ''; // Clear result
    data.forEach(item => {
        const li = document.createElement('li');
        listItems.push(li);
        li.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <div class="data-info">
                <div class="data-title">
                  <span>${item.title}</span>
                  <span class="small">${item.id}</span>
                </div>
                <p>${item.description}, ${item.description}</p>
            </div>
        `
        li.search = item.title + ' ' + item.id;
        result.appendChild(li);
    })
    */
}

/** Search Filter Function */
function filterData(searchTerm) {
    listItems.forEach(item => {
        if (item.search.toLowerCase().includes(searchTerm.toLowerCase())) {
            item.classList.remove('hide');
        } else {
            item.classList.add('hide');
        }
    })
}


// Get the modal
var modal = document.getElementById('myModal');
// Get the <span> element that closes the modal
var span = document.getElementsByClassName('close')[0];
// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = 'none';
}
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = 'none';
  }
}