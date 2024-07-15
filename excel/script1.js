class excel {

constructor(csv, wraper){
    this.wraper = wraper;
    this.csv = csv;
    this.init(); 
    // this.topgrid();
    this.csvToJson();
    // this.init();
    this.f = false;

    

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

let sizel = [100,100,150,100,100,100,200,100,200,100,100,100,100,100,100,100]
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
  // console.log(data.data);
  // this.ctx.fillRect(data.x, data.y,data.sizel,data.sizeb);  //arr[j]
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


click(e,data)
{
  var [r, c] = this.position(data, e);
  // this.cell = this.data[r][c]
  this.cell = this.arr2d[c][r-1];

 console.log(r,c) 
 console.log(this.cell.data)
//  console.log(this.data[r][c]) 

// this.inputtext( r,c,e,this.cell,this.datactx);

}




 inputtext(e,cell,datactx) {
 


  // console.log(r,c)

  let element = document.querySelector(".hidden");
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


  datactx.clearRect(cell.xpos, cell.ypos, cell.width, cell.height);
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













}

