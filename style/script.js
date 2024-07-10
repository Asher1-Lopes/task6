let headers = [];
let data = [];


var cell = null;
// var startr,endr1,startc,endc1 =0;
var startr = 0;
var startc = 0;
var endr1 = 0;
var endc1 = 0;
var sum1 = 0;
// console.log(data[3][columns[0]] );
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
let f = false;
let canvasElem = document.querySelector("canvas");

function excel() {
  var sizel = 150;
  var sizeb = 30;
  var row = 5;
  var col = 14;
  row = data.length+1 ; //row 
  col = headers.length; // col+1
  var height1 = sizeb * row;
  var width1 = sizel * col;
  canvas.setAttribute("height", height1);
  canvas.setAttribute("width", width1);
  for (let i = 0; i < row; i++) {
    for (let j = 0; j < col; j++) {
      var x = j * sizel;
      var y = i * sizeb;

      ctx.fillStyle = "white";
      ctx.strokestyle = "black";
      ctx.fillRect(x, y, sizel, sizeb);

      ctx.strokeRect(x, y, sizel, sizeb);

      ctx.stroke();
    }
  }

  for (let i = 0; i < headers.length; i++) {
    var x1 = i * sizel;
    var y1 = 1 * sizeb;
    ctx.font = `${18}px areal `;

    ctx.fillStyle = "black";
    ctx.fillText(headers[i], x1 + 10, y1 - 10);
  }

  function inputtext(x3, y3, e2) {
    var element = document.getElementById("input1");
    element.classList.remove("hidden");
    element.style.left = `${150 * x3}px`;
    element.style.top = `${30 * y3}px`;
    // var text = data[c-1][headers[r]];
    element.value = data[y3 - 1][headers[x3]];
    
    f = true;
    element.focus();

    console.log(x3, y3);

    element.addEventListener("blur", PressEnter);

    function PressEnter(event) {
      // console.log(event);
      if (f) {
        // var canvas = document.getElementById("canvas");
        var nvalue = element.value;
        data[y3 - 1][headers[x3]] = nvalue;
        //    var[r2,c2]= getMousePosition(canvasElem , e1)
        console.log(x3, y3);

        ctx.clearRect(x3 * sizel, y3 * sizeb, sizel, sizeb);
        ctx.fillStyle = "white";
        // ctx.strokestyle="black";
        ctx.fillRect(x3 * sizel, y3 * sizeb, sizel, sizeb);
        // ctx.fillStyle = "white";
        ctx.font = `${18}px areal `;

        // ctx.fillStyle = "black";
        ctx.fillStyle = "black";
        ctx.fillText(nvalue, x3 * sizel + 2, (y3 + 1) * sizeb - 5);
        ctx.strokeRect(x3 * sizel, y3 * sizeb, sizel, sizeb);
        console.log(nvalue);

        f = false;

        element.removeEventListener("blur", PressEnter);
      }
    }
  }

  for (let i = 2; i <= row; i++) {
    var y = 0;
    for (let j = 0; j < col; j++) {
      var x2 = j * sizel;
      var y2 = i * sizeb;

      if (cell && cell.row == i && cell.col == j) {
        element.ctx.style.display = "block";
      }

      ctx.font = `${18}px areal `;

      ctx.fillStyle = "black";
      ctx.fillText(data[i - 2][headers[j]], x2 + 2, y2 - 5);
    }
  }

  function getMousePosition(canvas, event) {
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
     r = Math.floor(x / sizel);
     c = Math.floor(y / sizeb);

    console.log("ROW: " + r, "CoL: " + c);
    console.log("header " + headers[r], "data " + data[c - 1][headers[r]]);

    return [r, c];

    //   cell = {row:r, col:c};
  }

  let canvasElem = document.querySelector("canvas");

  canvasElem.addEventListener("click", function (e) {
    var [r, c] = getMousePosition(canvasElem, e);
    console.log(r, c);

    inputtext(r, c, e);
  
  });

//  console.log("line137"+r,c)
}

