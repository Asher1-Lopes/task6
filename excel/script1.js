class excel {

constructor(csv, wraper){
    this.wraper = wraper;
    this.csv = csv;
    this.init(); 
    // this.topgrid();
    this.csvToJson();
    // this.init();
    this.f = false;

    var startr = 0;
var startc = 0;
var endr1 = 0;
var endc1 = 0;
this.startr = startr;
this.startc = startc;
this.endr1 = endr1;
this.endc1 = endc1
this.flag = false
}


init(){




let headers = this.canvas(2100,30,"white")
let leftheaders = this.canvas(50,2000,"white")
let data = this.canvas(2000,2000,"white")
this.data  = data
this.headersctx = headers.getContext("2d")
this.leftctx = leftheaders.getContext("2d")
this.datactx = data.getContext("2d")
this.wraper.appendChild(headers);

let div = document.createElement('div');
this.div = div
this.div.classList.add("subwrapper")
this.div.appendChild(leftheaders);
this.div.appendChild(data);
this.wraper.appendChild(div);

let input = document.createElement('input');
  input.classList.add("hidden")
 
  this.div.appendChild(input);


// div.style.display = "flex";
// div.style.flexDirection = "row"
// data.style.flexGrow ="1";

this.data.addEventListener("click", (e)=> this.click(e,this.data)) 
this.data.addEventListener("dblclick", (e)=> this.dblclick(e,this.data)) 


this.down = (e)=> this.mousedown1(e,this.data,this.cell)
this.data.addEventListener("mousedown", this.down) 



let stylesheet = document.createElement("style")
        stylesheet.textContent = `
       
       .wraper{
        height:600px;
        width:100vw;
        overflow-y :scroll;
        position:relative;
        }
       
        .subwrapper{
        display:flex;
        flex-direction : row;
      
         position:relative;
        }

        
        .hidden{
        display: none;
      

      }
     input{
        position: absolute;
        z-index: 1;
        box-sizing:border-box;
        border:3px solid green;
   
        

    background:white;
    outline: none;
     } 

      
  
        
        `
 document.head.appendChild(stylesheet)


}

canvas(width,height,color){
let canvas = document.createElement('canvas');
canvas.width = width;
canvas.height = height;
canvas.style.background = color;




return canvas;

}




csvToJson() {
    const lines = this.csv.split("\n");
   
    this.arr2d = []

   let headers = lines[0].split(",");
 
    this.arr2d = [];
    let header1d = [];
let nos = ['1','2','3','4','2','3','4','2','3','4','2','3','4','2','3','4','2','3','4','2','3','4','2','3','4','2','3','4'];
let alpha = ['a','b','c','d','e','f','g','h','i','k','l','h','i','k','l'];

let sizel = [150,150,150,150,150,150,150,150,150,150,150,150,150,150,150,150,150,150]
this.sizel = sizel;




let c =0;
    for(let i=0;i<alpha.length;i++){
        let rectData = {};
        rectData["xpos"] =   c+50;
        rectData["ypos"] = 0;
        rectData["width"] = sizel[i];
        rectData["height"] = 30;
        rectData["color"] = "black";
        rectData["data"] = alpha[i];

        this.topgrid(rectData); 
        c += sizel[i];
      
    }

    for(let i=0;i<nos.length;i++){
      let rectData = {};
      rectData["xpos"] =  0;
      rectData["ypos"] = i * 30;
      rectData["width"] = 50;
      rectData["height"] = 30;
      rectData["color"] = "black";
      rectData["data"] = nos[i];
    
      this.sidebar(rectData); 


  }






let counter =0;
    for (let j = 0; j < headers.length; j++) {
      let rectData = {};
      rectData["xpos"] = counter ;
      rectData["ypos"] = 0;
      rectData["width"] = sizel[j];
      rectData["height"] = 30;
      rectData["color"] = "black";
      rectData["data"] = headers[j];
      header1d.push(rectData);
      this.datacell(rectData);
      counter +=sizel[j];
    }
    this.arr2d.push(header1d);



    for (let i = 1; i < lines.length; i++) {
      let data1d = [];
      counter =0;
      for (let j = 0; j < headers.length; j++) {
        let rectData = {};
        rectData["xpos"] =counter;
        rectData["ypos"] = i * 30;
        rectData["width"] = sizel[j];
        rectData["height"] = 30;
        rectData["color"] = "black";
        rectData["data"] = lines[i].split(",")[j];
        data1d.push(rectData);
        this.datacell(rectData);
        counter +=sizel[j];
      }
      this.arr2d.push(data1d);
 
    }
    console.log(this.arr2d);

    


this.active = this.arr2d[0][0];


  }





  datacell(data){
    

        this.datactx.save();
        this.datactx.fillStyle = "white";
        this.datactx.strokestyle = data.color;
        this.datactx.rect(data.xpos, data.ypos,data.width,data.height);
        this.datactx.clip();

    this.datactx.fillStyle = "black";
    this.datactx.font = `${18}px areal`;
    this.datactx.fillText(data.data, data.xpos  + 2, data.ypos +data.height -5) ;
    this.datactx.restore();
    this.datactx.stroke();



  }






topgrid(alpha){
    

    this.headersctx.fillStyle = "grey";
    this.headersctx.strokestyle = alpha.color;
    // console.log(data.data);
    // this.ctx.fillRect(data.x, data.y,data.sizel,data.sizeb);  //arr[j]
    this.headersctx.fillRect( alpha.xpos, alpha.ypos, alpha.width, alpha.height); 
    this.headersctx.strokeRect( alpha.xpos, alpha.ypos, alpha.width, alpha.height); //arr[j]
    this.headersctx.fillStyle = "black";
    this.headersctx.font = `${18}px areal`;
    this.headersctx.fillText( alpha.data, alpha.xpos  + 30,  alpha.ypos + alpha.height -5) ;
    this.headersctx.stroke();


  
}


sidebar(alpha){
    

  this.leftctx.fillStyle = "grey";
  this.leftctx.strokestyle = alpha.color;
 
  this.leftctx.fillRect( alpha.xpos, alpha.ypos, alpha.width, alpha.height); 
  this.leftctx.strokeRect( alpha.xpos, alpha.ypos, alpha.width, alpha.height); //arr[j]
  this.leftctx.fillStyle = "black";
  this.leftctx.font = `${18}px areal`;
  this.leftctx.fillText( alpha.data, alpha.xpos  + 10,  alpha.ypos + alpha.height -5) ;

  this.leftctx.stroke();



}

position(data,event){


 
    let rect = data.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;

let sum =0;
let r=0;
let length = this.sizel.length;
 for(let i =0;i<length;i++){

  if(x>sum){
    r++
  }else{
    break;
  }
sum += this.sizel[i];

 }



  //  let  r = Math.floor(x /100 );
    let c = Math.floor(y / 30);

    console.log("ROW: " + r, "CoL: " + c);
    // console.log("header " + data[r], "data " + data[c - 1][headers1d[r]]);
    console.log(this.sizel.length)


    return [r, c];

   

    

}

dblclick(e,data){
  console.log(this.cell)
  this.inputtext(e,this.cell,this.datactx);
}







 inputtext(e,cell,datactx) {
 


  // console.log(r,c)

  var element = document.querySelector(".hidden");
  this.element = element;
 this.element.style.width=`${cell.width}px` 
 this.element.style.height=`${cell.height}px`
//  console.log(this.element)
  this.element.style.display = 'block';
// console.log(cell)
  this.element.style.left = `${cell.xpos+50}px`;
  this.element.style.top = `${cell.ypos}px`;
  
// console.log(datactx)
  this.element.value = cell.data;
  // // data[c - 1][headers[r]];
  
  this.f = true;
  this.element.focus();

  // console.log(x3, y3);

  this.x = (e)=> this.PressEnter(e,datactx,cell)
  this.element.addEventListener("blur", this.x);

 
}


 PressEnter(event,datactx,cell) {
  // console.log(cell);
  if (this.f) {
  //   // var canvas = document.getElementById("canvas");
    var nvalue = this.element.value;
  //   data[y3 - 1][headers[x3]] = nvalue;
  cell.data = nvalue;


  this.datactx.clearRect(cell.xpos, cell.ypos, cell.width, cell.height);
  // this.datacell(cell)
  this.datactx.save();
  this.datactx.fillStyle = "white";
  this.datactx.strokestyle = "black";
  this.datactx.rect(cell.xpos, cell.ypos,cell.width,cell.height);
  this.datactx.clip();

this.datactx.fillStyle = "black";
this.datactx.font = `${18}px areal`;
this.datactx.fillText(nvalue, cell.xpos  + 2, cell.ypos +cell.height -5) ;
this.datactx.restore();
this.datactx.stroke();









    this.f = false;
    
    this.element.removeEventListener("blur", this.x);
  
   
  }
}



click(e,data)
{
  var [r, c] = this.position(data, e);
  // this.cell = this.data[r][c]

  this.cell = this.arr2d[c][r-1];

  // return {row:r,col:c};




 

this.element.style.display="none";





}

// keys(){







// }


move(e,data,cell){

  // console.log("cell"+cell.width)
      let rect = data.getBoundingClientRect();
      let sum=0;

let r=0;
    let x1 = e.clientX - rect.left;
    let y1 = e.clientY - rect.top;

    for(let i =0;i<length;i++){

      if(x1>sum){
        r++
      }else{
        break;
      }
    sum += this.sizel[i];
    
     }
this.sizel
  let sizel = 150;
    let sizeb = 30;
    this.endr1 = Math.floor(x1 / sizel);
    this.endc1 = Math.floor(y1 / sizeb);
  console.log("start1 "+ this.startr,this.startc) ;// 7 1 1 4
    console.log("end1 " + this.endr1, this.endc1); // 7 8 0 2
 let maxi = Math.max(this.startr,this.endr1)
  let mini = Math.min(this.startr,this.endr1)

  let maxj = Math.max(this.startc,this.endc1)
  let minj = Math.min(this.startc,this.endc1) 


  for (let i = mini; i <= maxi; i++) {
    for (let j = minj; j <= maxj; j++) {
      // let sizel = this.sizel[i];
      this.datactx.fillStyle = "rgb(172, 218, 236)";
    
      this.datactx.fillRect(i * sizel, j* sizeb, sizel, sizeb);
     
      this.datactx.font = `${18}px areal `;

      
      this.datactx.fillStyle = "black";
      this.datactx.fillText("hi", i * sizel + 2, (j + 1) * sizeb - 5);
      this.datactx.strokeRect(i * sizel, j * sizeb, sizel, sizeb);
      
      // console.log("data which u copied"+copy);
  this.flag = true;
            
    }
  }






}

mouseup(e,data,cell){
  // console.log(data)
  let sum=0;

let r=0;
    let rect = this.data.getBoundingClientRect();
    let x1 = e.clientX - rect.left;
    for(let i =0;i<length;i++){

      if(x1>sum){
        r++
      }else{
        break;
      }
    sum += this.sizel[i];
    
     }
  
    let y1 = e.clientY - rect.top;
    let sizel = 150;

    // let y1 = e.clientY - rect.top;
    // let sizel = 150;
    let sizeb = 30;
    this.endr1 = Math.floor(x1 / sizel);
    this.endc1 = Math.floor(y1 / sizeb);
     
    console.log("end1 " + this.endr1, this.endc1); // 7 8

// console.log(cell)
  


// // canvasElem.removeEventListener("mousemove", move);


data.removeEventListener("mousemove", this.mo);
data.removeEventListener("mouseup", this.up);
// data.removeEventListener("mousedown", this.down);


}



mousedown1(e,data,cell){

 
  let length = this.sizel.length;
  console.log(length)
  // this.cell = cell;
  console.log(cell)
  this.active = cell;
let sum=0;

let r=0;
  // console.log(data)
  let rect = data.getBoundingClientRect();
  let x = e.clientX - rect.left;

  for(let i =0;i<length;i++){

    if(x>sum){
      r++
    }else{
      break;
    }
  sum += this.sizel[i];
  
   }

  let y = e.clientY - rect.top;
  let sizel = 150;
  let sizeb = 30;
  this.startr = Math.floor(x / sizel);
 this.startc = Math.floor(y / sizeb);
  console.log("start " + this.startr, this.startc); // 7 1


  this.mo = (e)=> this.move(e,data,this.active)
  data.addEventListener("mousemove", this.mo) 
  
  
  
 

 
this.up = (e)=> this.mouseup(e,data,cell)
data.addEventListener("mouseup",this.up) 




}




}

