
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
      this.init();
  
      this.csvToJson();
      this.headerdraw();
      this.sidedraw();
      this.pi = "bar";
      this.line2 = false;
      this.bar2 = false;
      this.pie2 = false;
      this.render();
      this.decider()
      // this.size()
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
  
  
  // events
  
     
      // click
      this.data.addEventListener("click", (e) => this.click(e, this.data));
      // dblclick for input
      this.data.addEventListener("dblclick", (e) => this.dblclick(e, this.data));
      //key functions
      window.addEventListener("keydown", (e) => this.keyfunc(e, this.data));
      // scrolling for x axis
      window.addEventListener("keydown", (e) => this.xscroll(e));
      // for selection down
   
      // scrolling for x axis
      window.addEventListener("keydown", (e) => this.xscroll(e));
      this.data.addEventListener("wheel", (e) => this.scroller(e));
    
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
  // X-axis scrolling based on Shift key
  // X-axis scrolling based on Shift key
  // X-axis scrolling based on Shift key
  xscroll(event) {
    this.xscrollX = event.shiftKey;
  }
  
  // Scroller function
  scroller(event) {
    const { deltaY, deltaX, shiftKey } = event;
    const scrollAmount = 30; // Adjust the amount as needed
  
    if (shiftKey) {
      this.scrollX = Math.max(0, this.scrollX + deltaY);
    } else {
      this.scrollY = Math.max(0, this.scrollY + deltaY);
    }
  
    // Only re-render if scrolling actually changes the visible area
    if (deltaY !== 0 || deltaX !== 0) {
      this.render();
    }
  }
  // Updated keyfunc for efficient scrolling
