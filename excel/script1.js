class excel {
  constructor(csv, wraper) {
    this.wraper = wraper;
    this.csv = csv;
    this.init();
    // this.topgrid();
    this.csvToJson();
    // this.init();
    this.f = false;
    this.headerdraw();
    this.sidedraw();
    this.extend();
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
    this.scrollY = 0;
    this.cellheight = 30;
    this.scrollX = 0;
    var draw;
    this.draw = draw;

    // this.offset = 0;
    // this.animate = this.animate.bind(this); // Ensure `this` context is bound
    // requestAnimationFrame(this.animate); // Start the animation
    // this.startAnimation()
  }

  init() {
    this.sizel = [
      100, 100, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150,
      150, 150, 150,
    ];

    let headers = this.canvas(2100, 30, "white");
    headers.classList.add("headers");

    let graph = this.canvas(200, 200, "white");

    graph.classList.add("graph");
    // graph.id.add("mychart")
    graph.setAttribute("id", "myChart");
    this.graphctx = graph.getContext("2d");
    // this.graph = graph

    this.headers = headers;
    let leftheaders = this.canvas(50, 2000, "white");
    let data = this.canvas(2000, 2000, "white");
    data.classList.add("data");
    this.data = data;
    this.headersctx = headers.getContext("2d");
    this.leftctx = leftheaders.getContext("2d");
    this.datactx = data.getContext("2d");
    this.wraper.appendChild(headers);

    let div = document.createElement("div");
    this.div = div;
    this.div.classList.add("subwrapper");

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

    this.data.addEventListener("click", (e) => this.click(e, this.data));

    this.data.addEventListener("dblclick", (e) => this.dblclick(e, this.data));

    window.addEventListener("keydown", (e) => this.keyfunc(e, this.data));

    this.down = (e) => this.mousedown1(e, this.data, this.cell);
    this.data.addEventListener("mousedown", this.down);

    document.addEventListener("DOMContentLoaded", (e) =>
      this.draggraph(e, draggablediv, closebtnv)
    );

    this.headers.addEventListener("mousemove", (e) =>
      this.resize(e, this.headers)
    );

    this.data.addEventListener("wheel", (e) => this.scroller(e));

    let stylesheet = document.createElement("style");
    stylesheet.textContent = `
       .headers{
       position: sticky;
         top: 0;
         z-index: 1;
       }
       .wraper{
        height:600px;
        width:100vw;
       overflow-y :scroll;
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

      
  
        
        `;
    document.head.appendChild(stylesheet);
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
    // const ctx = document.getElementById('myChart');
    // console.log("added"+this.graphctx)
    // this.graph = graph

    // selected arr

    // console.log("graph"+this.selectedfinal[0].row,this.selectedfinal[0].col)

    // console.log("graph"+this.selectedfinal[this.selectedfinal.length-1].data)

    let startcor = this.selectedfinal[0].row;
    let startcoc = this.selectedfinal[0].col; //0

    let endcor = this.selectedfinal[this.selectedfinal.length - 1].row;
    let endcoc = this.selectedfinal[this.selectedfinal.length - 1].col; //0

    // console.log("latest"+startcoc,startcor,endcoc,endcor)

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
      type: "bar",
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

  extend(count,axis) {
    console.log(this.arr2d[this.arr2d.length - 1][0].data);
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
  }
    // console.log(this.arr2d.length);
    // let lastarr = this.arr2d[this.arr2d.length-1]
    // console.log(lastarr)
  }
  scroller(event) {
    // console.log("22")
    let { deltaX, deltaY } = event;
    this.scrollX = Math.max(0, this.scrollX + deltaX);
    this.scrollY = Math.max(0, this.scrollY + deltaY);
    this.drawOptimized();
  }

  drawOptimized() {
    // console.log("22")

    this.datactx?.clearRect(0, 0, this.data.width, this.data.height);
    let canvaWidth = this.data.offsetWidth;
    let canvaHeight = this.data.offsetHeight;

    let initHeight = 0;
    let newScrollY = (this.scrollY * this.cellheight) / 100;
    console.log("🚀 ~ Excel ~ drawOptimized ~ newScrollY:", newScrollY);
    let newScrollX = this.scrollX;
    this.datactx?.translate(-newScrollX, -newScrollY);

    for (let i = newScrollY / this.cellheight; i < this.arr2d.length; i++) {
      const row = this.arr2d[i];
      if (initHeight > canvaHeight + newScrollY) {
        break;
      } else {
        let initWidth = 0;
        initHeight += row[0].height;

        // this.drawCell(row[0])
        for (let j = 0; j < row.length; j++) {
          const col = row[j];
          if(i == row.length-1){
            this.extend(10,"y")
          }
          if (initWidth >= newScrollX && initWidth <= canvaWidth) {
            // this.drawcell(col)
            this.datacell(col);
          }
          if (initWidth > canvaWidth) break;
        }
        // if (initHeight >= newScrollY && initHeight <= canvaHeight) {
        // }
        // if (initHeight > canvaHeight + newScrollY) break
      }
    }
    this.datactx?.setTransform(1, 0, 0, 1, 0, 0);
  }

  canvas(width, height, color) {
    let canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
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
        // if(i>=lines.length){
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
        // }

        // else{

        // rectData["xpos"] =counter;
        // rectData["ypos"] = i * 30;
        // rectData["width"] = this.sizel[j];
        // rectData["height"] = 30;
        // rectData["color"] = "black";
        // rectData["row"] = i
        // rectData["col"] = j
        // rectData["data"] = lines[i].split(",")[j];
        // data1d.push(rectData);
        // this.datacell(rectData);
        // counter +=this.sizel[j];
        // }
      }
      this.arr2d.push(data1d);
    }
    console.log(this.arr2d);

    this.active = this.arr2d[0][0];
  }

  datacell(data) {
    // if(!data) return;

    this.datactx.save();
    this.datactx.beginPath();
    this.datactx.fillStyle = "white";
    this.datactx.strokestyle = "black";
    this.datactx.rect(data.xpos, data.ypos, data.width, data.height);
    this.datactx.clip();

    this.datactx.fillStyle = "black";
    this.datactx.font = `${18}px areal`;
    this.datactx.fillText(
      data.data,
      data.xpos + 2,
      data.ypos + data.height - 5
    );

    this.datactx.stroke();
    this.datactx.restore();
  }

  headerdraw() {
    this.headersctx.clearRect(0, 0, 2100, 30);
    let alpha = [
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "k",
      "l",
      "h",
      "i",
      "k",
    ];
    let c = 0;
    for (let i = 0; i < alpha.length; i++) {
      let rectData = {};
      if (c == 0) {
        rectData["xpos"] = c;
        rectData["ypos"] = 0;
        rectData["width"] = 50;
        rectData["height"] = 30;
        rectData["color"] = "black";
        rectData["data"] = "\u25BC";
        this.boole = true;
        this.topgrid(rectData);
      }
      rectData["xpos"] = c + 50;
      rectData["ypos"] = 0;
      rectData["width"] = this.sizel[i];
      rectData["height"] = 30;
      rectData["color"] = "black";
      rectData["data"] = alpha[i];

      this.topgrid(rectData);
      c += this.sizel[i];
    }
  }

  topgrid(alpha) {
    if (this.boole == true) {
      console.log("true");
      this.headersctx.beginPath();
      this.headersctx.save();
      this.headersctx.fillStyle = "white";
      // this.headersctx.strokestyle = alpha.color;
      // console.log(data.data);
      // this.ctx.fillRect(data.x, data.y,data.sizel,data.sizeb);  //arr[j]
      // this.headersctx.fillRect( alpha.xpos, alpha.ypos, alpha.width, alpha.height);
      // this.headersctx.strokeRect( alpha.xpos, alpha.ypos, alpha.width, alpha.height); //arr[j]
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
        alpha.xpos,
        alpha.ypos,
        alpha.width,
        alpha.height
      );
      this.headersctx.strokeRect(
        alpha.xpos,
        alpha.ypos,
        alpha.width,
        alpha.height
      ); //arr[j]
      this.headersctx.fillStyle = "black";
      this.headersctx.font = `${18}px areal`;
      this.headersctx.fillText(
        alpha.data,
        alpha.xpos + 30,
        alpha.ypos + alpha.height - 5
      );
      this.headersctx.stroke();
    }
  }

  sidedraw() {
    let nos = [
      "1",
      "2",
      "3",
      "4",
      "2",
      "3",
      "4",
      "2",
      "3",
      "4",
      "2",
      "3",
      "4",
      "2",
      "3",
      "4",
      "2",
      "3",
      "4",
      "2",
      "3",
      "4",
      "2",
      "3",
      "4",
      "2",
      "3",
      "4",
    ];

    for (let i = 0; i < nos.length; i++) {
      let rectData = {};
      rectData["xpos"] = 0;
      rectData["ypos"] = i * 30;
      rectData["width"] = 50;
      rectData["height"] = 30;
      rectData["color"] = "black";
      rectData["data"] = nos[i];

      this.sidebar(rectData);
    }
  }

  sidebar(alpha) {
    this.leftctx.fillStyle = "grey";
    this.leftctx.strokestyle = alpha.color;

    this.leftctx.fillRect(alpha.xpos, alpha.ypos, alpha.width, alpha.height);
    this.leftctx.strokeRect(alpha.xpos, alpha.ypos, alpha.width, alpha.height); //arr[j]
    this.leftctx.fillStyle = "black";
    this.leftctx.font = `${18}px areal`;
    this.leftctx.fillText(
      alpha.data,
      alpha.xpos + 10,
      alpha.ypos + alpha.height - 5
    );

    this.leftctx.stroke();
  }

  position(data, event) {
    let rect = this.data.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;

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
    console.log(this.sizel.length);

    return [r, c, sum - this.sizel[r - 1]];
  }

  dblclick(e, data) {
    console.log(this.cell);
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
    this.element.style.left = `${cell.xpos + 50}px`;
    this.element.style.top = `${cell.ypos}px`;

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

      this.datactx.clearRect(cell.xpos, cell.ypos, cell.width, cell.height);
      // this.datacell(cell)
      this.datactx.save();
      this.datactx.fillStyle = "white";
      this.datactx.strokestyle = "black";
      this.datactx.rect(cell.xpos, cell.ypos, cell.width, cell.height);
      this.datactx.clip();

      this.datactx.fillStyle = "black";
      this.datactx.font = `${18}px areal`;
      this.datactx.fillText(nvalue, cell.xpos + 2, cell.ypos + cell.height - 5);
      this.datactx.restore();
      this.datactx.stroke();

      this.f = false;

      this.element.removeEventListener("blur", this.x);
    }
  }

  line() {
    this.headersctx.beginPath();

    // Set a start-point
    this.headersctx.strokeStyle = "green";
    this.headersctx.lineWidth = 6;
    this.headersctx.moveTo(this.acti.xpos + 50, 30);

    // Set an end-point
    this.headersctx.lineTo(this.acti.xpos + this.acti.width + 50, 30);

    // Draw it
    this.headersctx.stroke();
    this.headersctx.restore();
  }
  click(e, data) {
    if (this.acti) {
      console.log("acti" + this.acti.data);
      this.datactx.clearRect(
        this.acti.xpos,
        this.acti.ypos,
        this.acti.width,
        this.acti.height
      );
      this.datacell(this.acti);

      // this.headersctx.clearRect(this.acti.xpos+50,0,this.acti.width, this.acti.height);
      this.headersctx.clearRect(0, 0, 2100, 30);

      this.headerdraw();
      // // this.topgrid(this.acti)
      // this.topg(this.acti)
    }

    // if(this.selectedfinal.length>0){
    //   // this.selectedfinal=null

    // }
    var [r, c] = this.position(data, e);
    // this.cell = this.data[r][c]
    this.r = r;
    this.c = c;
    console.log("row" + r, c);

    console.log(this.arr2d[c][r - 1].xpos, this.arr2d[c][r - 1].ypos);
    this.cell = this.arr2d[c][r - 1];
    this.acti = this.arr2d[c][r - 1];

    //  this.arr2d[c][r-1]= this.arr2d[c][r-1];
    // return {row:r,col:c};
    // past value

    // this.datacell(this.acti)

    this.datactx.clearRect(
      this.acti.xpos,
      this.acti.ypos,
      this.acti.width,
      this.acti.height
    );
    this.datactx.save();

    this.datactx.beginPath();
    this.datactx.fillStyle = "white";
    this.datactx.strokeStyle = "green";
    this.datactx.lineWidth = 2;

    this.datactx.rect(
      this.acti.xpos,
      this.acti.ypos,
      this.acti.width,
      this.acti.height
    );
    this.datactx.strokeRect(
      this.acti.xpos,
      this.acti.ypos,
      this.acti.width,
      this.acti.height
    );

    this.datactx.clip();

    console.log(this.cell.data);
    this.datactx.fillStyle = "black";
    this.datactx.font = `${18}px areal`;
    this.datactx.fillText(
      this.acti.data,
      this.acti.xpos + 2,
      this.acti.ypos + this.acti.height - 5
    );

    this.datactx.restore();

    this.line();

    this.element.style.display = "none";
  }
  delete(data) {
    this.datactx.clearRect(data.xpos, data.ypos, data.width, data.height);
    this.datactx.save();

    this.datactx.beginPath();
    this.datactx.fillStyle = "white";
    this.datactx.strokeStyle = "black";
    this.datactx.lineWidth = 2;

    this.datactx.rect(data.xpos, data.ypos, data.width, data.height);
    this.datactx.strokeRect(data.xpos, data.ypos, data.width, data.height);

    this.datactx.clip();

    this.datactx.fillStyle = "black";
    this.datactx.font = `${20}px areal`;
    this.datactx.fillText("", data.xpos + 2, data.ypos + data.height - 5);

    this.datactx.restore();
  }

  selected(data) {
    this.datactx.clearRect(data.xpos, data.ypos, data.width, data.height);
    this.datactx.save();

    this.datactx.beginPath();
    this.datactx.fillStyle = "white";
    this.datactx.strokeStyle = "green";
    this.datactx.lineWidth = 2;

    this.datactx.rect(data.xpos, data.ypos, data.width, data.height);
    this.datactx.strokeRect(data.xpos, data.ypos, data.width, data.height);

    this.datactx.clip();

    this.datactx.fillStyle = "black";
    this.datactx.font = `${20}px areal`;
    this.datactx.fillText(
      data.data,
      data.xpos + 2,
      data.ypos + data.height - 5
    );

    this.datactx.restore();
  }

  keyfunc(e, data) {
    this.datactx.clearRect(
      this.acti.xpos,
      this.acti.ypos,
      this.acti.width,
      this.acti.height
    );
    this.datacell(this.acti);

    //made changes
    this.headersctx.clearRect(0, 0, 2100, 30);

    this.headerdraw();

    let { row, col } = this.acti;
    // console.log(row,col)
    console.log(e.keyCode);
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

      case 46:
        // alert('delete ')
        // this.acti = this.arr2d[row][col]
        // console.log( this.acti.data)

        this.delete(this.arr2d[row][col]);
        break;
      case 8:
        // console.log('backspace')
        // this.acti = this.arr2d[row][col]
        // console.log( this.acti.data)
        this.acti.data = "";
        this.inputtext(e, this.acti, this.datactx);

        break;

      case 9:
        this.acti = this.arr2d[row][col + 1];
        // console.log( this.acti.data)

        this.selected(this.acti);
        break;

      case e.shiftKey && 13:
        if (row > 1) {
          this.acti = this.arr2d[row - 1][col];
          // console.log( this.acti.data)

          this.selected(this.acti);
        }
        break;

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

  border(startr, startc, endr2, endc2) {
    // this.datactx.clearRect(0,0,this.data.width,this.data.height);
    // this.csvToJson()
    console.log("starter" + startr, startc, endr2, endc2);
    console.log(this.arr2d[startc][startr].data);
    console.log(this.arr2d[endc2][endr2].data);
    console.log(this.selectedfinal[1]);
    console.log(this.selectedfinal[this.selectedfinal.length - 1]);
    // this.offset = offset

    this.datactx.beginPath();

    // Set a start-point
    this.datactx.strokeStyle = "green";
    // this.datactx.setLineDash([5, 5]); // Define the dash pattern
    // this.datactx.lineDashOffset = -this.offset;
    this.datactx.lineWidth = 4;
    this.datactx.moveTo(this.selectedfinal[0].xpos, this.selectedfinal[0].ypos); // start

    // Set an end-point

    this.datactx.lineTo(
      this.selectedfinal[0].xpos,
      this.selectedfinal[this.selectedfinal.length - 1].ypos +
        this.selectedfinal[this.selectedfinal.length - 1].height
    ); // straight line first

    this.datactx.moveTo(this.selectedfinal[0].xpos, this.selectedfinal[0].ypos);
    this.datactx.lineTo(
      this.selectedfinal[this.selectedfinal.length - 1].xpos +
        this.selectedfinal[this.selectedfinal.length - 1].width,
      this.selectedfinal[0].ypos
    );

    this.datactx.moveTo(
      this.selectedfinal[this.selectedfinal.length - 1].xpos +
        this.selectedfinal[this.selectedfinal.length - 1].width,
      this.selectedfinal[0].ypos
    );
    this.datactx.lineTo(
      this.selectedfinal[this.selectedfinal.length - 1].xpos +
        this.selectedfinal[this.selectedfinal.length - 1].width,
      this.selectedfinal[this.selectedfinal.length - 1].ypos +
        this.selectedfinal[this.selectedfinal.length - 1].height
    );

    this.datactx.moveTo(
      this.selectedfinal[this.selectedfinal.length - 1].xpos +
        this.selectedfinal[this.selectedfinal.length - 1].width,
      this.selectedfinal[this.selectedfinal.length - 1].ypos +
        this.selectedfinal[this.selectedfinal.length - 1].height
    );
    this.datactx.lineTo(
      this.selectedfinal[0].xpos,
      this.selectedfinal[this.selectedfinal.length - 1].ypos +
        this.selectedfinal[this.selectedfinal.length - 1].height
    );

    // Draw it
    this.datactx.stroke();
    this.datactx.restore();
    this.datactx.closePath();
  }
  // startAnimation(startr, startc, endr2, endc2) {
  //   this.startr = startr;
  //   this.startc = startc;
  //   this.endr2 = endr2;
  //   this.endc2 = endc2;
  //   this.animate(); // Start the animation
  // }

  // animate() {
  //   this.offset += 1; // Increment the offset to create the animation
  //   this.border(this.startr,this.startc,this.endr1, this.endc1);
  //   requestAnimationFrame(this.animate); // Call animate recursively
  // }

  // startAnimation() {
  //   // this.startr = startr;
  //   // this.startc = startc;
  //   // this.endr2 = endr2;
  //   // this.endc2 = endc2;
  //   this.animate(); // Start the animation
  // }

  move(e, data, cell) {
    let [prevstartr, prevstartc] = [this.startr, this.startc];
    this.prevstartr = prevstartr;
    this.prevstartc = prevstartc;
    let [endr2, endc2] = this.position(this.data, e);
    this.endr2 = endr2 - 1;
    this.endc2 = endc2;

    console.log("start1 " + this.startr, this.startc); // 7 1 1 4
    console.log("end1 " + this.endr2, this.endc2); // 7 8 0 2

    // this.selectedfinal =[]

    let maxi = Math.max(this.startr, this.endr2);
    let mini = Math.min(this.startr, this.endr2);

    let maxj = Math.max(this.startc, this.endc2);
    let minj = Math.min(this.startc, this.endc2);
    this.arr_selec = [];
    // this.final = this.arr2d[this.endc2][this.endr2]
    // console.log("this=="+this.final)

    for (let i = mini; i <= maxi; i++) {
      for (let j = minj; j <= maxj; j++) {
        // let sizel = this.sizel[i];
        this.final = this.arr2d[j][i];
        this.arr_selec.push(this.final);
        this.datactx.fillStyle = "#e5fbe5";

        this.datactx.fillRect(
          this.arr2d[j][i].xpos,
          this.arr2d[j][i].ypos,
          this.arr2d[j][i].width,
          this.arr2d[j][i].height
        );

        this.datactx.font = `${18}px areal `;

        this.datactx.fillStyle = "black";
        this.datactx.fillText(
          this.arr2d[j][i].data,
          this.arr2d[j][i].xpos + 2,
          this.arr2d[j + 1][i].ypos - 5
        );
        this.datactx.strokeRect(
          this.arr2d[j][i].xpos,
          this.arr2d[j][i].ypos,
          this.arr2d[j][i].width,
          this.arr2d[j][i].height
        );

        this.flag = true;
      }
    }

    console.log("arrselected" + this.arr_selec);
    console.log("finalselected" + this.selectedfinal);
    this.diff = this.selectedfinal.filter(
      (c) => this.arr_selec.indexOf(c) === -1
    );
    console.log(this.diff);
    this.diff.forEach((c) => this.clearcell(c));
    this.diff.forEach((c) => this.datacell(c));

    this.selectedfinal = this.arr_selec;
  }

  clearcell(c) {
    this.datactx.clearRect(c.xpos, c.ypos, c.width, c.height);
  }

  mouseup(e, data, cell) {
    let [endr1, endc1] = this.position(this.data, e);
    this.endr1 = endr1 - 1;
    this.endc1 = endc1;
    // console.log("end1 " + this.endr1, this.endc1); // 7 8
    console.log("start1 " + this.startr, this.startc); // 7 1 1 4
    console.log("end1 " + this.endr1, this.endc1); // 7 8 0 2

    // this.border(this.startr,this.startc,this.endr1, this.endc1)

    console.log(this.arr2d[this.endc1][this.endr1].data);

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
        console.log(this.arr2d[j][i].data);
        // sum += j;
      }
    }

    console.log("multi" + multi);
    console.log("sum" + sum1);
    console.log(Math.max(...arr));
    console.log(Math.min(...arr));
    var mean = sum1 / counter;
    console.log("mean" + mean);

    sum1 = 0;
    counter = 0;
    arr = [];
    multi = 1;

    // this.csvToJson()

    this.graph1()

    data.removeEventListener("mousemove", this.mo);
    data.removeEventListener("mouseup", this.up);
  }

  mousedown1(e, data, cell) {
    let length = this.sizel.length;
    console.log(length);
    // this.cell = cell;

    let [startr, startc] = this.position(this.data, e);
    this.startr = startr - 1;
    this.startc = startc;

    console.log("start3 " + this.startr, this.startc); // 7 1

    this.mo = (e) => this.move(e, data, this.cell);
    data.addEventListener("mousemove", this.mo);

    this.up = (e) => this.mouseup(e, data, this.cell);
    data.addEventListener("mouseup", this.up);

    console.log("start21 " + this.prevstartr, this.prevstartc); // 7 1 1 4
    console.log("end21 " + this.endr1, this.endc1); // 7 8 0 2

    let maxi = Math.max(this.prevstartr, this.endr2);
    let mini = Math.min(this.prevstartr, this.endr2);

    let maxj = Math.max(this.prevstartc, this.endc2);
    let minj = Math.min(this.prevstartc, this.endc2);

    for (let i = mini; i <= maxi; i++) {
      for (let j = minj; j <= maxj; j++) {
        // let sizel = this.sizel[i];
        this.datactx.fillStyle = "white";

        this.datactx.fillRect(
          this.arr2d[j][i].xpos,
          this.arr2d[j][i].ypos,
          this.arr2d[j][i].width,
          this.arr2d[j][i].height
        );

        this.datactx.font = `${18}px areal `;

        this.datactx.fillStyle = "black";
        this.datactx.fillText(
          this.arr2d[j][i].data,
          this.arr2d[j][i].xpos + 2,
          this.arr2d[j + 1][i].ypos - 5
        );
        this.datactx.strokeRect(
          this.arr2d[j][i].xpos,
          this.arr2d[j][i].ypos,
          this.arr2d[j][i].width,
          this.arr2d[j][i].height
        );

        this.flag = true;
      }
    }

    // this.csvToJson()
  }

  resize(e) {
    let rect = this.headers.getBoundingClientRect();
    let x = e.clientX - rect.left - 50;
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
      }
      sum += this.sizel[i];
    }
  }

  redown(e, headers) {
    this.selectedfinal = [];
    let addition = 0;
    console.log(this.acti);
    if (this.acti) {
      this.datactx.clearRect(
        this.acti.xpos,
        this.acti.ypos,
        this.acti.width,
        this.acti.height
      );
      this.datacell(this.acti);
      this.acti = null;
    }
    // this.element.style.display="none";
    let [x7, y1, total] = this.position(this.headers, e);
    console.log(x7, y1, total);

    this.prev_width = this.sizel[x7 - 2];

    console.log("This is the width= " + this.prev_width);

    var resize_mousemove = (e) => {
      let rect = headers.getBoundingClientRect();
      let x2 = e.clientX - rect.left - 50;

      addition = x2 - total;
      console.log(addition);
    };
    var resize_mouseup = (e) => {
      if (this.prev_width + addition > 50) {
        this.sizel[x7 - 2] = this.prev_width + addition;
        console.log(this.sizel);
        headers.removeEventListener("mousemove", resize_mousemove);
        this.headerdraw();
        this.csvToJson();
        headers.removeEventListener("mouseup", resize_mouseup);
      }
    };
    headers.addEventListener("mousemove", resize_mousemove);
    headers.addEventListener("mouseup", resize_mouseup);
  }
}
