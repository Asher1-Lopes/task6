// $(function () {
//   // const bts = document.querySelectorAll(".btn")
//   // bts.forEach(b => {
//   //     b.addEventListener("click", function(){

//   //     })
//   // })
//   $("#fileuploader").change(function (e) {
//     e.preventDefault();
//     const file = this.files[0];

//     const formData = new FormData();
//     formData.append("file", file);
//     console.log(file);

//     fetch("http://localhost:5226/api/TodoItems/upload", {
//       method: "POST",
//       body: formData,
//     }).then((resp) => {
//       console.log(resp.status);
//     });
//     refreshFiles();
//     // get
//   });
// });

// function refreshFiles() {
//   fetch("http://localhost:5226/api/TodoItems/fetchfile")
//     .then((response) => response.json())
//     .then((data) => {
//       console.log(data);
//       display(data);
//     })
//     .catch((error) => console.error("Error:", error));
// }
// refreshFiles();

// function display(data) {
//   // Get the container where you want to display the data

//   let fileadded = "";
//   for (let i = 0; i < data.length; i++) {
//     fileadded += `
 
//         <div class="file-item" onclick ='myfilesfunc(${data[i].f_Id})'>
//             <span class="file-icon"><i class="fa-solid fa-file-csv"></i></span>
//             <div class="file-info">
//                 <span class="file-name">${data[i].file_Name}</span>
//                 <span class="file-date">${data[i].date_time}</span>
//             </div>
//         </div>
  

//   `;

//     document.getElementById("container").innerHTML = fileadded;
//   }
  
// }
// // var fi_id
// //  function myfilesfunc(id){
// // console.log(id);

// //  }

// // // Shared module to hold the id value
// // let sharedId = null;

// // export function myfilesfunc(id) {
// //     sharedId = id;
// // }

// // export function getId() {
// //   console.log(sharedId);
// //     return sharedId;
// // }




















// //  fi_id = id;
// // window.currentExcel.getFile(id);

// // OPEN THT FILE WITH ID 
// // fetch(`http://localhost:5226/api/TodoItems/fetch/0/${id}`)
// //     .then((response) => response.json())
// //     .then((data) => {
// //       console.log(data);
     
// //     })
// //     .catch((error) => console.error("Error:", error));
 
// // }

// // export const fid=fi_id;

// // http://localhost:5226/api/TodoItems/fetchfile
// // http://localhost:5226/api/TodoItems/fetch/300
