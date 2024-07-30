class excel {
  constructor(csv, wraper) {

    let num = []
    this.num = num
    this.scrollY = 0;
    this.cellheight = 30;
    this.scrollX = 0;
    var startr = 0;
    var startc = 0;
    var endr1 = 0;
    var endc1 = 0;
    this.startr = startr;
    this.startc = startc;
    this.endr1 = endr1;
    this.endc1 = endc1;
    this.flag = false;
    this.selectedfinal = [];
    // this.acti
    this.boole = false;
    this.f = false;
    var draw;
    this.draw = draw;
    this.wraper = wraper;
    this.csv = csv;
    this.init();
    // this.topgrid();
    this.csvToJson();
    // this.init();
 
    this.headerdraw();
    this.sidedraw();

    this.drawOptimized();

    // this.extend();
    // this.extentside()
  

 

    
    // Normalize coordinate system to use CSS pixels.
  
    
  }

  init() {
    this.sizel = [
      100, 100, 150, 150, 150, 150, 150, 150, 150, 150, 100, 100, 100, 100, 100,
      100, 100, 100,100,100,100,100,100,100,100,100
    ];

    let stylesheet = document.createElement("style");
    stylesheet.textContent = `
       .headers{
      //  position: sticky;
      //    top: 110px;
      //    z-index: 2;
       }

       .wraper{
       height:100vh;
      //   width:100vw;
      //  overflow-y :scroll;
        position:relative;
        margin:3px;
        }
       
        .subwrapper{
        display:flex;
        flex-direction : row;
        
    
      
         position:relative;
        }
         .data{
         cursor: cell;
         }

        
        .hidden{
        display: none;
      

     
        position: absolute;
        z-index: 1;
        box-sizing:border-box;
        border:3px solid green;
        background: transparent;
        

    background:white;
    outline: none;
     } 
       .draggable-div {
            position: absolute;
            width: 300px;
            height: 300px;
            background-color: white;
            z-index:1;
            border: 2px solid white;
            border-radius : 5px;
            
            display:none
        }
        .close-btn {
            position: absolute;
            top: 5px;
            right: 5px;
            width: 20px;
            height: 20px;
            background-color: red;
            color: white;
            text-align: center;
            line-height: 20px;
            cursor: pointer;
        }
            .div3{
             display: inline-block;
             width:50px;
            //  height:50px;
            }

      
  
        
        `;
        const scale = window.devicePixelRatio;
        this.scale = scale
   
    document.head.appendChild(stylesheet);
    let div3 = document.createElement("div");
    this.div3 = div3;
    this.wraper.appendChild(div3);
    div3.textContent = "";
    div3.classList.add("div3");
    let headers = this.canvas(this.wraper.offsetWidth-50, 30, "white");
    headers.classList.add("headers");

    let graph = this.canvas(200, 200, "white");

    graph.classList.add("graph");
    // graph.id.add("mychart")
    graph.setAttribute("id", "myChart");
    this.graphctx = graph.getContext("2d");
    // this.graph = graph

    this.headers = headers;
    // console.log( this.wraper.offsetHeight)
    let leftheaders = this.canvas(50,this.wraper.offsetHeight-30, "white");
    
    let data = this.canvas(this.wraper.offsetWidth-50, this.wraper.offsetHeight-30, "white");
    data.classList.add("data");
    this.data = data;
    this.headersctx = headers.getContext("2d");
    this.leftctx = leftheaders.getContext("2d");
    this.leftheaders = leftheaders
    this.datactx = data.getContext("2d");
    this.wraper.appendChild(headers);

    let div = document.createElement("div");
    this.div = div;
    
    this.div.classList.add("subwrapper");

    // let div1 = document.createElement("div");
    // this.div1 = div1;



    // search12

    const searchbtn = document.getElementById("search12")
    // console.log(searchbtn)
    const close = document.getElementById("close")
    this.searchbtn = searchbtn
    this.close = close

    let draggablediv = document.createElement("div");
    draggablediv.classList.add("draggable-div");

    let closebtnv = document.createElement("div");
    closebtnv.classList.add("close-btn");

    // closebtnv.id.add("close-btn")
    closebtnv.textContent = "X";
    this.div.appendChild(draggablediv);
    draggablediv.appendChild(closebtnv);
    draggablediv.appendChild(graph);
    /*<div id="draggableDiv" class="draggable-div">
<div class="close-btn" id="closeBtn">X</div>
</div> */

    this.div.appendChild(leftheaders);
    this.div.appendChild(data);
    this.wraper.appendChild(div);

    let input = document.createElement("input");
    input.classList.add("hidden");

    this.div.appendChild(input);

    // div.style.display = "flex";
    // div.style.flexDirection = "row"
    // data.style.flexGrow ="1";
    const find = document.getElementById("find");
    find.addEventListener("click", (e) => this.search2DArray(e));
    const replace1 = document.getElementById("replace")
    replace1.addEventListener("click", (e) => this.replaceitem(e));


    this.data.addEventListener("click", (e) => this.click(e, this.data));


    this.data.addEventListener("dblclick", (e) => this.dblclick(e, this.data));

    window.addEventListener("keydown", (e) => this.keyfunc(e, this.data));
    window.addEventListener("keydown", (e) => this.xscroll(e));
    this.down = (e) => this.mousedown1(e, this.data, this.cell);
    this.data.addEventListener("mousedown", this.down);

    document.addEventListener("DOMContentLoaded", (e) =>
      this.draggraph(e, draggablediv, closebtnv)
    );

    this.headers.addEventListener("mousemove", (e) =>
      this.resize(e, this.headers)
    );

    this.data.addEventListener("wheel", (e) => this.scroller(e));
    // console.log(this.searchbtn)
    this.searchbtn.addEventListener("click",(e)=>this.searchdiv(e))
    // const scale = window.devicePixelRatio; // Change to 1 on retina screens to see blurry canvas.
    // this.scale = scale
    this.datactx.scale(window.devicePixelRatio, window.devicePixelRatio);
    // this.leftctx.scale(scale, scale);
    // this.headersctx.scale(scale, scale);
  }

searchdiv(e){
  // this.searchbtn
  // console.log(this.searchbtn)
  // this.searchbtn.style.display="block";
  let searchdiv1 = document.getElementById("searchdiv")
  this.searchdiv1 = searchdiv1
  searchdiv1.style.display="block"



  this.close.addEventListener("click",(e)=>this.closed(e))
  // this.close 

}
closed(e){
   this.searchdiv1.style.display="none"
}




  draggraph(e, draggablediv, closebtnv) {
    // const canvas = document.getElementById('myCanvas');
    // data we have
    // const draggableDiv = document.getElementById('draggableDiv');
    const graphBtn = document.getElementById("graph");
    //   console.log(graphBtn)
    //  console.log(draggablediv)
    //  console.log(closebtnv)
    let isDragging = false;
    let offsetX, offsetY;
    // console.log("1")

    // console.log(graphBtn)
    var clickgraph = (e) => {
      // console.log(e)

      const rect = this.data.getBoundingClientRect();
      const x = 50;
      const y = 50;

      draggablediv.style.left = `${x}px`;
      draggablediv.style.top = `${y}px`;
      draggablediv.style.display = "block";
    };
    var downdiv = (e) => {
      if (e.target === closebtnv) return; // Do not start dragging if the close button is clicked

      isDragging = true;
      const rect = draggablediv.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
    };

    var movediv = (e) => {
      if (isDragging) {
        draggablediv.style.left = `${e.clientX - offsetX}px`;
        draggablediv.style.top = `${e.clientY - offsetY}px`;
      }
    };

    var updiv = (e) => {
      isDragging = false;
    };

    closebtnv.addEventListener("click", () => {
      draggablediv.style.display = "none";
    });

    draggablediv.addEventListener("mousedown", downdiv);
    document.addEventListener("mousemove", movediv);
    document.addEventListener("mouseup", updiv);
    graphBtn.addEventListener("click", clickgraph);
  }

  graph1() {

if(this.selectedfinal.length>0){
    let startcor = this.selectedfinal[0].row;
    let startcoc = this.selectedfinal[0].col; //0

    let endcor = this.selectedfinal[this.selectedfinal.length - 1].row;
    let endcoc = this.selectedfinal[this.selectedfinal.length - 1].col; //0

    // console.log("latest"+startcoc,startcor,endcoc,endcor)
    let pi = "";
    var pie = false
    var line = false
    var bar = false

    if(pie ==true){
      pi = "pie" 
    }else if(line==true){
    pi = "line"
    }else if (bar==true){
    pi = "bar"
    }
    let labels1 = [];
    let data1 = [];
    var count = 0;

    // console.log(this.arr2d[0][startcoc].data)
    // for(let i =startcoc;i<=endcoc;i++){
    for (let j = startcoc; j <= endcoc; j++) {
      labels1[count] = this.arr2d[0][j].data;
      count++;
    }

    // }
    // console.log(labels1)

    // console.log(data1);

    for (let i = 0; i < this.selectedfinal.length; i++) {
      data1[i] = this.selectedfinal[i].data;
      //  count++;
    }

    // console.log(data1);

    if (this.draw != null) this.draw.destroy();

    this.draw = new Chart(this.graphctx, {
      type: "pie",
      data: {
        labels: labels1,
        datasets: [
          {
            label: "# of Votes",
            data: data1,
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

  }
  }

  extend(count,axis) {
    console.log("1")
    // console.log(this.arr2d[this.arr2d.length - 1][0].data);
    // console.log(this.arr2d[0][1])
    // let lastarr = this.arr2d[this.arr2d.length - 1];
    // console.log(lastarr);
    let length = this.arr2d[this.arr2d.length - 1].length;
    // let count = 5;
    let jlen = this.arr2d.length;

    if(axis=="y"){
    for (let j = jlen; j < jlen + count; j++) {
    let data1d = [];

      // console.log(j);
      for (let i = 0; i < length; i++) {
        let rectData = {};
        rectData["xpos"] = this.arr2d[this.arr2d.length - 1][i].xpos;
        rectData["ypos"] = this.arr2d[j - 1][i].ypos + this.arr2d[j - 1][i].height;
        rectData["width"] = this.sizel[i];
        rectData["height"] = 30;
        rectData["color"] = "black";
        rectData["row"] = this.arr2d[this.arr2d.length - 1][i].col + 1;
        rectData["col"] = this.arr2d[this.arr2d.length - 1][i].row;
        rectData["data"] = "";
        data1d.push(rectData);
        this.datacell(rectData);

        // counter +=this.sizel[j];
      }
      this.arr2d.push(data1d);
    }
    this.extentside(count)
   
  }

   
   if(axis=='x'){ 
          this.arr2d.forEach((row, i) => {
            let prevColumns = row.length;

            for (let j = prevColumns; j < prevColumns+ count; j++) {

              let left = row[j - 1].xpos + row[j - 1].width;
              let top = row[j-1].ypos;
              // console.log(top)
              let rectData = {};
              rectData["xpos"] = left;
              rectData["ypos"] = top;
              rectData["width"] = 100;
              // this.arr_width.push(100)
            this.sizel.push(100)  
              
              rectData["height"] = 30;
              rectData["color"] = "black";
              rectData["data"] = "";
              // rectData["lineWidth"] = 1;
              rectData["rows"] = i;
              rectData["cols"] = j;
              row.push(rectData);
              // data1d.push(rectData);
              this.datacell(rectData);
            }
           
          });
//           
       
this.extendheader(count)
     
}




    // console.log(this.arr2d.length);
    // let lastarr = this.arr2d[this.arr2d.length-1]
    // console.log(lastarr)
  
  }



extendheader(count){
// console.log("eee"+this.alpha.length)
let prev= this.alpha.length
  for (let i = prev; i <prev+count ; i++) {
    let rectData = {};
 
    rectData["xpos"] = this.alpha[i -1].xpos + this.alpha[i-1 ].width;
    rectData["ypos"] = 0;
    rectData["width"] = 100;

    rectData["height"] = 30;
    rectData["color"] = "black";
    rectData["data"] = this.toLetters(i);

    // this.topgrid(rectData);
    this.alpha.push(rectData)
    // c += this.sizel[i];
  }


}

toLetters(num){
  var mod = num % 26,
      pow = num / 26 | 0,
      out = mod ? String.fromCharCode(64 + mod) : (--pow, 'Z');
  return pow ? this.toLetters(pow) + out : out;
}




xscroll(event){
  if(event.shiftKey){
    this.xscrollX = true
  }else{
    this.xscrollX = false
  }
}


  scroller(event) {
    // console.log(event)
    let { deltaX, deltaY } = event;
    if(event.shiftKey){
    this.scrollX = Math.max(0, this.scrollX + deltaY );
    }else{
    this.scrollY = Math.max(0, this.scrollY + (deltaY < 0 ? -30 : 30));
    }

    this.drawOptimized();
  }

  drawOptimized() {
    // console.log("22")
console.log(this.scrollY)
console.log(this.scrollX)
    this.datactx?.clearRect(0, 0, this.data.width, this.data.height);
    this.leftctx.clearRect(0,0,this.leftheaders.width,this.leftheaders.height)
    this.headersctx.clearRect(0,0,this.headers.width,this.headers.height)
    let canvaWidth = this.data.offsetWidth;
    let canvaHeight = this.data.offsetHeight;

// console.log(this.cell)
    let initHeight = 0;
    let newScrollY = this.scrollY 
   
    // console.log("🚀 ~ Excel ~ drawOptimized ~ newScrollY:", newScrollY);
    this.newScrollY = newScrollY
    let newScrollX = this.scrollX;
    // this.datactx?.translate(-newScrollX, -newScrollY);

    for (let i = newScrollY / this.cellheight; i < this.arr2d.length; i++) {
      const row = this.arr2d[i];
    if(i==this.arr2d.length-1){
      // this.extentside(10,'y')
      // this.sidebar(this.num[i])
      this.extend(10,"y")
      // this.extentside(10)
    }

      if (initHeight > canvaHeight + newScrollY) {
        break;
      } else {
        let initWidth = 0;
        initHeight += row[0].height;
       this.sidebar(this.num[i])
      //  this.topgrid(this.alpha[i])
       
        // this.drawCell(row[0])
        for (let j = 0; j < row.length; j++) {
          const col = row[j];
          if(j == row.length-1){
            this.extend(10,"x")
            //
           
          }
          if(initWidth>canvaWidth+newScrollX){
            break;
          }else{

            initWidth +=row[j].width
            const col = row[j]
            this.datacell(col)
            this.topgrid(this.alpha[j])
       
            
          }

      
      }
    }
   
  }

}

  canvas(width, height, color) {
    // const scale = window.devicePixelRatio; // Change to 1 on retina screens to see blurry canvas.
    // canvas.width = Math.floor(size * scale);
    // canvas.height = Math.floor(size * scale);

    // const scale = window.devicePixelRatio; // Change to 1 on retina screens to see blurry canvas.
    // canvas.width = Math.floor(size * scale);
    // canvas.height = Math.floor(size * scale);


    let canvas = document.createElement("canvas");
    canvas.width = Math.floor( width*window.devicePixelRatio) ;
    canvas.height =  Math.floor(height * window.devicePixelRatio);
    canvas.style.background = color;

    return canvas;
  }

  csvToJson() {
    const lines = this.csv.split("\n");

    this.arr2d = [];

    let headers = lines[0].split(",");

    this.arr2d = [];
    let header1d = [];

    // this.sizel = sizel;

    this.datactx.clearRect(0, 0, 2000, 2000);

    let counter = 0;
    for (let j = 0; j < headers.length; j++) {
      let rectData = {};
      rectData["xpos"] = counter;
      rectData["ypos"] = 0;
      rectData["width"] = this.sizel[j];
      rectData["height"] = 30;
      rectData["color"] = "black";
      rectData["row"] = 0;
      rectData["col"] = j;
      rectData["data"] = headers[j];
      header1d.push(rectData);
      this.datacell(rectData);
      counter += this.sizel[j];
    }
    this.arr2d.push(header1d);

    for (let i = 1; i < lines.length; i++) {
      let data1d = [];
      counter = 0;

      for (let j = 0; j < headers.length; j++) {
        let rectData = {};
    
        rectData["xpos"] = counter;
        rectData["ypos"] = i * 30;
        rectData["width"] = this.sizel[j];
        rectData["height"] = 30;
        rectData["color"] = "black";
        rectData["row"] = i;
        rectData["col"] = j;
        rectData["data"] = lines[i].split(",")[j];
        data1d.push(rectData);
        this.datacell(rectData);
        counter += this.sizel[j];
     
      }
      this.arr2d.push(data1d);
    }
    // console.log(this.arr2d);

    this.active = this.arr2d[0][0];
  }

  datacell(data) {
    // if(!data) return;
    this.datactx.scale(this.scale, this.scale);
    this.datactx.save();
    this.datactx.beginPath();
    this.datactx.fillStyle = "white";
    this.datactx.strokestyle = "black";
    this.datactx.lineWidth = 2
    this.datactx.rect(data.xpos-0.5 - this.scrollX, data.ypos - this.scrollY -0.5, data.width+1, data.height+1);
    this.datactx.clip();


    this.datactx.fillRect(data.xpos - 0.5- this.scrollX, data.ypos - this.scrollY - 0.5, data.width + 1, data.height + 1);

    this.datactx.fillStyle = "black";
    this.datactx.font = `${18}px areal`;
    this.datactx.fillText(
      data.data,
      data.xpos + 2- this.scrollX,
      data.ypos + data.height - 5 - this.scrollY
    );

    this.datactx.stroke();
    this.datactx.restore();
  }

  headerdraw() {
    this.headersctx.clearRect(0, 0, 2100, 30);
    let aplhabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    let arr1 = aplhabets.split("")
    // console.log(arr1)
    // console.log(this.sizel.length)
    let alpha = [];
    this.alpha = alpha
    let c = 0;
    for (let i = 0; i < arr1.length; i++) {
      let rectData = {};

      rectData["xpos"] = c ;
      rectData["ypos"] = 0;
      rectData["width"] = this.sizel[i];
      rectData["height"] = 30;
      rectData["color"] = "black";
      rectData["data"] = arr1[i];

      // this.topgrid(rectData);
      this.alpha.push(rectData)
      c += this.sizel[i];
      
    }

    // console.log(this.alpha)
  }

  topgrid(alpha) {
    if (this.boole == true) {
      // console.log("true");
      this.headersctx.beginPath();
      this.headersctx.save();
      this.headersctx.fillStyle = "white";
     
      this.headersctx.fillStyle = "grey";
      this.headersctx.font = `${18}px areal`;
      this.headersctx.fillText(
        alpha.data,
        alpha.xpos + 30,
        alpha.ypos + alpha.height
      );
      this.headersctx.stroke();
      this.boole = false;
    } else {
      this.headersctx.beginPath();
      this.headersctx.save();
      this.headersctx.fillStyle = "#E8E8E8";
      this.headersctx.strokestyle = "black";
      // console.log(data.data);
      // this.ctx.fillRect(data.x, data.y,data.sizel,data.sizeb);  //arr[j]
      this.headersctx.fillRect(
        alpha.xpos-this.scrollX,
        alpha.ypos,
        alpha.width,
        alpha.height
      );
      this.headersctx.strokeRect(
        alpha.xpos-this.scrollX,
        alpha.ypos,
        alpha.width,
        alpha.height
      ); //arr[j]
      this.headersctx.fillStyle = "black";
      this.headersctx.font = `${18}px areal`;
      this.headersctx.fillText(
        alpha.data,
        alpha.xpos + 30-this.scrollX,
        alpha.ypos + alpha.height - 5
      );
      this.headersctx.stroke();
    }
  }

  headerdraw1(){
    for (let i = 0; i < this.alpha.length; i++) {
   
      this.topgrid(this.alpha[i]);
      
    }
  }
  
  sidedraw() {

    // console.log("thisss"+this.nos.length)
    
    for (let i = 0; i < this.arr2d.length; i++) {
      let rectData = {};
      rectData["xpos"] = 0;
      rectData["ypos"] = i * 30;
      rectData["width"] = 50;
      rectData["height"] = 30;
      rectData["color"] = "black";
      rectData["data"] = i+1;

      this.sidebar(rectData);
      this.num.push(rectData)
    }
   
    // console.log("num arr",this.num)
    // console.log("num arr"+this.num[0].data)
  }

  sidedraw1() {

    // console.log("thisss"+this.nos.length)
   
    for (let i = 0; i < this.num.length; i++) {
   
      this.sidebar(this.num[i]);
      
    }
    // console.log("num arr",this.num)

   
    // console.log("num arr"+this.num[0].data)
  }

  extentside(count){
 
    let length = this.num.length;

    for (let i = length; i <length+count; i++) {
      let rectData = {};
      rectData["xpos"] = 0;
      rectData["ypos"] =  this.num[i-1].ypos + this.num[i-1].height;
      rectData["width"] = 50;
      rectData["height"] = 30;
      rectData["color"] = "black";
      rectData["data"] = i+1;
    
      this.sidebar(rectData);
      this.num.push(rectData);
    }

  // console.log("this"+this.num.length)



   
  
  }




  sidebar(alpha) {
    // acti 
    // console.log("th"+this.scrollY)

    // this.leftctx.fillStyle = "grey";
    // this.leftctx.strokestyle = "black";

    // this.leftctx.fillRect(alpha.xpos, alpha.ypos-this.scrollY, alpha.width, alpha.height);
    // this.leftctx.strokeRect(alpha.xpos, alpha.ypos-this.scrollY, alpha.width, alpha.height); //arr[j]
    // this.leftctx.fillStyle = "black";
    // this.leftctx.font = `${18}px areal`;
    // this.leftctx.fillText(
    //   alpha.data,
    //   alpha.xpos + 10,
    //   alpha.ypos + alpha.height - 5-this.scrollY
    // );

    // this.leftctx.stroke();
  // this.leftctx.translate(this.scrollX,0)
// console.log("xxx"+this.scrollX)
   
this.leftctx.restore()
    // this.leftctx.transform(1,0,0,1,0,0)
    // this.leftctx.translate(this.scrollX,0)
    this.leftctx.save();
    this.leftctx.beginPath();
   
    this.leftctx.fillStyle = "#E8E8E8";
    this.leftctx.strokestyle = "black";
    // console.log(data.data);
    // this.ctx.fillRect(data.x, data.y,data.sizel,data.sizeb);  //arr[j]
    this.leftctx.fillRect(
      alpha.xpos,
      alpha.ypos-this.scrollY,
      alpha.width,
      alpha.height
    );
    this.leftctx.strokeRect(
      alpha.xpos,
      alpha.ypos-this.scrollY,
      alpha.width,
      alpha.height
    ); //arr[j]
    this.leftctx.fillStyle = "black";
    this.leftctx.font = `${18}px areal`;
    this.leftctx.fillText(
      alpha.data,
      alpha.xpos + 5,
      alpha.ypos + alpha.height - 5-this.scrollY
    );
    this.leftctx.stroke();
  
   






    
  }
// same as extentside
  position(data, event) {
    let rect = this.data.getBoundingClientRect();
    let x = event.clientX - rect.left + this.scrollX;
    let y = event.clientY - rect.top + this.scrollY ;

    let sum = 0;
    let r = 0;
    let length = this.sizel.length;
    for (let i = 0; i < length; i++) {
      if (x > sum) {
        r++;
      } else {
        break;
      }
      sum += this.sizel[i];
    }

    //  let  r = Math.floor(x /100 );
    let c = Math.floor(y / 30);

    console.log("ROW: " + r, "CoL: " + c);
    // console.log("header " + data[r], "data " + data[c - 1][headers1d[r]]);
    // console.log(this.sizel.length);

    return [r, c, sum - this.sizel[r - 1]];
  }

  dblclick(e, data) {
    // console.log(this.cell);
    this.inputtext(e, this.cell, this.datactx);
  }

  inputtext(e, cell, datactx) {
    // console.log(r,c)

    var element = document.querySelector(".hidden");

    this.element = element;
    this.element.style.width = `${cell.width}px`;
    this.element.style.height = `${cell.height}px`;
    //  console.log(this.element)
    this.element.style.display = "block";

    // console.log(cell)
    this.element.style.left = `${cell.xpos + 50-this.scrollX}px`;
    this.element.style.top = `${cell.ypos - this.scrollY}px`;

    // console.log(datactx)
    this.element.value = cell.data;
    // // data[c - 1][headers[r]];

    this.f = true;
    this.element.focus();

    // console.log(x3, y3);

    this.x = (e) => this.PressEnter(e, datactx, cell);
    this.element.addEventListener("blur", this.x);
  }

  PressEnter(event, datactx, cell) {
    // console.log(cell);
    if (this.f) {
      //   // var canvas = document.getElementById("canvas");
      var nvalue = this.element.value;
      //   data[y3 - 1][headers[x3]] = nvalue;
      cell.data = nvalue;

      this.datactx.clearRect(cell.xpos-0.5-this.scrollX, cell.ypos - this.scrollY-0.5, cell.width+1, cell.height+1);
      // this.datacell(cell)
      this.datactx.save();
      this.datactx.fillStyle = "white";
      this.datactx.strokestyle = "black";
      this.datactx.rect(cell.xpos-0.5-this.scrollX, cell.ypos - this.scrollY-0.5, cell.width+1, cell.height+1);
      this.datactx.clip();

      this.datactx.fillStyle = "black";
      this.datactx.font = `${18}px areal`;
      this.datactx.fillText(nvalue, cell.xpos + 2-this.scrollX, cell.ypos + cell.height - 5 - this.scrollY);
      this.datactx.restore();
      this.datactx.stroke();

      this.f = false;

      this.element.removeEventListener("blur", this.x);
    }
  }

  line() {
    //  this.headersctx.clearRect( this.acti.xpos -this.scrollX, 0,
      
    //   this.acti.width,
    //   this.acti.height);
    this.headersctx.beginPath();

    // Set a start-point
    this.headersctx.strokeStyle = "green";
    this.headersctx.lineWidth = 6;
    this.headersctx.moveTo(this.acti.xpos -this.scrollX, 30);

    // Set an end-point
    this.headersctx.lineTo(this.acti.xpos + this.acti.width -this.scrollX, 30);



      
    this.headersctx.fillStyle = "#e7f1ec11";
    // // this.headersctx.strokestyle = "black";
    // // console.log(data.data);
    // // this.ctx.fillRect(data.x, data.y,data.sizel,data.sizeb);  //arr[j]
    this.headersctx.fill();

    // Draw it
    this.headersctx.stroke();
    this.headersctx.restore();







    this.leftctx.beginPath()
    this.leftctx.strokeStyle = "green";
    this.leftctx.lineWidth = 6;
    this.leftctx.moveTo(0+50, this.acti.ypos-this.scrollY);

    // Set an end-point
    this.leftctx.lineTo(0+50,this.acti.ypos+30 -this.scrollY);



   

    // Draw it
    this.leftctx.stroke();
    this.leftctx.restore();


  }

  click(e, data) {
 

    if (this.acti ) {
      // console.log("acti" + this.acti.data);
      // this.selectedfinal=[]
      this.datactx.clearRect(
        this.acti.xpos-this.scrollX,
        this.acti.ypos - this.scrollY,
        this.acti.width,
        this.acti.height
      );
      this.datacell(this.acti);

      // this.headersctx.clearRect(this.acti.xpos+50,0,this.acti.width, this.acti.height);
      this.headersctx.clearRect(0, 0, this.headers.width, 30);

    
      this.headerdraw1()
      this.leftctx.clearRect(0,0,50,this.leftheaders.height)
      
      this.sidedraw1()
    this.cellintial = null
    this.finalcell = null
      // this.selectedfinal=[]
      // // this.topgrid(this.acti)
      // this.topg(this.acti)
    }

   
    var [r, c] = this.position(data, e);
    // this.cell = this.data[r][c]
    this.r = r;
    this.c = c;
    // console.log(this.scrollY)
    // console.log("row" + r, c);

    // console.log(this.arr2d[c][r - 1].xpos, this.arr2d[c][r - 1].ypos);
    this.cell = this.arr2d[c][r - 1];
    this.acti = this.arr2d[c][r - 1];

    //  this.arr2d[c][r-1]= this.arr2d[c][r-1];
    // return {row:r,col:c};
    // past value

    // this.datacell(this.acti)

    this.datactx.clearRect(
      this.acti.xpos-this.scrollX,
      this.acti.ypos - this.scrollY,
      this.acti.width,
      this.acti.height
    );
    this.datactx.save();

    this.datactx.beginPath();
    this.datactx.fillStyle = "white";
    this.datactx.strokeStyle = "#107c41";
    this.datactx.lineWidth = 2;

    this.datactx.rect(
      this.acti.xpos-this.scrollX,
      this.acti.ypos - this.scrollY,
      this.acti.width,
      this.acti.height
    );
    this.datactx.strokeRect(
      this.acti.xpos-this.scrollX,
      this.acti.ypos - this.scrollY,
      this.acti.width,
      this.acti.height
    );

    this.datactx.clip();

    console.log(this.cell.data);
    this.datactx.fillStyle = "black";
    this.datactx.font = `${18}px areal`;
    this.datactx.fillText(
      this.acti.data,
      this.acti.xpos + 2-this.scrollX,
      this.acti.ypos + this.acti.height - 5 - this.scrollY
    );

    this.datactx.restore();

  this.line()
    this.element.style.display = "none";
  }
 

  selected(data) {
    this.datactx.clearRect(data.xpos-this.scrollX, data.ypos - this.scrollY, data.width, data.height);
    this.datactx.save();

    this.datactx.beginPath();
    this.datactx.fillStyle = "white";
    this.datactx.strokeStyle = "#107c41";
    this.datactx.lineWidth = 2;

    this.datactx.rect(data.xpos-this.scrollX, data.ypos - this.scrollY, data.width, data.height);
    this.datactx.strokeRect(data.xpos-this.scrollX, data.ypos - this.scrollY, data.width, data.height);

    this.datactx.clip();

    this.datactx.fillStyle = "black";
    this.datactx.font = `${20}px areal`;
    this.datactx.fillText(
      data.data,
      data.xpos + 2-this.scrollX,
      data.ypos + data.height - 5 - this.scrollY
    );

    this.datactx.restore();
  }

  keyfunc(e, data) {
    if(this.acti!=null){
    this.datactx.clearRect(
      this.acti.xpos-this.scrollX,
      this.acti.ypos - this.scrollY,
      this.acti.width,
      this.acti.height
    );
    this.datacell(this.acti);

    //made changes
    this.headersctx.clearRect(0, 0, 2100, 30);

    this.headerdraw1();
    this.leftctx.clearRect(0,0,50,this.leftheaders.height)
      
    this.sidedraw1()

    let { row, col } = this.acti;
    // console.log(row,col)
    // console.log(e.keyCode);
    switch (e.keyCode) {
      case 37:
        if (col > 0) {
          this.acti = this.arr2d[row][col - 1];
          // console.log( this.acti.data)
          this.line();
          this.selected(this.acti);
        }
        break;
      case 38:
        // alert('up')

        if (row > 1) {
          this.acti = this.arr2d[row - 1][col];
          // console.log( this.acti.data)
          this.line();
          this.selected(this.acti);
        }

        break;
      case 39:
        // alert('right')
        this.acti = this.arr2d[row][col + 1];
        // console.log( this.acti.data)
        this.line();
        this.selected(this.acti);

        break;
      case 40:
        // alert('down')
        this.acti = this.arr2d[row + 1][col];
        // console.log( this.acti.data)
        this.line();
        this.selected(this.acti);

        break;

    
      // case 8:
      //   // console.log('backspace')
      //   // this.acti = this.arr2d[row][col]
      //   // console.log( this.acti.data)
      //   this.acti.data = "";
      //   this.inputtext(e, this.acti, this.datactx);

      //   break;

      case 9:
        this.acti = this.arr2d[row][col + 1];
        // console.log( this.acti.data)

        this.selected(this.acti);
        break;

      // case e.shiftKey && 13:
      //   if (row > 1) {
      //     this.acti = this.arr2d[row - 1][col];
      //     // console.log( this.acti.data)

      //     this.selected(this.acti);
      //   }
      //   break;

      case 13:
        this.acti = this.arr2d[row + 1][col];
        // console.log( this.acti.data)

        this.selected(this.acti);

        break;

      case e.ctrlKey && 66:
        break;
      default:
        break;
    }

  }
  }

  border(startr, startc, endr2, endc2) {
   

    // this.datactx.beginPath();

    // // Set a start-point
    // this.datactx.strokeStyle = "green";
    // // this.datactx.setLineDash([5, 5]); // Define the dash pattern
    // // this.datactx.lineDashOffset = -this.offset;
    // this.datactx.lineWidth = 2;
    // this.datactx.moveTo(this.selectedfinal[0].xpos, this.selectedfinal[0].ypos - this.scrollY); // start

    // // Set an end-point

    // this.datactx.lineTo(
    //   this.selectedfinal[0].xpos,
    //   this.selectedfinal[this.selectedfinal.length - 1].ypos  - this.scrollY+
    //     this.selectedfinal[this.selectedfinal.length - 1].height
    // ); // straight line first

    // this.datactx.moveTo(this.selectedfinal[0].xpos, this.selectedfinal[0].ypos - this.scrollY);
    // this.datactx.lineTo(
    //   this.selectedfinal[this.selectedfinal.length - 1].xpos +
    //     this.selectedfinal[this.selectedfinal.length - 1].width,
    //   this.selectedfinal[0].ypos - this.scrollY
    // );

    // this.datactx.moveTo(
    //   this.selectedfinal[this.selectedfinal.length - 1].xpos +
    //     this.selectedfinal[this.selectedfinal.length - 1].width,
    //   this.selectedfinal[0].ypos - this.scrollY
    // );
    // this.datactx.lineTo(
    //   this.selectedfinal[this.selectedfinal.length - 1].xpos +
    //     this.selectedfinal[this.selectedfinal.length - 1].width,
    //   this.selectedfinal[this.selectedfinal.length - 1].ypos - this.scrollY +
    //     this.selectedfinal[this.selectedfinal.length - 1].height
    // );

    // this.datactx.moveTo(
    //   this.selectedfinal[this.selectedfinal.length - 1].xpos +
    //     this.selectedfinal[this.selectedfinal.length - 1].width,
    //   this.selectedfinal[this.selectedfinal.length - 1].ypos - this.scrollY +
    //     this.selectedfinal[this.selectedfinal.length - 1].height
    // );
    // this.datactx.lineTo(
    //   this.selectedfinal[0].xpos,
    //   this.selectedfinal[this.selectedfinal.length - 1].ypos - this.scrollY +
    //     this.selectedfinal[this.selectedfinal.length - 1].height
    // );

    // // Draw it
    // this.datactx.stroke();
    // this.datactx.restore();
    // this.datactx.closePath();
  }

linedraw(){

// console.log(this.selectedfinal.length)
// console.log("thissss"+this.mini,this.maxi,this.minj,this.maxj )

   this.cellintial = this.arr2d[this.minj][this.mini]
   this.finalcell = this.arr2d[this.maxj][this.maxi]
   console.log(this.cellintial)
   console.log(this.finalcell)
      

this.headersctx.beginPath();

    // Set a start-point
    this.headersctx.strokeStyle = "green";
    this.headersctx.lineWidth = 6;
    this.headersctx.moveTo(this.cellintial.xpos -this.scrollX, 30);

    // Set an end-point
    this.headersctx.lineTo(this.finalcell.xpos + this.finalcell.width -this.scrollX, 30);

    // this.leftctx.moveTo(0, this.cellintial.ypos-this.scrollY);

    // // Set an end-point
    // this.leftctx.lineTo(0,this.finalcell.ypos+30 -this.scrollY);

   

    // Draw it
    this.headersctx.stroke();
    this.headersctx.restore();


    // this.leftctx.beginPath()
    // this.leftctx.strokeStyle = "green";
    // this.leftctx.lineWidth = 6;
    // this.leftctx.moveTo(50, this.cellintial.ypos-this.scrollY);

    // // Set an end-point
    // this.leftctx.lineTo(50,this.finalcell.ypos+30 -this.scrollY);

    // this.leftctx.stroke();
    // this.leftctx.restore();

}
  move(e, data, cell) {
    let [prevstartr, prevstartc] = [this.startr, this.startc];
    this.prevstartr = prevstartr;
    this.prevstartc = prevstartc;
    let [endr2, endc2] = this.position(this.data, e);
    this.endr2 = endr2 - 1;
    this.endc2 = endc2;

    // console.log("start1 " + this.startr, this.startc); // 7 1 1 4
    // console.log("end1 " + this.endr2, this.endc2); // 7 8 0 2

    // this.selectedfinal =[]

    let maxi = Math.max(this.startr, this.endr2);
    let mini = Math.min(this.startr, this.endr2);

    let maxj = Math.max(this.startc, this.endc2);
    let minj = Math.min(this.startc, this.endc2);
    this.arr_selec = [];

    this.maxi = maxi;
this.mini = mini
this.maxj = maxj
this.minj = minj
    // this.final = this.arr2d[this.endc2][this.endr2]
    // console.log("this=="+this.final)

    for (let i = mini; i <= maxi; i++) {
      for (let j = minj; j <= maxj; j++) {
        // let sizel = this.sizel[i];
        this.final = this.arr2d[j][i];
        this.arr_selec.push(this.final);
     
        


        this.datactx.save();
        this.datactx.beginPath();
        this.datactx.fillStyle = "#e7f1ec";
        this.datactx.strokestyle = "black";
        this.datactx.lineWidth = 2
        this.datactx.rect(  this.arr2d[j][i].xpos-0.5-this.scrollX,
          this.arr2d[j][i].ypos - this.scrollY-0.5,
          this.arr2d[j][i].width+1,
          this.arr2d[j][i].height+1);
        this.datactx.clip();
    
    
        this.datactx.fillRect(  this.arr2d[j][i].xpos-0.5-this.scrollX,
          this.arr2d[j][i].ypos - this.scrollY-0.5,
          this.arr2d[j][i].width+1,
          this.arr2d[j][i].height+1);
    
        this.datactx.fillStyle = "black";
        this.datactx.font = `${18}px areal`;
        this.datactx.fillText(
          this.arr2d[j][i].data,
          this.arr2d[j][i].xpos + 2-this.scrollX,
          this.arr2d[j + 1][i].ypos - 5 - this.scrollY
        );
    
        this.datactx.stroke();
        this.datactx.restore();

      







     
        this.flag = true;
      }
   
    }
    // this.linedraw()
    // console.log("arrselected" + this.arr_selec);
    // console.log("finalselected" + this.selectedfinal);
    this.diff = this.selectedfinal.filter(
      (c) => this.arr_selec.indexOf(c) === -1
    );
    console.log(this.diff);
    this.diff.forEach((c) => this.clearcell(c));
    this.diff.forEach((c) => this.datacell(c));

    this.selectedfinal = this.arr_selec;
  }

  clearcell(c) {
    this.datactx.clearRect(c.xpos-this.scrollX, c.ypos - this.scrollY, c.width, c.height);
  }

  mouseup(e, data, cell) {
    let [endr1, endc1] = this.position(this.data, e);
    this.endr1 = endr1 - 1;
    this.endc1 = endc1;
    // console.log("end1 " + this.endr1, this.endc1); // 7 8
    // console.log("start1 " + this.startr, this.startc); // 7 1 1 4
    // console.log("end1 " + this.endr1, this.endc1); // 7 8 0 2

    // this.border(this.startr,this.startc,this.endr1, this.endc1)

    // console.log(this.arr2d[this.endc1][this.endr1].data);

  
    let maxi = Math.max(this.startr, this.endr1);
    let mini = Math.min(this.startr, this.endr1);

    let maxj = Math.max(this.startc, this.endc1);
    let minj = Math.min(this.startc, this.endc1);

   

    let sum1 = 0;
    let counter = 0;
    let arr = [];

    let multi = 1;
    for (let i = mini; i <= maxi; i++) {
      for (let j = minj; j <= maxj; j++) {
        sum1 += parseInt(this.arr2d[j][i].data);
        multi *= parseInt(this.arr2d[j][i].data);
        arr.push(parseInt(this.arr2d[j][i].data));
        counter++;
        // console.log(this.arr2d[j][i].data);
        // sum += j;
      }
    }

    var mean = sum1 / counter;
   

    let multi1 = document.getElementById("multi")
    let sum = document.getElementById("sum")
    let min = document.getElementById("min")
    let max = document.getElementById("max")
    let mean1 = document.getElementById("mean")

  if(isNaN(multi) ){
    multi1.innerHTML="Please select only numerical value";
    sum.innerHTML="Please select only numerical value";
    max.innerHTML="Please select only numerical value";

    min.innerHTML="Please select only numerical value"
    mean1.innerHTML="Please select only numerical value";
  }else{
    multi1.innerHTML=multi;
    sum.innerHTML=sum1;
    max.innerHTML=Math.max(...arr);

    min.innerHTML=Math.min(...arr);
    mean1.innerHTML=mean;
  }

  

 

    sum1 = 0;
    counter = 0;
    arr = [];
    multi = 1;

   
    data.removeEventListener("mousemove", this.mo);
    data.removeEventListener("mouseup", this.up);
  }

  mousedown1(e, data, cell) {
    let length = this.sizel.length;
    // console.log(length);
    // this.cell = cell;

    let [startr, startc] = this.position(this.data, e);
    this.startr = startr - 1;
    this.startc = startc;

    // console.log("start3 " + this.startr, this.startc); // 7 1

    this.mo = (e) => this.move(e, data, this.cell);
    data.addEventListener("mousemove", this.mo);

    this.up = (e) => this.mouseup(e, data, this.cell);
    data.addEventListener("mouseup", this.up);

    // console.log("start21 " + this.prevstartr, this.prevstartc); // 7 1 1 4
    // console.log("end21 " + this.endr1, this.endc1); // 7 8 0 2

    let maxi = Math.max(this.prevstartr, this.endr2);
    let mini = Math.min(this.prevstartr, this.endr2);

    let maxj = Math.max(this.prevstartc, this.endc2);
    let minj = Math.min(this.prevstartc, this.endc2);





    for (let i = mini; i <= maxi; i++) {
      for (let j = minj; j <= maxj; j++) {
      




        this.datactx.save();
        this.datactx.beginPath();
         this.datactx.fillStyle = "white";
        this.datactx.strokeStyle = "black"
        this.datactx.lineWidth = 2
        this.datactx.rect(  this.arr2d[j][i].xpos-0.5-this.scrollX,
          this.arr2d[j][i].ypos - this.scrollY-0.5,
          this.arr2d[j][i].width+1,
          this.arr2d[j][i].height+1);
        this.datactx.clip();
    
    
        this.datactx.fillRect(  this.arr2d[j][i].xpos-0.5-this.scrollX,
          this.arr2d[j][i].ypos - this.scrollY-0.5,
          this.arr2d[j][i].width+1,
          this.arr2d[j][i].height+1);
    
        this.datactx.fillStyle = "black";
        this.datactx.font = `${18}px areal`;
        this.datactx.fillText(
          this.arr2d[j][i].data,
          this.arr2d[j][i].xpos + 2-this.scrollX,
          this.arr2d[j + 1][i].ypos - 5 - this.scrollY
        );
    
        this.datactx.stroke();
        this.datactx.restore();






        this.flag = true;
    

      }
    }
    // this.linedraw()
    // this.csvToJson()
    this.graph1()
   
  }
dynamicwidth(){

  let counter = 0;
   
    for (let i = 0; i < this.arr2d.length; i++) {
      counter = 0;
      for (let j = 0; j < this.arr2d[0].length; j++) {
        let rectData =this.arr2d[i][j];
        rectData.xpos = counter;
        rectData.width = this.sizel[j];
        counter += this.sizel[j];
      }
    }
    counter=0
    for (let j = 0; j < this.alpha.length; j++) {
      let rectDatahead = this.alpha[j];
      rectDatahead.xpos = counter;
      rectDatahead.width = this.sizel[j];
      counter += this.sizel[j];
    }


}

// infidown(){

// console.log("hello")

// }



  resize(e) {
    let rect = this.headers.getBoundingClientRect();
    let x = e.clientX - rect.left+this.scrollX;
    let sum = 0;
    for (let i = 0; i < this.sizel.length; i++) {
      // const   = this.sizel[i];

      if (sum + 4 > x && x > sum && x > 56) {
        this.headers.style.cursor = "col-resize";

        this.headers.addEventListener("mousedown", (e) =>
          this.redown(e, this.headers)
        );

        break;
      } else {
        this.headers.style.cursor = "default";
        // this.headers.addEventListener("mousedown", (e) =>
        //   this.infidown(e, this.headers))
        // break
      }
      sum += this.sizel[i];
    }
  }

  redown(e, headers) {
    this.selectedfinal = [];
    let addition = 0;
    // console.log(this.acti);
    if (this.acti) {
      this.datactx.clearRect(
        this.acti.xpos-this.scrollX,
        this.acti.ypos - this.scrollY,
        this.acti.width,
        this.acti.height
      );
      this.datacell(this.acti);
      this.acti = null;
    }
    // this.element.style.display="none";
    let [x7, y1, total] = this.position(this.headers, e);
    // console.log(x7, y1, total);

    this.prev_width = this.sizel[x7 - 2];

    // console.log("This is the width= " + this.prev_width);

    var resize_mousemove = (e) => {
      let rect = headers.getBoundingClientRect();
      let x2 = e.clientX - rect.left +this.scrollX;;

      addition = x2 - total;
      console.log(addition);
    };
    var resize_mouseup = (e) => {
      if (this.prev_width + addition > 50) {
        this.sizel[x7 - 2] = this.prev_width + addition;
        // console.log(this.sizel);
        headers.removeEventListener("mousemove", resize_mousemove);
        // this.headerdraw1();///
        // this.csvToJson();
        this.dynamicwidth()
        this.drawOptimized()
        headers.removeEventListener("mouseup", resize_mouseup);
      }
    };
    headers.addEventListener("mousemove", resize_mousemove);
    headers.addEventListener("mouseup", resize_mouseup);
  }

  replaceitem(){
    var boolea = false;
    let replaceterm = document.getElementById('replaceinput').value.toLowerCase();
    let replaceser = document.getElementById('replaceinput1').value.toLowerCase();
    // console.log(replaceterm) 
    // console.log() 
    // this.arr2d[1][1].data = replaceterm
    // this.drawOptimized()
    for (let i = 0; i < this.arr2d.length; i++) {
      for (let j = 0; j < this.arr2d[i].length; j++) {
       
          let element = this.arr2d[i][j].data.toLowerCase();
         
          if (element==replaceser) {
              this.arr2d[i][j].data = replaceterm
              this.drawOptimized()
              boolea = true;
          }
      }
  }
  if(boolea==false){
    alert("data not found")
  }

  }
 search2DArray() {

    let searchTerm = document.getElementById('searchInput').value.toLowerCase();
   
// console.log(searchTerm)
 
    let results = [];

  
    for (let i = 0; i < this.arr2d.length; i++) {
        for (let j = 0; j < this.arr2d[i].length; j++) {
         
            let element = this.arr2d[i][j].data.toLowerCase();
           
            if (element.includes(searchTerm)) {
             
                results.push(this.arr2d[i][j].data);
               

            }
        }
    }
// console.log(results)
    
    this.displayResults(results);
}

displayResults(results) {
  let resultsDiv = document.getElementById('results');






  resultsDiv.innerHTML = '';

  if (results.length > 0) {
      let resultHtml ='<span>count </span>'+ results.length +'<span> Search results:</span>';
      resultHtml += '<ul>';
      results.forEach(result => {
          resultHtml += `<li>${result}</li>`;
      });
      resultHtml += '</ul>';
      resultsDiv.innerHTML = resultHtml;
  } else {
      resultsDiv.innerHTML = '<p>No results found.</p>';
  }
}

}