var arr=[];
var counter = 0;
function down(e) {
  let rect = canvasElem.getBoundingClientRect();
  let x = e.clientX - rect.left;
  let y = e.clientY - rect.top;
  let sizel = 150;
  let sizeb = 30;
  startr = Math.floor(x / sizel);
  startc = Math.floor(y / sizeb);
  console.log("start" + startr, startc); // 7 1
//   ctx.fillStyle = "rgb(163, 164, 167)";
//   // ctx.strokestyle = "black";
//   ctx.fillRect(startr*sizeb, startc*sizel, sizel, sizeb);

  canvasElem.addEventListener("mouseup", function up(e) {
    let rect = canvasElem.getBoundingClientRect();
    let x1 = e.clientX - rect.left;
    let y1 = e.clientY - rect.top;
    let sizel = 150;
    let sizeb = 30;
    endr1 = Math.floor(x1 / sizel);
    endc1 = Math.floor(y1 / sizeb);

    console.log("end" + endr1, endc1); // 7 8

   

if(endr1==startr){

    for (let i = startr; i <= endr1; i++) {
      for (let j = startc; j <= endc1; j++) {
        sum1 += parseInt(data[j - 1][headers[i]]);
        arr.push(parseInt(data[j - 1][headers[i]]))
        counter++
        // console.log(data[j-1][headers[i]])
        // sum += j;
      }
    }
}else{
    alert("select from same row");
}
    console.log(sum1);
    console.log(Math.max(...arr));
    console.log(Math.min(...arr));
    var mean = sum1/counter;
    // alert("mean"+mean);
    if(endr1==startr){  
alert("addition"+sum1 +"\nmean"+mean+"\nmax"+Math.max(...arr)+"\n min"+Math.min(...arr));
    }
canvasElem.removeEventListener("mouseup", up);
    sum1 = 0;
    counter=0;
    arr=[];
  });

 

  // alert("addition  of selection cells are"+sum1);
}
var flag = false;
function sum() {
  if (flag == true) {
    flag = false;
  } else {
    flag = true;
  }

  if (flag) {
    canvasElem.addEventListener("mousedown", down);
    document.getElementById("active").style.background="green";
  } else {
    canvasElem.removeEventListener("mousedown", down);
    document.getElementById("active").style.background="grey";
  }

}
// copy
// var flag3 = false;
// function copytext() {

//   if (flag3 == true) {
//     flag3 = false;
//   } else {
//     flag3 = true;
//   }
//   if(flag3==true){
//   function getMousePosition(canvas, event) {
//     let rect = canvas.getBoundingClientRect();
//     let x = event.clientX - rect.left;
//     let y = event.clientY - rect.top;
//     let sizel = 150;
//     let sizeb = 30;
//    let  r = Math.floor(x / sizel);
//     let c = Math.floor(y / sizeb);

//     // console.log("ROW: " + r, "CoL: " + c);
//     // console.log("header " + headers[r], "data " + data[c - 1][headers[r]]);

//     return [r, c];

//     //   cell = {row:r, col:c};
//   }

// function copy1(e) {
//   var [r, c] = getMousePosition(canvasElem, e);
//   console.log("lastest"+r, c);
//   var copy = data[c - 1][headers[r]];
//   console.log("data which u copied"+copy);
//   navigator.clipboard.writeText(copy);
  
// }
//   // console.log("copy")
//   canvasElem.addEventListener("click", copy1);
//   // console.log("lastest"+r, c);
//   console.log("copy started")
//   document.getElementById("cop").style.color="green";
// }
// else{
//   // canvasElem.removeEventListener("click", copy1);
//   console.log("copy stoped")
//   document.getElementById("cop").style.color="grey";
// }

//     // console.log("laets"+r,c);
//     // var copy = data[c - 1][headers[r]];
//     // navigator.clipboard.writeText(copy);
//     // console.log(copy);


//   }


var flag1 = false;
let insrt = document.querySelector("#inst");
insrt.onclick = ()=>{
 
 

  if (flag1 == true) {
    flag1 = false;
  } else {
    flag1 = true;
  }

  if(flag1){
    console.log("insert was enter");
insrt.style.background="green";




let o = {}
for(let header of headers){
  o[header] = ""
}
console.log(o);

  data.push(o);


excel();



  }else{
    insrt.style.background="grey";
    console.log("button stop");
  }
}

// delete row
var flag2 = false;
let del = document.querySelector("#delete1");
del.onclick = ()=>{
 
 

  if (flag2 == true) {
    flag2 = false;
  } else {
    flag2 = true;
  }

  if(flag2){
    console.log("delete was enter");
delete1.style.background="green";

// delete data[data.length];
// console.log(data.length);
data.pop();
excel();
  }else{
    delete1.style.background="grey";
    console.log("button stop");
  }
}





