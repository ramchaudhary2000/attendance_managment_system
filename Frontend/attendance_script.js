const tableBody = document.getElementById('table-body')
const dateInput = document.getElementById('date')
const teacherInput = document.getElementById('teacher')
const noData = document.getElementById('no-data')

const fullTable = document.querySelector('#attendance-table .table')

const currentDate = new Date().toISOString().split('T')[0];
dateInput.value=currentDate

noData.style.display='block'
fullTable.style.display='none'

function getData(){
    if(dateInput.value && teacherInput.value){
        console.log(dateInput.value, teacherInput.value )
        loading()
        fetch(
            `http://localhost:5000/get-attendance?date=${dateInput.value}&teacher=${teacherInput.value}`
          )
            .then((res) => {
              if (!res.ok) {
                throw new Error(res?.error || "Error Occurred");
              }
              return res.json();
            })
            .then((data) => {
              console.log(data);
              if(data.length===0){
                noDataFound()
              } else{
                populateTable(data)
              }
            })
            .catch((e) => {
                noDataFound()
              console.log("error pakad li", e);
            })
    }
}

function noDataFound(){
    noData.style.display='block'
    fullTable.style.display='none'
}

function loading(){
    noData.style.display='none'
    fullTable.style.display='grid'
    const body="<div class='row'><div>233</div><div>Ram Chaudhary</div><div>CSE</div><div>23:12</div><div>12-Jan-2024</div></div><div class='row'><div>233</div><div>Ram Chaudhary</div><div>CSE</div><div>23:12</div><div>12-Jan-2024</div></div><div class='row'><div>233</div><div>Ram Chaudhary</div><div>CSE</div><div>23:12</div><div>12-Jan-2024</div></div><div class='row'><div>233</div><div>Ram Chaudhary</div><div>CSE</div><div>23:12</div><div>12-Jan-2024</div></div>"
    tableBody.innerHTML=body
    tableBody.classList.add('loading')
}

function populateTable(data){
    noData.style.display='none'
    fullTable.style.display='grid'
    const body=`${data.map(row=>`<div class="row"><div>${row.id}</div><div>${row.name}</div><div>${row.batch}</div><div>${row.time}</div><div>${row.date}</div></div>`).join('')}`
    tableBody.innerHTML=body
    tableBody.classList.remove('loading')
}

dateInput.addEventListener('change', getData)
teacherInput.addEventListener('change', getData)