class excel {
  constructor(csv, wraper) {
    let num = [];
    this.num = num;
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
    this.dashoffset = 0;
    this.selectedfinal = [];
    this.f = false;
    var draw;
    this.draw = draw;
    this.wraper = wraper;
    this.csv = csv;
    // this.init();
    this.show()
    this.csvToJson();
    this.headerdraw();
    this.sidedraw();
    this.pi = "bar";
    this.line2 = false;
    this.bar2 = false;
    this.pie2 = false;
    this.render();
    this.decider();
    this.scrollerdiv()
    // this.size()
  }

  hide() {
    this.wraper.innerHTML = ""
    this.wraper.style.display = "none";
  }
  show() {
    this.wraper.style.display = "block";
    this.init()
  }

  init() {
    // console.log(this.wraper.offsetWidth, this.wraper.offsetHeight)
    this.sizel = [ 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100 ];
    // header div
    let div3 = document.createElement("div");
    this.div3 = div3;
    this.wraper.appendChild(div3);
    div3.textContent = "";
    div3.classList.add("div3");
    
    
    // all canvas
    let headers = this.canvas(this.wraper.offsetWidth - 50, 30, "white");
    headers.classList.add("headers");
    this.headers = headers;
    this.headersctx = headers.getContext("2d");
    
    let graph = this.canvas(200, 200, "white");
    graph.classList.add("graph");
    graph.setAttribute("id", "myChart");
    this.graphctx = graph.getContext("2d");
    
    let data = this.canvas( this.wraper.offsetWidth - 50, this.wraper.offsetHeight - 30,"white" );
    data.classList.add("data");
    this.data = data;
    this.datactx = data.getContext("2d");
    
    let leftheaders = this.canvas(50, this.wraper.offsetHeight - 30, "white");
    this.leftctx = leftheaders.getContext("2d");
    this.leftheaders = leftheaders;
    
    this.wraper.appendChild(headers);
    // adding subwraper and appneding canavs in subwraper and subwraper in wraper
    let div = document.createElement("div");
    this.div = div;
    this.div.classList.add("subwrapper");
    this.div.appendChild(leftheaders);
    this.div.appendChild(data);
    this.wraper.appendChild(div);
    
    // console.log(this.data.height,this.data.width)
    // searching close btn
    const close = document.getElementById("close");
    this.close = close;
  // graph dragable div 
    let draggablediv = document.createElement("div");
    draggablediv.classList.add("draggable-div");
// graph close button
    let closebtnv = document.createElement("div");
    closebtnv.classList.add("close-btn");
    closebtnv.textContent = "X";
    this.div.appendChild(draggablediv);
    draggablediv.appendChild(closebtnv);
    draggablediv.appendChild(graph);
  // for input 
    let input = document.createElement("input");
    input.classList.add("hidden");
    this.div.appendChild(input);

//adding div in wraper and in that add canvas and s
let divmain = document.createElement("div")
divmain.classList.add("divmain");
this.wraper.appendChild(divmain)
divmain.appendChild(div3)
divmain.appendChild(headers)
divmain.appendChild(div)
this.divmain = divmain



// div for scroller


    // find
    const find = document.getElementById("find");
    find.addEventListener("click", (e) => this.search2DArray(e));
    // replace
    const replace1 = document.getElementById("replace");
    replace1.addEventListener("click", (e) => this.replaceitem(e));
    // click
    this.data.addEventListener("click", (e) => this.click(e, this.data));
    // dblclick for input
    this.data.addEventListener("dblclick", (e) => this.dblclick(e, this.data));
    //key functions
    window.addEventListener("keydown", (e) => this.keyfunc(e, this.data));
    // scrolling for x axis
    window.addEventListener("keydown", (e) => this.xscroll(e));
    // for selection down
    this.down = (e) => this.mousedown1(e, this.data, this.cell);
    this.data.addEventListener("mousedown", this.down);
    // for dragable graph
    document.addEventListener("DOMContentLoaded", (e) =>
      this.draggraph(e, draggablediv, closebtnv)
    );

    // copy
    const copy1 = document.getElementById("copy");
    this.copy1 = copy1;
    this.copy1.addEventListener("click", (e) => this.copy(e));
    //cut
    const cut1 = document.getElementById("cut");
    this.cut1 = cut1;
    this.cut1.addEventListener("click", (e) => this.cut(e));
    // paste
    const paste1 = document.getElementById("paste");
    this.paste1 = paste1;
    this.paste1.addEventListener("click", (e) => this.paste(e));
    // resize and scroller event
    this.headers.addEventListener("mousemove", (e) =>
      this.resize(e, this.headers)
    );
    this.data.addEventListener("wheel", (e) => this.scroller(e));
    // search
    const searchbtn = document.getElementById("search12");
    this.searchbtn = searchbtn;
    this.searchbtn.addEventListener("click", (e) => this.searchdiv(e));

    // this.datactx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }
// paste func
  paste() {
    for (let i = 0; i < this.selectedfinal.length; i++) {
      this.selectedfinal[i].data = this.arr2[i] ? this.arr2[i] : "";
    }
    this.render();
  }
// cut func
  cut() {
    let copytext = "";
    this.arr2 = [];
    for (let i = 0; i < this.selectedfinal.length; i++) {
      copytext += this.selectedfinal[i].data + "\n";
      this.arr2[i] = this.selectedfinal[i].data;
      navigator.clipboard.writeText(copytext);
      this.selectedfinal[i].data = "";
    }
    this.render();
  }
// copy func
  copy() {
    // console.log("copy");
    let copytext = "";
    let arr2 = [];
    this.arr2 = arr2;
    for (let i = 0; i < this.selectedfinal.length; i++) {
      copytext += this.selectedfinal[i].data + "\n";
      arr2[i] = this.selectedfinal[i].data;
      navigator.clipboard.writeText(copytext);
    }
    this.cellintial = this.arr2d[this.minj][this.mini];
    this.finalcell = this.arr2d[this.maxj][this.maxi];
   
  }
// search function for display search div
  searchdiv(e) {
    let searchdiv1 = document.getElementById("searchdiv");
    this.searchdiv1 = searchdiv1;
    searchdiv1.style.display = "block";
    this.close.addEventListener("click", (e) => this.closed(e));
  }
  // to close tht div 
  closed(e) {
    this.searchdiv1.style.display = "none";
  }
// dragable graph div
  draggraph(e, draggablediv, closebtnv) {
    const graphBtn = document.getElementById("graph");
    let isDragging = false;
    let offsetX, offsetY;
    var clickgraph = (e) => {
    
      // draggablediv.style.display = "block";
      const rect = this.data.getBoundingClientRect();
      const x = 50;
      const y = 50;
      draggablediv.style.left = `${x}px`;
      draggablediv.style.top = `${y}px`;
      draggablediv.style.display = "block";
      // console.log(draggablediv.style.display)
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
// for selecting which graph to draw
  decider() {
    const line1 = document.getElementById("line");
    const bar1 = document.getElementById("bar");
    const pie1 = document.getElementById("pie");
   // pie
    pie1.addEventListener("click", () => {
      this.pie2 = !this.pie2;
      if (this.pie2) {
        this.pi = "pie";
        this.line2 = false;
        this.bar2 = false;
        bar1.style.background = "grey";
        line1.style.background = "grey";
        pie1.style.background = "green";
      }
    });
    // bar
    bar1.addEventListener("click", () => {
      this.bar2 = !this.bar2;
      if (this.bar2) {
        this.pi = "bar";
        this.line2 = false;
        this.pie2 = false;
        bar1.style.background = "green";
        line1.style.background = "grey";
        pie1.style.background = "grey";
      }
    });
// line
    line1.addEventListener("click", () => {
      this.line2 = !this.line2;

      if (this.line2) {
        this.pi = "line";
        this.bar2 = false;
        this.pie2 = false;
        bar1.style.background = "grey";
        line1.style.background = "green";
        pie1.style.background = "grey";
      }
    });
  }
// main graph function 
  graph1() {
    if (this.selectedfinal.length > 0) {
      let startcor = this.selectedfinal[0].row;
      let startcoc = this.selectedfinal[0].col; //0

      let endcor = this.selectedfinal[this.selectedfinal.length - 1].row;
      let endcoc = this.selectedfinal[this.selectedfinal.length - 1].col; //0
      let labels1 = [];
      var count = 0;
      for (let j = startcoc; j <= endcoc; j++) {
        labels1[count] = this.arr2d[0][j].data;
        count++;
      }
      let arr1 = [0, 0, 0];
      let sum = 0;
      let c = 0;
      for (let i = 0; i < this.selectedfinal.length - 1; i++) {
        if (this.selectedfinal[i].xpos == this.selectedfinal[i + 1].xpos) {
          sum += parseInt(this.selectedfinal[i].data);
          console.log(this.selectedfinal[i].data);
        } else {
          sum += parseInt(this.selectedfinal[i].data);
          arr1[c] = Math.floor(sum);
          c++;
          sum = 0;
        }
      }
      sum += parseInt(this.selectedfinal[this.selectedfinal.length - 1].data);
      arr1[c] = Math.floor(sum);
      if (this.draw != null) this.draw.destroy();
      this.draw = new Chart(this.graphctx, {
        type: this.pi,
        data: {
          labels: labels1,
          datasets: [
            {
              label: "# of Votes",
              data: arr1,
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
// general function for extending cells
  extend(count, axis) {
    let length = this.arr2d[this.arr2d.length - 1].length;
    let jlen = this.arr2d.length;
  if (axis == "y") {
      for (let j = jlen; j < jlen + count; j++) {
        let data1d = [];
        for (let i = 0; i < length; i++) {
          let rectData = {};
          rectData["xpos"] = this.arr2d[this.arr2d.length - 1][i].xpos;
          rectData["ypos"] =this.arr2d[j - 1][i].ypos + this.arr2d[j - 1][i].height;
          rectData["width"] = this.sizel[i];
          rectData["height"] = 30;
          rectData["color"] = "black";
          rectData["row"] = this.arr2d[this.arr2d.length - 1][i].row + 1;
          rectData["col"] = this.arr2d[this.arr2d.length - 1][i].col;
          rectData["data"] = "";
          data1d.push(rectData);
          this.datacell(rectData);
        }
        this.arr2d.push(data1d);
      }
      // calling extend left canvas
      this.extentside(count);
    }
  if (axis == "x") {
      this.arr2d.forEach((row, i) => {
        let prevColumns = row.length;
        for (let j = prevColumns; j < prevColumns + count; j++) {
          let left = row[j - 1].xpos + row[j - 1].width;
          let top = row[j - 1].ypos;
          let rectData = {};
          rectData["xpos"] = left;
          rectData["ypos"] = top;
          rectData["width"] = 100;
          this.sizel.push(100);
          rectData["height"] = 30;
          rectData["color"] = "black";
          rectData["data"] = "";
          rectData["row"] = i;
          rectData["col"] = j;
          row.push(rectData);
          this.datacell(rectData);
        }
      });
   // calling extend header canvas
      this.extendheader(count);
    }
  }
//func for exendheader 
  extendheader(count) {
    let prev = this.alpha.length;
    for (let i = prev; i < prev + count; i++) {
      let rectData = {};
      rectData["xpos"] = this.alpha[i - 1].xpos + this.alpha[i - 1].width;
      rectData["ypos"] = 0;
      rectData["width"] = 100;
      rectData["height"] = 30;
      rectData["color"] = "black";
      rectData["data"] = this.toLetters(i);
      this.alpha.push(rectData);
    }
  }
// func for infi letters
  toLetters(num) {
    var mod = num % 26,
      pow = (num / 26) | 0,
      out = mod ? String.fromCharCode(64 + mod) : (--pow, "Z");
    return pow ? this.toLetters(pow) + out : out;
  }
// for x axis for shift key
  xscroll(event) {
    if (event.shiftKey) {
      this.xscrollX = true;
    } else {
      this.xscrollX = false;
    }
  }
// scroll bar artifical






// scroller func
  scroller(event) {
    let {deltaY} = event;
    if (event.shiftKey) {
      this.scrollX = Math.max(0, this.scrollX + deltaY); // extending by 100
    } else {
      this.scrollY = Math.max(0, this.scrollY + (deltaY < 0 ? -30 : 30)); // by 30
    }
    this.render();
  }
// render function
  render() {
    console.log(this.scrollY);
    console.log(this.scrollX);
    this.datactx?.clearRect(0, 0, this.data.width, this.data.height);
    this.leftctx.clearRect(0, 0, this.leftheaders.width, this.leftheaders.height);
    this.headersctx.clearRect(0, 0, this.headers.width, this.headers.height);
    let canvaWidth = this.data.offsetWidth;
    let canvaHeight = this.data.offsetHeight;
    let initHeight = 0;
    let newScrollY = this.scrollY;
    this.newScrollY = newScrollY;
    let newScrollX = this.scrollX;
    for (let i = newScrollY / this.cellheight; i < this.arr2d.length; i++) {
      const row = this.arr2d[i];
      if (i == this.arr2d.length - 1) {
     // if reach end extend by 10 cells
        this.extend(10, "y");
        console.log("ey")
      }
      if (initHeight > canvaHeight + newScrollY) {
        break;
      } else {
        let initWidth = 0;
        initHeight += row[0].height;
        // drawing side bar
        this.sidebar(this.num[i]);
        for (let j = 0; j < row.length; j++) {
          const col = row[j];
          if (j == row.length - 1) {
          // if its end of row thn extend by x axis by 10 cells
            this.extend(10, "x");
          }
          if (initWidth > canvaWidth + newScrollX) {
            break;
          } else {
            initWidth += row[j].width;
            const col = row[j];
            // draw datacell and header
            this.datacell(col);
            this.topgrid(this.alpha[j]);
          }
        }
      }
    }
  }
// function to draw canvas
  canvas(width, height, color) {
    let canvas = document.createElement("canvas");
    canvas.width = Math.floor(width * window.devicePixelRatio);
    canvas.height = Math.floor(height * window.devicePixelRatio);
    canvas.style.background = color;
    return canvas;
  }
// function for converting json into data
  csvToJson() {
    const lines = this.csv.split("\n");
    this.arr2d = [];
    let headers = lines[0].split(",");
    this.arr2d = [];
    let header1d = [];
    // this.datactx.clearRect(0, 0,this.data.width,this.data.height);
    let counter = 0;
    // for header 1st column
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
    // for loop for data
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

  }
// drawing datacell 
  datacell(data) {
    // this.datactx.scale(window.devicePixelRatio, window.devicePixelRatio);
    this.datactx.restore();
    this.datactx.save();
    this.datactx.beginPath();
    this.datactx.fillStyle = "white";
    this.datactx.strokestyle = "black";
    this.datactx.lineWidth = 2;
    this.datactx.rect(data.xpos - 0.5 - this.scrollX, data.ypos - this.scrollY - 0.5, data.width + 1, data.height + 1);
    this.datactx.clip();
    this.datactx.fillRect(data.xpos - 0.5 - this.scrollX,data.ypos - this.scrollY - 0.5, data.width + 1, data.height + 1 );
    this.datactx.fillStyle = "black";
    this.datactx.font = `${18}px areal`;
    this.datactx.fillText(data.data, data.xpos + 2 - this.scrollX,data.ypos + data.height - 5 - this.scrollY );
    this.datactx.stroke();
    this.datactx.restore();
    this.datactx.save();
  }
//  initial header pushing  objects in alpha arr
  headerdraw() {
    // this.headersctx.clearRect(0, 0, 2100, 30);
    let aplhabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let arr1 = aplhabets.split("");
    let alpha = [];
    this.alpha = alpha;
    let c = 0;
    for (let i = 0; i < arr1.length; i++) {
      let rectData = {};
      rectData["xpos"] = c;
      rectData["ypos"] = 0;
      rectData["width"] = this.sizel[i];
      rectData["height"] = 30;
      rectData["color"] = "black";
      rectData["data"] = arr1[i];
      this.alpha.push(rectData);
      c += this.sizel[i];
    }
  }
// top header getting created
  topgrid(alpha) {
      this.headersctx.beginPath();
      this.headersctx.save();
      this.headersctx.fillStyle = "#E8E8E8";
      this.headersctx.strokestyle = "black";
      this.headersctx.fillRect(alpha.xpos - this.scrollX, alpha.ypos, alpha.width, alpha.height);
      this.headersctx.strokeRect( alpha.xpos - this.scrollX, alpha.ypos, alpha.width, alpha.height); //arr[j]
      this.headersctx.fillStyle = "black";
      this.headersctx.font = `${18}px areal`;
      this.headersctx.fillText(alpha.data,alpha.xpos + 30 - this.scrollX, alpha.ypos + alpha.height - 5 );
      this.headersctx.stroke();
  }
// calling header func again
  headerdraw1() {
    for (let i = 0; i < this.alpha.length; i++) {
      this.topgrid(this.alpha[i]);
    }
  }
// inserting objects in num arr
  sidedraw() {
    for (let i = 0; i < this.arr2d.length; i++) {
      let rectData = {};
      rectData["xpos"] = 0;
      rectData["ypos"] = i * 30;
      rectData["width"] = 50;
      rectData["height"] = 30;
      rectData["color"] = "black";
      rectData["data"] = i + 1;
      // this.sidebar(rectData);
      this.num.push(rectData);
    }
  }
  // drawing side bar data
  sidedraw1() {
    for (let i = 0; i < this.num.length; i++) {
      this.sidebar(this.num[i]);
    }
  }
// extending side
  extentside(count) {
    let length = this.num.length;
    for (let i = length; i < length + count; i++) {
      let rectData = {};
      rectData["xpos"] = 0;
      rectData["ypos"] = this.num[i - 1].ypos + this.num[i - 1].height;
      rectData["width"] = 50;
      rectData["height"] = 30;
      rectData["color"] = "black";
      rectData["data"] = i + 1;
      this.sidebar(rectData); // calling drawing func
      this.num.push(rectData);
    }
  }
// side bar draw
  sidebar(alpha) {
    this.leftctx.restore();
    this.leftctx.save();
    this.leftctx.beginPath();
    this.leftctx.fillStyle = "#E8E8E8";
    this.leftctx.strokestyle = "black";
    this.leftctx.fillRect( alpha.xpos, alpha.ypos - this.scrollY, alpha.width, alpha.height );
    this.leftctx.strokeRect( alpha.xpos, alpha.ypos - this.scrollY, alpha.width, alpha.height); //arr[j]
    this.leftctx.fillStyle = "black";
    this.leftctx.font = `${18}px areal`;
    this.leftctx.fillText( alpha.data, alpha.xpos + 5, alpha.ypos + alpha.height - 5 - this.scrollY);
    this.leftctx.stroke();
  }
  // position function to get co ordinates
  position(data,event) {
    let rect = this.data.getBoundingClientRect();
    let x = event.clientX - rect.left + this.scrollX;
    let y = event.clientY - rect.top + this.scrollY;
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
    let c = Math.floor(y / 30);
    console.log("ROW: " + r, "CoL: " + c);
    return [r, c, sum - this.sizel[r - 1]];
  }
// db for activating input func
  dblclick(e, data) {
    this.inputtext(e, this.cell, this.datactx);
  }
// input func
  inputtext(e, cell, datactx) {
    var element = document.querySelector(".hidden");
    this.element = element;
    this.element.style.width = `${cell.width}px`;
    this.element.style.height = `${cell.height}px`;
    this.element.style.display = "block";
    this.element.style.left = `${cell.xpos + 50 - this.scrollX}px`;
    this.element.style.top = `${cell.ypos - this.scrollY}px`;
    this.element.value = cell.data;
    this.f = true;
    this.element.focus();
    this.x = (e) => this.Pressclick(e, datactx, cell);
    this.element.addEventListener("blur", this.x);
  }
// when click datacell gets 
  Pressclick(event, datactx, cell) {
    if (this.f) {
      var nvalue = this.element.value;
      cell.data = nvalue;
      this.datactx.clearRect(   cell.xpos - 0.5 - this.scrollX,   cell.ypos - this.scrollY - 0.5,   cell.width + 1,   cell.height + 1 );
      this.datactx.save();
      this.datactx.fillStyle = "white";
      this.datactx.strokestyle = "black";
      this.datactx.rect(cell.xpos - 0.5 - this.scrollX,cell.ypos - this.scrollY - 0.5, cell.width + 1,cell.height + 1 );
      this.datactx.clip();
      this.datactx.fillStyle = "black";
      this.datactx.font = `${18}px areal`;
      this.datactx.fillText(nvalue, cell.xpos + 2 - this.scrollX, cell.ypos + cell.height - 5 - this.scrollY );
      this.datactx.restore();
      this.datactx.stroke();
      this.f = false;
      this.element.style.display = "none";
      this.element.removeEventListener("blur", this.x);
    }
  }
// for drawing line header and left side bar
  line() {
    // header
    this.headersctx.beginPath();
    this.headersctx.strokeStyle = "green";
    this.headersctx.lineWidth = 6;
    this.headersctx.moveTo(this.acti.xpos - this.scrollX, 30);
    this.headersctx.lineTo(this.acti.xpos + this.acti.width - this.scrollX, 30);
    this.headersctx.fillStyle = "#e7f1ec11";
    this.headersctx.stroke();
    this.headersctx.restore();
    // sidebar
    this.leftctx.beginPath();
    this.leftctx.strokeStyle = "green";
    this.leftctx.lineWidth = 6;
    this.leftctx.moveTo(0 + 50, this.acti.ypos - this.scrollY);
    this.leftctx.lineTo(0 + 50, this.acti.ypos + 30 - this.scrollY);
    this.leftctx.stroke();
    this.leftctx.restore();
  }
// when click
  click(e, data) {
    if (this.acti) { // clearing all cell
      this.datactx.clearRect( this.acti.xpos - this.scrollX,this.acti.ypos - this.scrollY,  this.acti.width,  this.acti.height);
      this.datacell(this.acti);
      this.headersctx.clearRect(0, 0, this.headers.width, 30);
      this.headerdraw1();
      this.leftctx.clearRect(0, 0, 50, this.leftheaders.height);
      this.sidedraw1();
    }

    var [r, c] = this.position(data, e);
    this.r = r;
    this.c = c;
    this.cell = this.arr2d[c][r - 1];
    this.acti = this.arr2d[c][r - 1];
    this.datactx.clearRect(this.acti.xpos - this.scrollX,this.acti.ypos - this.scrollY, this.acti.width, this.acti.height );
    this.datactx.save();
    this.datactx.beginPath();
    this.datactx.fillStyle = "white";
    this.datactx.strokeStyle = "#107c41";
    this.datactx.lineWidth = 2;
    this.datactx.rect(this.acti.xpos - this.scrollX,this.acti.ypos - this.scrollY,this.acti.width, this.acti.height);
    this.datactx.strokeRect( this.acti.xpos - this.scrollX, this.acti.ypos - this.scrollY,this.acti.width, this.acti.height);
    this.datactx.clip();
    this.datactx.fillStyle = "black";
    this.datactx.font = `${18}px areal`;
    this.datactx.fillText(this.acti.data,this.acti.xpos + 2 - this.scrollX,this.acti.ypos + this.acti.height - 5 - this.scrollY );
    this.datactx.restore();
    this.line();
  }
// for keydown to draw cell 
  selected(data) {
    this.datactx.clearRect(  data.xpos - this.scrollX, data.ypos - this.scrollY, data.width, data.height   );
    this.datactx.save();
    this.datactx.beginPath();
    this.datactx.fillStyle = "white";
    this.datactx.strokeStyle = "#107c41";
    this.datactx.lineWidth = 2;
    this.datactx.rect(data.xpos - this.scrollX, data.ypos - this.scrollY, data.width, data.height );
    this.datactx.strokeRect(  data.xpos - this.scrollX,  data.ypos - this.scrollY,  data.width,  data.height );
    this.datactx.clip();
    this.datactx.fillStyle = "black";
    this.datactx.font = `${20}px areal`;
    this.datactx.fillText( data.data, data.xpos + 2 - this.scrollX, data.ypos + data.height - 5 - this.scrollY );
    this.datactx.restore();
  }
// keydown func 
  keyfunc(e, data) {
    if (this.acti != null) {
      this.datactx.clearRect( this.acti.xpos - this.scrollX,  this.acti.ypos - this.scrollY,  this.acti.width,  this.acti.height);
      this.datacell(this.acti);
      //made changes
      this.headersctx.clearRect(0, 0, 2100, 30);
      this.headerdraw1();
      this.leftctx.clearRect(0, 0, 50, this.leftheaders.height);
      this.sidedraw1();
    }
    let { row, col } = this.acti;
    switch (e.keyCode) {
      case 37:
        if (col > 0) {
          this.acti = this.arr2d[row][col - 1];// left
          if (this.acti.xpos + this.acti.width - 200 < this.scrollX) {
            this.scrollX = Math.max(0, this.scrollX - 100);
            this.render();
          }
          this.line();
          this.selected(this.acti);
        }
        break;
      case 38:
        if (row > 1) {
          this.acti = this.arr2d[row - 1][col];// up
          if (this.acti.ypos + this.acti.height - 60 < this.scrollY) {
            this.scrollY = Math.max(0, this.scrollY - 30);
            this.render();
          }
          this.line();
          this.selected(this.acti);
        }
        break;
      case 39:
        this.acti = this.arr2d[row][col + 1]; // right
        if (this.acti.xpos + 100 > this.scrollX + this.data.width) {
          this.scrollX += 100;
          this.render();
        }
        this.line();
        this.selected(this.acti);
        break;
      case 40:
        this.acti = this.arr2d[row + 1][col]; // down
        if (this.acti.ypos + 60 > this.scrollY + this.data.height - 180) {
          this.scrollY += 30;
          this.render();
        }
        this.line();
        this.selected(this.acti);
        break;
      case 9:
        this.acti = this.arr2d[row][col + 1];
        this.selected(this.acti);
        break;
      case 13:
        this.acti = this.arr2d[row + 1][col];
        this.selected(this.acti);
        break;
      default:
        break;
    }
  }
  // mouse move
  move(e, data, cell) {
    let [prevstartr, prevstartc] = [this.startr, this.startc];
    this.prevstartr = prevstartr;
    this.prevstartc = prevstartc;
    let [endr2, endc2] = this.position(this.data, e);
    this.endr2 = endr2 - 1;
    this.endc2 = endc2;
    let maxi = Math.max(this.startr, this.endr2);
    let mini = Math.min(this.startr, this.endr2);
    let maxj = Math.max(this.startc, this.endc2);
    let minj = Math.min(this.startc, this.endc2);
    this.arr_selec = [];
    this.maxi = maxi;
    this.mini = mini;
    this.maxj = maxj;
    this.minj = minj;
    for (let i = mini; i <= maxi; i++) {
      for (let j = minj; j <= maxj; j++) {
        this.final = this.arr2d[j][i];
        this.arr_selec.push(this.final);
        this.datactx.save();
        this.datactx.beginPath();
        this.datactx.fillStyle = "#e7f1ec";
        this.datactx.strokestyle = "black";
        this.datactx.lineWidth = 2;
        this.datactx.rect( this.arr2d[j][i].xpos - 0.5 - this.scrollX, this.arr2d[j][i].ypos - this.scrollY - 0.5,this.arr2d[j][i].width + 1,this.arr2d[j][i].height + 1);
        this.datactx.clip();
        this.datactx.fillRect( this.arr2d[j][i].xpos - 0.5 - this.scrollX,this.arr2d[j][i].ypos - this.scrollY - 0.5,this.arr2d[j][i].width + 1,this.arr2d[j][i].height + 1)
        this.datactx.fillStyle = "black";
        this.datactx.font = `${18}px areal`;
        this.datactx.fillText(this.arr2d[j][i].data, this.arr2d[j][i].xpos + 2 - this.scrollX, this.arr2d[j + 1][i].ypos - 5 - this.scrollY);
        this.datactx.stroke();
        this.datactx.restore();
      }
    }
    this.diff = this.selectedfinal.filter(
      (c) => this.arr_selec.indexOf(c) === -1
    );
 
    this.diff.forEach((c) => this.clearcell(c));
    this.diff.forEach((c) => this.datacell(c));

    this.selectedfinal = this.arr_selec;
  }
  // for clearing every cell above 
  clearcell(c) {
    this.datactx.clearRect(c.xpos - this.scrollX,c.ypos - this.scrollY,c.width,c.height );
  }
// on mouse up 
  mouseup(e, data, cell) {
    let [endr1, endc1] = this.position(this.data, e);
    this.endr1 = endr1 - 1;
    this.endc1 = endc1;
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
      }
    }
    // for printing calc values
    var mean = sum1 / counter;
    let multi1 = document.getElementById("multi");
    let sum = document.getElementById("sum");
    let min = document.getElementById("min");
    let max = document.getElementById("max");
    let mean1 = document.getElementById("mean");
    let mode = document.getElementById("mode")
    let median = document.getElementById("median")
// console.log(this.selectedfinal)
// mode logic
let maxCount = 0;
let mode1 = null;
for (let i = 0; i < this.selectedfinal.length; i++) {
    let currentElement = this.selectedfinal[i].data;
    let count = 0;

 
    for (let j = 0; j < this.selectedfinal.length; j++) {
        if (this.selectedfinal[j].data === currentElement) {
            count++;
        }
    }

    if (count > maxCount) {
        maxCount = count;
        mode1 = currentElement;
    }
}
// median
let values = []
for(let i =0;i<this.selectedfinal.length;i++){
  values[i] = parseInt(this.selectedfinal[i].data)
}


let n = values.length
let median1 =0
values.sort((a, b) => a - b)
let mid = Math.floor(n/2)
if(n%2==0){
median1 = (values[mid-1] + values[mid])/2
}else{
  median1 = values[mid]  
}

    if (isNaN(multi)) {
      multi1.innerHTML = "Please select only numerical value";
      sum.innerHTML = "Please select only numerical value";
      max.innerHTML = "Please select only numerical value";
      min.innerHTML = "Please select only numerical value";
      mean1.innerHTML = "Please select only numerical value";
      mode.innerHTML = "Please select only numerical value";
      median.innerHTML = "Please select only numerical value";
    } else {
      multi1.innerHTML = multi;
      sum.innerHTML = sum1;
      max.innerHTML = Math.max(...arr);
      min.innerHTML = Math.min(...arr);
      mean1.innerHTML = mean;
      mode.innerHTML = mode1
      median.innerHTML = median1
    }
    sum1 = 0;
    counter = 0;
    arr = [];
    multi = 1;
    data.removeEventListener("mousemove", this.mo);
    data.removeEventListener("mouseup", this.up);
  }
// on mouse down
  mousedown1(e, data, cell) {
    let length = this.sizel.length;
    let [startr, startc] = this.position(this.data, e);
    this.startr = startr - 1;
    this.startc = startc;
    // added 2 events
    this.mo = (e) => this.move(e, data, this.cell);
    data.addEventListener("mousemove", this.mo);
    this.up = (e) => this.mouseup(e, data, this.cell);
    data.addEventListener("mouseup", this.up);

    let maxi = Math.max(this.prevstartr, this.endr2);
    let mini = Math.min(this.prevstartr, this.endr2);
    let maxj = Math.max(this.prevstartc, this.endc2);
    let minj = Math.min(this.prevstartc, this.endc2);

    for (let i = mini; i <= maxi; i++) {
      for (let j = minj; j <= maxj; j++) {
        this.datactx.save();
        this.datactx.beginPath();
        this.datactx.fillStyle = "white";
        this.datactx.strokeStyle = "black";
        this.datactx.lineWidth = 2;
        this.datactx.rect( this.arr2d[j][i].xpos - 0.5 - this.scrollX, this.arr2d[j][i].ypos - this.scrollY - 0.5, this.arr2d[j][i].width + 1, this.arr2d[j][i].height + 1 );
        this.datactx.clip();
        this.datactx.fillRect(this.arr2d[j][i].xpos - 0.5 - this.scrollX,this.arr2d[j][i].ypos - this.scrollY - 0.5,this.arr2d[j][i].width + 1,this.arr2d[j][i].height + 1 );
        this.datactx.fillStyle = "black";
        this.datactx.font = `${18}px areal`;
        this.datactx.fillText(this.arr2d[j][i].data,this.arr2d[j][i].xpos + 2 - this.scrollX,this.arr2d[j + 1][i].ypos - 5 - this.scrollY);
        this.datactx.stroke();
        this.datactx.restore();
      }
    }
  // calling graph1 func 
    this.graph1();
  }
  // on resize its width should be updated
  dynamicwidth() {
    let counter = 0;// datacell width
    for (let i = 0; i < this.arr2d.length; i++) {
      counter = 0;
      for (let j = 0; j < this.arr2d[0].length; j++) {
        let rectData = this.arr2d[i][j];
        rectData.xpos = counter;
        rectData.width = this.sizel[j];
        counter += this.sizel[j];
      }
    }
    counter = 0; // header width
    for (let j = 0; j < this.alpha.length; j++) {
      let rectDatahead = this.alpha[j];
      rectDatahead.xpos = counter;
      rectDatahead.width = this.sizel[j];
      counter += this.sizel[j];
    }
  }
// for displaying col-resize cursor
  resize(e) {
    let rect = this.headers.getBoundingClientRect();
    let x = e.clientX - rect.left + this.scrollX;
    let sum = 0;
    for (let i = 0; i < this.sizel.length; i++) {
      if (sum + 4 > x && x > sum && x > 56) {
        this.headers.style.cursor = "col-resize"
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
// when click on mouse down gets activated
  redown(e, headers) {
    this.selectedfinal = [];
    let addition = 0;
    if (this.acti) {
      this.datactx.clearRect( this.acti.xpos - this.scrollX,this.acti.ypos - this.scrollY,this.acti.width,this.acti.height);
      this.datacell(this.acti);
      this.acti = null;
    }
    let [x7, y1, total] = this.position(this.headers, e); // calling for co-ordinates and total length from x position
    this.prev_width = this.sizel[x7 - 2];
  // moving tht cursor 
    var resize_mousemove = (e) => {
      let rect = headers.getBoundingClientRect();
      let x2 = e.clientX - rect.left + this.scrollX;
      addition = x2 - total;
    };
  // mouse up func will terminate
    var resize_mouseup = (e) => {
      if (this.prev_width + addition > 50) {
        this.sizel[x7 - 2] = this.prev_width + addition;
        headers.removeEventListener("mousemove", resize_mousemove);
        this.dynamicwidth(); // calling render and width func again
        this.render();
        headers.removeEventListener("mouseup", resize_mouseup);
      }
    };
    headers.addEventListener("mousemove", resize_mousemove);
    headers.addEventListener("mouseup", resize_mouseup);
  }
// for replace data
  replaceitem() {
    var boolea = false;
    let replaceterm = document.getElementById("replaceinput").value.toLowerCase();
    let replaceser = document.getElementById("replaceinput1").value.toLowerCase();
    for (let i = 0; i < this.arr2d.length; i++) {
      for (let j = 0; j < this.arr2d[i].length; j++) {
        let element = this.arr2d[i][j].data.toLowerCase();
        if (element == replaceser) {
          this.arr2d[i][j].data = replaceterm;
          this.render();
          boolea = true;
        }
      }
    }
    if (boolea == false) {
      alert("data not found");
    }
  }
  // searching  2d arr
  search2DArray() {
    let searchTerm = document.getElementById("searchInput").value.toLowerCase();
    let results = [];
    for (let i = 0; i < this.arr2d.length; i++) {
      for (let j = 0; j < this.arr2d[i].length; j++) {
        let element = this.arr2d[i][j].data.toLowerCase();
        if (element.includes(searchTerm)) {
          results.push(this.arr2d[i][j].data);
        }
      }
    }
    this.displayResults(results);
  }
// displaying search results
  displayResults(results) {
    let resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";
    if (results.length > 0) {
      let resultHtml =
        "<span>count </span>" +
        results.length +
        "<span> Search results:</span>";
      resultHtml += "<ul>";
      results.forEach((result) => {
        resultHtml += `<li>${result}</li>`;
      });
      resultHtml += "</ul>";
      resultsDiv.innerHTML = resultHtml;
    } else {
      resultsDiv.innerHTML = "<p>No results found.</p>";
    }
  }

scrollerdiv(){
// for y axis
  let scroldivy = document.createElement("div")
scroldivy.classList.add("scroldiv")
this.wraper.appendChild(scroldivy)
let childscroll = document.createElement("div")
childscroll.classList.add("childscroll")
scroldivy.appendChild(childscroll)
// console.log(this.arr2d.length)
let divheight = this.arr2d.length * 30*5;
childscroll.style.height=`${divheight}px`

// for x axis
let scroldivx = document.createElement("div")
scroldivx.classList.add("scroldivx")
this.wraper.appendChild(scroldivx)
let childscrollx = document.createElement("div")
childscrollx.classList.add("childscrollx")
scroldivx.appendChild(childscrollx)
// // console.log(this.arr2d.length)
let divwidth = this.arr2d[0].length * 100;
// console.log(divwidth)
childscrollx.style.width=`${divwidth}px`


let y = "y"
scroldivy.addEventListener("scroll", (e) => this.scrollhandle(e,y));

let x = "x"
scroldivx.addEventListener("scroll",(e) => this.scrollhandle(e,x))


}


scrollhandle(e,axis){

// console.log("scrolled")

if(axis == 'y'){
this.scrollY = Math.floor(e.target.scrollTop/30)*30;
}else{
  this.scrollX = Math.floor(e.target.scrollLeft/100)*100;
}
this.render()

}






}