keyfunc(event, data) {
        //   if (this.acti != null) {
    //     this.datactx.clearRect( this.acti.xpos - this.scrollX,  this.acti.ypos - this.scrollY,  this.acti.width,  this.acti.height);
    //     this.datacell(this.acti);
    //     //made changes
    //     this.headersctx.clearRect(0, 0, this.headers.width, 30);
    //     this.headerdraw1();
    //     this.leftctx.clearRect(0, 0, 50, this.leftheaders.height);
    //     this.sidedraw1();
    //   }
    const scrollAmount = 30; // Adjust the amount as needed

    if (event.key === 'ArrowUp') {
      this.scrollY = Math.max(0, this.scrollY - scrollAmount);
      this.render();
    } else if (event.key === 'ArrowDown') {
      this.scrollY += scrollAmount;
      this.render();
    } else if (event.key === 'ArrowLeft') {
      this.scrollX = Math.max(0, this.scrollX - scrollAmount);
      this.render();
    } else if (event.key === 'ArrowRight') {
      this.scrollX += scrollAmount;
      this.render();
    }
  }
  
  // Render function
  // Render function
  render() {
    console.log("ScrollY:", this.scrollY);
    console.log("ScrollX:", this.scrollX);
  
    // Ensure cell dimensions are initialized
    const cellHeight = this.cellheight || 20; // Fallback to 20px if not initialized
    const cellWidth = this.cellwidth || 100;  // Fallback to 100px if not initialized
  
    // Clear existing drawings
    this.datactx?.clearRect(0, 0, this.data.width, this.data.height);
    this.leftctx.clearRect(0, 0, this.leftheaders.width, this.leftheaders.height);
    this.headersctx.clearRect(0, 0, this.headers.width, this.headers.height);
  
    const canvasWidth = this.data.offsetWidth;
    const canvasHeight = this.data.offsetHeight;
  
    let initHeight = -this.scrollY; // Start drawing from the scrolled position
    let initWidth = -this.scrollX;
  
    // Calculate start and end indices for rows and columns
    const startRowIndex = Math.floor(this.scrollY / cellHeight);
    const endRowIndex = Math.min(startRowIndex + Math.ceil(canvasHeight / cellHeight), this.arr2d.length);
    const startColIndex = Math.floor(this.scrollX / cellWidth);
    const endColIndex = Math.min(startColIndex + Math.ceil(canvasWidth / cellWidth), this.arr2d[0].length);
  
    console.log("StartRowIndex:", startRowIndex, "EndRowIndex:", endRowIndex);
    console.log("StartColIndex:", startColIndex, "EndColIndex:", endColIndex);
  
    // Render headers and data cells
    for (let i = startRowIndex; i < endRowIndex; i++) {
      const row = this.arr2d[i];
      initHeight += row[0].height;
  
      // Render the sidebar (left headers)
      this.sidebar(this.num[i], initHeight);
  
      let colInitWidth = initWidth; // Reset column width for each new row
  
      for (let j = startColIndex; j < endColIndex; j++) {
        const col = row[j];
        colInitWidth += col.width;
  
        // Draw the data cell
        this.datacell(col, colInitWidth, initHeight);
  
        // Draw the top grid header
        if (i === startRowIndex) { // Only draw header for the top row
          this.topgrid(this.alpha[j], colInitWidth);
        }
  
        // Extend columns if we reach the end
        if (j === row.length - 1) {
          this.extend(40, "x");
          console.log("Extended X-axis by 10 columns");
        }
  
        if (colInitWidth > canvasWidth + this.scrollX) {
          break; // Stop rendering columns beyond the visible area
        }
      }
  
      // Extend rows if we reach the end
      if (i === this.arr2d.length - 1) {
        this.extend(40, "y");
        console.log("Extended Y-axis by 10 rows");
      }
  
      if (initHeight > canvasHeight + this.scrollY) {
        break; // Stop rendering rows beyond the visible area
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
    // keyfunc(e, data) {
    //   if (this.acti != null) {
    //     this.datactx.clearRect( this.acti.xpos - this.scrollX,  this.acti.ypos - this.scrollY,  this.acti.width,  this.acti.height);
    //     this.datacell(this.acti);
    //     //made changes
    //     this.headersctx.clearRect(0, 0, 2100, 30);
    //     this.headerdraw1();
    //     this.leftctx.clearRect(0, 0, 50, this.leftheaders.height);
    //     this.sidedraw1();
    //   }
    //   if(this.acti!=null){
    //   let { row, col } = this.acti;
    //   switch (e.keyCode) {
    //     case 37:
    //       if (col > 0) {
    //         this.acti = this.arr2d[row][col - 1];// left
    //         if (this.acti.xpos + this.acti.width - 200 < this.scrollX) {
    //           this.scrollX = Math.max(0, this.scrollX - 100);
    //           this.render();
    //         }
        
    //         this.selected(this.acti);
    //       }
    //       break;
    //     case 38:
    //       if (row > 1) {
    //         this.acti = this.arr2d[row - 1][col];// up
    //         if (this.acti.ypos + this.acti.height - 60 < this.scrollY) {
    //           this.scrollY = Math.max(0, this.scrollY - 30);
    //           this.render();
    //         }
  
    //         this.selected(this.acti);
    //       }
    //       break;
    //     case 39:
    //       this.acti = this.arr2d[row][col + 1]; // right
    //       if (this.acti.xpos + 100 > this.scrollX + this.data.width) {
    //         this.scrollX += 100;
    //         this.render();
    //       }

    //       this.selected(this.acti);
    //       break;
    //     case 40:
    //       this.acti = this.arr2d[row + 1][col]; // down
    //       if (this.acti.ypos + 60 > this.scrollY + this.data.height - 180) {
    //         this.scrollY += 30;
    //         this.render();
    //       }
    
    //       this.selected(this.acti);
    //       break;
    //     case 9:
    //       this.acti = this.arr2d[row][col + 1];
    //       this.selected(this.acti);
    //       break;
    //     case 13:
    //       this.acti = this.arr2d[row + 1][col];
    //       this.selected(this.acti);
    //       break;
    //     default:
    //       break;
    //   }}
    
    // }

  
  }