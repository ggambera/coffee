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
            // Complete html with info from data response
            if (data.error) {
                throw new Error('Api Error. STATUS: ' + data.error + ' ' + data.message);
            }
            var pos = 0;
            data.forEach(item => {
                const li = document.createElement('li');
                listItems.push(li);
                li.classList.add('item');
                li.tagID = pos++;
                li.innerHTML = `
                    <img src='${item.image}' alt='${item.title}'>
                    <table class="table-info">
                        <tr>
                            <td class="table-td">${item.title}</td>
                            <td class="table-td-2">${item.id}</td>
                        </tr>
                        <tr>
                            <td class="table-desc">${item.description}</td>
                        </tr>
                    </table>
                `;
                li.search = item.title + ' ' + item.id;
                result.appendChild(li);
            })

            // Get the button that opens the modal
            var list = document.getElementsByClassName('item');

            // Complete html with info to Modal Panel
            for (i = 0; i < list.length; i++) {
                list[i].onclick = function(item) {
                    // When the user clicks on the list item, open the modal
                    const pos = item.currentTarget.tagID;
                    resultModal.innerHTML = '';
                    modal.style.display = 'block';
                    const detail = document.createElement('div');
                    //detail.classList.add('modal-item');

                    var li = '';
                    var record = data[pos];
                    for (j = 0; j < record.ingredients.length; j++) {
                        li = li + "<li>" + record.ingredients[j] + "</li>";                        
                    }
                    detail.innerHTML = `
                        <img src='${data[pos].image}' alt='${data[pos].title}'>
                        <spam class="modal-td">${data[pos].title}</spam>
                        <spam class="modal-td-2">(${data[pos].id})</spam>
                        <table class="modal-table">
                            <tr><td class="modal-desc">${data[pos].description}</td></tr>
                        </table>
                        <spam class="modal-td-3">Ingredients</spam>
                        <ul class="square">${li}</ul>
                    `;
                    resultModal.appendChild(detail);    
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
const modal = document.getElementById('myModal');
const resultModal = document.getElementById('resultModal');
const span = document.getElementsByClassName('close')[0];

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