function down1(e) {
  let rect = canvasElem.getBoundingClientRect();
  let x = e.clientX - rect.left;
  let y = e.clientY - rect.top;
  let sizel = 150;
  let sizeb = 30;
  startr = Math.floor(x / sizel);
  startc = Math.floor(y / sizeb);
  console.log("start " + startr, startc); // 7 1
//   ctx.fillStyle = "rgb(163, 164, 167)";
//   // ctx.strokestyle = "black";
//   ctx.fillRect(startr*sizeb, startc*sizel, sizel, sizeb);


function move(e) {
  let rect = canvasElem.getBoundingClientRect();
  let x1 = e.clientX - rect.left;
  let y1 = e.clientY - rect.top;
  let sizel = 150;
  let sizeb = 30;
  endr1 = Math.floor(x1 / sizel);
  endc1 = Math.floor(y1 / sizeb);
console.log("start1 "+ startr,startc) ;// 7 1
  console.log("end1 " + endr1, endc1); // 7 8

 

// if(endr1==startr){
var copy = "";
  for (let i = startr; i <= endr1; i++) {
    for (let j = startc; j <= endc1; j++) {
      ctx.fillStyle = "rgb(172, 218, 236)";
    
      ctx.fillRect(i * sizel, j* sizeb, sizel, sizeb);
     
      ctx.font = `${18}px areal `;

      
      ctx.fillStyle = "black";
      ctx.fillText(data[j-1][headers[i]], i * sizel + 2, (j + 1) * sizeb - 5);
      ctx.strokeRect(i * sizel, j * sizeb, sizel, sizeb);
       copy += data[j - 1][headers[i]] + "\n";
      // console.log("data which u copied"+copy);
      navigator.clipboard.writeText(copy);
            
    }
  }




}




  canvasElem.addEventListener("mousemove",move);

  canvasElem.addEventListener("mouseup", function up(e) {
    let rect = canvasElem.getBoundingClientRect();
    let x1 = e.clientX - rect.left;
    let y1 = e.clientY - rect.top;
    let sizel = 150;
    let sizeb = 30;
    endr1 = Math.floor(x1 / sizel);
    endc1 = Math.floor(y1 / sizeb);
     
    console.log("end " + endr1, endc1); // 7 8

  



canvasElem.removeEventListener("mousemove", move);
canvasElem.removeEventListener("mouseup", up);
  
  });

  
  
  

  // alert("addition  of selection cells are"+sum1);
}


var drag1 = document.querySelector("#paste");
var flag4 = false;
drag1.onclick = () =>{
  if (flag4 == true) {
    flag4 = false;
  } else {
    flag4 = true;
  }

  if (flag4) {
    canvasElem.addEventListener("mousedown", down1);
    document.getElementById("paste").style.color="green";
  } else {
    // excel();
    
    let sizel = 150;
    let sizeb = 30;
    for (let i = startr; i <= endr1; i++) {
      for (let j = startc; j <= endc1; j++) {
        ctx.fillStyle = "white";
      
        ctx.fillRect(i * sizel, j* sizeb, sizel, sizeb);
       
        ctx.font = `${18}px areal `;
  
        
        ctx.fillStyle = "black";
        ctx.fillText(data[j-1][headers[i]], i * sizel + 2, (j + 1) * sizeb - 5);
        ctx.strokeRect(i * sizel, j * sizeb, sizel, sizeb);
       
      }
    }


    canvasElem.removeEventListener("mousedown", down1);
    document.getElementById("paste").style.color="grey";
  }
}



document.getElementById("file1").addEventListener("change", function (event) {
  const file = event.target.files[0];

  console.log(file);

  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const text = e.target.result;
    const json = csvToJson(text);

    data = json;

    excel();
  };

  reader.readAsText(file);

  document.getElementById("h2").style.display = "none";
  alert("file uploaded");
});

function csvToJson(csv) {
  const lines = csv.split("\n");
  const result = [];

  headers = lines[0].split(",");

  for (let i = 1; i < lines.length; i++) {
    const obj = {};
    const currentLine = lines[i].split(",");
    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = currentLine[j];
    }
    result.push(obj);
  }
  return result;
}

var element = document.getElementById("input1");

//   document.addEventListener("click", printMousePos);
