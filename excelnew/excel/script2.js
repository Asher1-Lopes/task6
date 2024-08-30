const csv3 = ``;

let currentExcel;
let sheetsList = [];

var ele = document.querySelector(".wraper");

const progresscontainer = document.getElementById("progress-container");
const preloadpic = document.getElementById("filenocontent1");
// })
document
  .getElementById("fileuploader")
  .addEventListener("change", (e) => uploadfile(e));

function uploadfile(e) {
  progresscontainer.style.display = "block";
  e.preventDefault();
  const file = e.target.files[0];

  const formData = new FormData();
  formData.append("file", file);
  console.log(file);

  fetch("http://localhost:5226/api/TodoItems/upload", {
    method: "POST",
    body: formData,
  }).then((resp) => {
    console.log(resp.status);
    getProgress();
    // window.location.reload();
  });
  refreshFiles();
}
// loader

let progressInterval; // Variable to store the interval ID
function updateProgressBar(value) {
  const progressBar = document.getElementById("progress-bar");
  progressBar.style.width = value + "%";
  progressBar.textContent = value + "%";
  progressBar.style.backgroundColor = "green";
  progressBar.style.textAlign = "center";
}

function getProgress() {
  // Set up the interval and store its ID
  progressInterval = setInterval(() => {
    // Fetch the progress data
    fetch("http://localhost:5226/api/TodoItems/fetchfile")
      .then((response) => response.json())
      .then((data) => {
        const loaderValue = data[data.length - 1]?.loader;
        console.log(loaderValue);
        if (loaderValue !== undefined) {
          updateProgressBar(loaderValue);

          if (loaderValue === 100) {
            console.log("Progress complete.");

            clearInterval(progressInterval);
            setTimeout(function () {
              alert("File Uploaded");
            }, 1000);

            setTimeout(function () {
            
              window.location.reload();
            }, 1500);
          }
        }
      })
      .catch((error) => console.error("Error:", error));
  }, 50); // Poll every 100 ms
}

function refreshFiles() {
  fetch("http://localhost:5226/api/TodoItems/fetchfile")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      display(data);
    })
    .catch((error) => console.error("Error:", error));
}
refreshFiles();

function display(data) {
  // Get the container where you want to display the data

  let fileadded = "";
  for (let i = 0; i < data.length; i++) {
    fileadded += `
 
        <div class="file-item" onclick ='myfilesfunc(${data[i].f_Id})'>
            <span class="file-icon"><i class="fa-solid fa-file-csv"></i></span>
            <div class="file-info">
                <span class="file-name">${data[i].file_Name}</span>
                <span class="file-date">${data[i].date_time}</span>
            </div>
        </div>
  

  `;

    document.getElementById("container").innerHTML = fileadded;
  }
}
// var fi_id

function myfilesfunc(id) {
  console.log(id);
  fetch(`http://localhost:5226/api/TodoItems/fetch/0/${id}`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      progresscontainer.style.display = "none";
      preloadpic.style.display = "none";
      currentExcel = new excel(csv3, data, ele, id);
    })
    .catch((error) => console.error("Error:", error));
}
