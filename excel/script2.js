
const csv1 = `name,mobile,date,hii,ffgd,dfg,dg,ertg,tg,tg,etg,etrg,terg,ertg,ertg
asher,7989898,12-2-23,324,231,1234,12,trt,rttt,tg,etg,etrg,334,23,33
ff,3455,121,23,13,123,44,rtt,rtrt,tg,etg,etrg,334,23,33
ff,34553,212,23,134,124,34,rtt,rttt,tg,etg,etrg,334,23,33
fdf,34554,212,23,14,12,13, tghtr,rttt,tg,etg,etrg,334,23,33
gsfg,443,212,23,14,12,13,tghtrrrrrrrrrrrrrrrrrrrrr,rttt,tg,etg,etrg,334,23,33
gg,445,212,23,14,12,13, tghtr,rttt,tg,etg,etrg,334,23,33
fgfrgg,354,212,23,14,12,13, tghtr,rttt,tg,etg,etrg,334,23,33
gergr,34,212,23,14,12,13, tghtr,rttt,tg,etg,etrg,334,23,33
dffg,34,212,23,14,12,13, tghtr,rttt,tg,etg,etrg,334,23,33
efrgg,34,212,23,14,12,13, tghtr,rttt,tg,etg,etrg,334,23,33
ggg,34,212,23,14,12,13, tghtr,rttt,tg,etg,etrg,334,23,33
dfdf,34,212,23,14,12,13, tghtr,rttt,tg,etg,etrg,334,23,33
dfgd,34,212,23,14,12,13, tghtr,rttt,tg,etg,etrg,334,23,33
dfgdfg,34,212,23,14,12,13, tghtr,rttt,tg,etg,etrg,334,23,33
dfgfg,34,212,23,14,12,13, tghtr,rttt,tg,etg,etrg,334,23,33
fgfg,34,212,23,14,12,13, tghtr,rttt,tg,etg,etrg,334,23,33
dfgg,34,212,23,14,12,13, tghtr,rttt,tg,etg,etrg,334,23,33
dfg,34,212,23,14,12,13, tghtr,rttt,tg,etg,etrg,334,23,33
adg,34,212,23,14,12,13, tghtr,rttt,tg,etg,etrg,334,23,33
aqerg,34,212,23,14,12,13, tghtr,rttt,tg,etg,etrg,334,23,33
erg,34,212,23,14,12,13, tghtr,rttt,tg,etg,etrg,334,23,33
re,34,212,23,14,12,13, tghtr,rttt,tg,etg,etrg,334,23,33
fg,34,212,23,14,12,13, tghtr,rttt,tg,etg,etrg,334,23,33
fgverg,34,212,23,14,12,13, tghtr,rttt,tg,etg,etrg,334,23,33
gergr,34,212,23,14,12,13, tghtr,rttt,tg,etg,etrg,334,23,33
rer,34,212,23,14,12,13, tghtr,rttt,tg,etg,etrg,334,23,33
frf,34,212,23,14,12,12, tghtr,rttt,tg,etg,etrg,334,23,33`;

      let currentExcel;

        // const csv2 = `D,E,F\n7,8,9\n10,11,12`;

        let sheetsList = [];
        let currentSheetIndex = 0;

        var ele = document.querySelector(".wraper");
        currentExcel = new excel(csv1,ele);
        sheetsList.push(currentExcel)
        // currentExcel.show()
/**
 * 
 * @param {JSON} csvData data-json
 */
        function addSheet(csvData) {
        
            const newSheet = new excel(csvData, ele);
            sheetsList.push(newSheet);

            if (sheetsList.length === 1) {
                currentSheetIndex = 0;
                sheetsList[currentSheetIndex].show();
            } else {
                sheetsList[currentSheetIndex].hide();
                currentSheetIndex = sheetsList.length - 1;
                sheetsList[currentSheetIndex].show();
            }
        }
let c =2
        const sheets = document.getElementById("sheet");
        sheets.addEventListener("click", (e) => {
          // console.log("click")
     
            const newCsvData = `New Sheet ${c}`;
            addSheet(newCsvData);
            c++;
        });

        document.getElementById("next").addEventListener("click", () => {
          console.log("click")
            if (sheetsList.length > 1) {
                sheetsList[currentSheetIndex].hide();
                currentSheetIndex = (currentSheetIndex + 1) % sheetsList.length;
                sheetsList[currentSheetIndex].show();
                sheetsList[currentSheetIndex].render();

            }else{
              alert("only 1 excel present at a moment add sheet ")
            }
        });

        // addSheet(csv1);
  