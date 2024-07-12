class excel {

constructor(csv, wraper){
    this.wraper = wraper;
    this.csv = csv;
    this.init(); 
    this.topgrid();
    this.csvToJson();
    // this.init();

}


init(){

let headers = this.canvas(1000,30,"red")
let leftheaders = this.canvas(100,500,"blue")
let data = this.canvas(1000-100,500,"green")
this.headersctx = headers.getContext("2d")
this.leftctx = leftheaders.getContext("2d")
this.datactx = data.getContext("2d")
this.wraper.appendChild(headers);

let div = document.createElement('div');
div.classList.add("subwrapper")
div.appendChild(leftheaders);
div.appendChild(data);
this.wraper.appendChild(div);


// div.style.display = "flex";
// div.style.flexDirection = "row"
// data.style.flexGrow ="1";

let stylesheet = document.createElement("style")
        stylesheet.textContent = `
        .subwrapper{
        display:flex;
        flex-direction : row;
      

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


createdata(){

}
csvToJson() {
    const lines = this.csv.split("\n");
   
    this.arr2d = []

   let headers = lines[0].split(",");
 
    this.arr2d = [];
    let header1d = [];
let alpha = ['a','b','c','d','e'];

    // for(let i=0;i<alpha.length;i++){
    //     let rectData = {};
    //     rectData["xpos"] = j * 100;
    //     rectData["ypos"] = 0;
    //     rectData["width"] = 100;
    //     rectData["height"] = 30;
    //     rectData["color"] = "black";
    //     rectData["data"] = alpha[j];
    //     header1d.push(rectData);
    //     this.datacell(rectData); 
    // }

    for (let j = 0; j < headers.length; j++) {
      let rectData = {};
      rectData["xpos"] = j * 100;
      rectData["ypos"] = 0;
      rectData["width"] = 100;
      rectData["height"] = 30;
      rectData["color"] = "black";
      rectData["data"] = headers[j];
      header1d.push(rectData);
      this.datacell(rectData);
    }
    this.arr2d.push(header1d);

    for (let i = 1; i < lines.length; i++) {
      let data1d = [];
      for (let j = 0; j < headers.length; j++) {
        let rectData = {};
        rectData["xpos"] = j * 100;
        rectData["ypos"] = i * 30;
        rectData["width"] = 100;
        rectData["height"] = 30;
        rectData["color"] = "black";
        rectData["data"] = lines[i].split(",")[j];
        data1d.push(rectData);
        this.datacell(rectData);
      }
      this.arr2d.push(data1d);
 
    }
    console.log(this.arr2d);

    





  }


  datacell(data){
    this.datactx.fillStyle = "white";
    this.datactx.strokestyle = data.color;
    // console.log(data.data);
    // this.ctx.fillRect(data.x, data.y,data.sizel,data.sizeb);  //arr[j]
    this.datactx.fillRect(data.xpos, data.ypos,data.width,data.height); 
    this.datactx.strokeRect(data.xpos, data.ypos,data.width,data.height); //arr[j]
    this.datactx.fillStyle = "black";
    this.datactx.font = `${18}px areal`;
    this.datactx.fillText(data.data, data.xpos  + 2, data.ypos-5);
    this.datactx.stroke();
  }




topgrid(){
    
    for(let i =0;i<1;i++){
  for(let j=0;j<5;j++){
    this.headersctx.fillStyle = "white";
    this.headersctx.strokestyle = "black";
    this.headersctx.fillRect(j*100,i*30,100,30); 
    this.headersctx.strokeRect(j*100,i*30,100,30); //arr[j]

    this.headersctx.stroke();
  }
    }


  
}



hdata = [
    {x : 0, y: 0 , sizel : 100,sizeb:30},
   
]


rect(hdata){
    this.headersctx.fillStyle = "white";
    this.headersctx.strokestyle = "black";
    // this.ctx.fillRect(data.x, data.y,data.sizel,data.sizeb);  //arr[j]
    this.headersctx.fillRect(hdata.x, hdata.y,hdata.sizel,hdata.sizeb); 
    this.headersctx.strokeRect(hdata.x, hdata.y,hdata.sizel,hdata.sizeb); //arr[j]
   
    this.headersctx.stroke();
}

}

