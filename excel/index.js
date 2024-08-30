$(function () {
  // const bts = document.querySelectorAll(".btn")
  // bts.forEach(b => {
  //     b.addEventListener("click", function(){

  //     })
  // })
  $("#fileuploader").change(function (e) {
    e.preventDefault();
    const file = this.files[0];

    const formData = new FormData();
    formData.append("file", file);
    console.log(file);

    fetch("http://localhost:5226/api/TodoItems/upload", {
      method: "POST",
      body: formData,
    }).then(() => {
      console.log("success");
    });
  });


//   $("#paras").onload(function (e) {
    

//     fetch("http://localhost:5226/api/TodoItems/upload", {
//       method: "GET",
//       body: formData,
//     }).then(() => {
//       console.log("success");
//     });
//   });





});
