// window.onload = function(){
//     let socket = io();
//     let bg_canvas = document.getElementById('bg_canvas');
//     let fg_canvas = document.getElementById('fg_canvas');
//     let bg_context = bg_canvas.getContext('2d'),
//         fg_context = fg_canvas.getContext('2d'),
//         range_stick = document.getElementById('range_stick'),
//         range_value = document.querySelector('.range_value');
//         range_stick.addEventListener('input', function(){
//             range_value.textContent = range_stick.value; 
//         });      
//     let clearCanv = document.getElementById('clearCanvas');
//         clearCanv.addEventListener('click', () => {
//             clearCanvas(bg_canvas, bg_context);
//             socket.emit('clearCanvas');
//         });
//         function clearCanvas(canvas, context){
//             context.clearRect(0, 0, canvas.width, canvas.height);    
//         }
//     let stepBack = document.getElementById('back');
//         stepBack.addEventListener('click', ()=>{
//             let masCoords = JSON.parse(localStorage.getItem('coordsForLocalStorage'));
//            // console.log(masCoords);
//             for (let i = masCoords.length - 2; i > -1; i--)  {
//                // console.log(masCoords[i]);
//                 if(masCoords[i][0] !== -1){
//                         bg_context.lineWidth = range_stick.value * 2;
//                         bg_context.strokeStyle = '#fff';
                        
//                         if(masCoords[i-1][0] !== -1)
//                         {bg_context.moveTo(masCoords[i][0], masCoords[i][1]);
//                         bg_context.lineTo(masCoords[i-1][0], masCoords[i-1][1]);}
//                             else 
//                                 continue;
//                         bg_context.stroke(); 
//                         bg_context.beginPath();
                        

//                     }
//                     else {
//                         let masStepBackForServer = masCoords.slice(i+1,masCoords.length-1);
//                         console.log(masStepBackForServer);
//                         masCoords.splice(i+1, masCoords.length);
                        
//                         socket.emit('penStepBackForServer', masStepBackForServer);
//                         coordsForLocalStorage = masCoords;
//                         // console.log(masCoords);
//                         localStorage.setItem('coordsForLocalStorage', JSON.stringify(masCoords));
//                         break;
//                     } 

//                 }
//                 bg_context.strokeStyle = 'black';
//                 bg_context.lineWidth = range_stick.value;
                
//             let devider = 0;
//             for (let i = masCoords.length - 1; i > 1; i--)
//                 if (masCoords[i][0] == -1) devider++;
//             if (devider == 0) {
//                 masCoords = [];
//                 localStorage.setItem('coordsForLocalStorage', JSON.stringify(masCoords));
//             }

//         });    
//     let penId = "pen",
//         lineId = "line",
//         circleId = "circle",
//         chosenToolId = "pen",
//         startX = 0,
//         startY = 0,
//         endX = 0,
//         endY = 0,
//         coordsToServer = [];
//         let sendLineCoordsToServer = false,
//         sendCircleCoordsToServer = false,
//         sendCoordsForLocalStorage = false,
//         coordsForLocalStorage = [[-1,-1]],
//         tools = document.querySelector('.tools'),
//         tool = document.querySelectorAll('.tool');

//         tools.addEventListener('click', function(e){
//                 tool.forEach(function(tool){
//                     if (tool.parentNode.classList.contains('active'))
//                         tool.parentNode.classList.remove('active');
//                 });
                
//                 if (e.target.classList.contains('tool')){
//                     e.target.parentNode.classList.add('active');
//                     chosenToolId = e.target.id;
//                 }
//         });
//     let mouseDown = false;
//         fg_canvas.addEventListener('mousedown', function(e){
//                 mouseDown = true;
//                 startX = e.offsetX==undefined?e.layerX:e.offsetX;
//                 startY = e.offsetY==undefined?e.layerY:e.offsetY;
//         });
//         fg_canvas.addEventListener('mouseup', function(e){
//                 coordsToServer = [];
//                 mouseDown = false;
//                 endX = e.offsetX==undefined?e.layerX:e.offsetX;
//                 endY = e.offsetY==undefined?e.layerY:e.offsetY;
//         });
//         fg_canvas.addEventListener('mousemove', function(e){
//                 bg_context.lineWidth = range_stick.value;
//                 fg_context.lineWidth = range_stick.value;
//                 switch(chosenToolId){
//                     case penId:
//                         if (mouseDown) {
//                             sendCoordsForLocalStorage = true;
//                             coordsToServer.push([e.offsetX==undefined?e.layerX:e.offsetX, e.offsetY==undefined?e.layerY:e.offsetY]);
//                             socket.emit('penToServer', {
//                                 lineWidth: range_stick.value,
//                                 coords: coordsToServer
//                             });
//                             coordsForLocalStorage.push([e.offsetX==undefined?e.layerX:e.offsetX, e.offsetY==undefined?e.layerY:e.offsetY]);
//                             bg_context.lineTo(e.offsetX==undefined?e.layerX:e.offsetX, e.offsetY==undefined?e.layerY:e.offsetY);
//                             bg_context.stroke();
//                             // bg_context.arc(e.offsetX==undefined?e.layerX:e.offsetX, e.offsetY==undefined?e.layerY:e.offsetY, bg_context.lineWidth, 0, 2*Math.PI);
//                             // bg_context.stroke();
//                             bg_context.beginPath();
//                             bg_context.moveTo(e.offsetX==undefined?e.layerX:e.offsetX, e.offsetY==undefined?e.layerY:e.offsetY);
//                         }
//                             else{
//                                 if(sendCoordsForLocalStorage){
//                                     coordsForLocalStorage.push([-1,-1]);
//                                     localStorage.setItem('coordsForLocalStorage', JSON.stringify(coordsForLocalStorage));  
//                                     sendCoordsForLocalStorage = false;
//                                 } 
//                                 bg_context.beginPath();
//                             }       
//                         break;
//                     case lineId:                      
//                         let line = new Line(startX, startY, e.offsetX==undefined?e.layerX:e.offsetX, e.offsetY==undefined?e.layerY:e.offsetY);
//                         // let line = new Line(startX, startY, endX, endY);
//                         if (mouseDown){
//                             sendLineCoordsToServer = true;
//                             bg_context.beginPath();    
//                             bg_context.moveTo(line.startX, line.startY);
//                             fg_context.beginPath();
//                             fg_context.moveTo(line.startX, line.startY); 
//                             fg_context.lineTo(line.endX, line.endY);
//                             clearCanvas(fg_canvas, fg_context);  
//                             fg_context.stroke(); 
                                    
//                          }
//                             else {   
//                                 if (sendLineCoordsToServer){                           
//                                 bg_context.lineTo(line.endX, line.endY);
//                                 bg_context.stroke();
//                                 bg_context.beginPath();
//                                 socket.emit('lineToServer', {
//                                     lineWidth: range_stick.value,
//                                     startX: startX, 
//                                     startY: startY,
//                                     endX: endX,
//                                     endY: endY
//                                 }); 
//                                     sendLineCoordsToServer = false;
//                                 }
//                                 startX = 0;
//                                 startY = 0;
//                                 endX = 0;
//                                 endY = 0;
//                                 clearCanvas(fg_canvas, fg_context);
                                
//                             } 
//                         break;
//                     case circleId:
//                         var r = 0;
//                         var circle = new Circle();
//                         if (mouseDown) {
//                             sendCircleCoordsToServer = true;
//                             r = Math.sqrt(Math.pow(e.offsetX==undefined?e.layerX:e.offsetX-startX,2) + Math.pow(e.offsetY==undefined?e.layerY:e.offsetY-startY,2));
//                             circle.centerX = startX;
//                             circle.centerY = startY;
//                             circle.r = r;
//                             circle.startAngle = 0;
//                             circle.endAngle = 2*Math.PI;
//                                                         // circle = new Circle(startX, startY, r, 0, 2*Math.PI);
//                             bg_context.beginPath();
//                             bg_context.arc(circle.centerX, circle.centerY, circle.r, circle.startAngle, circle.endAngle);
//                             fg_context.beginPath();
//                             fg_context.arc(circle.centerX, circle.centerY, circle.r, circle.startAngle, circle.endAngle);
//                             clearCanvas(fg_canvas, fg_context); 
//                             fg_context.stroke();
                                                   
//                         }
//                         else {
//                                 if (sendCircleCoordsToServer){
//                                     clearCanvas(fg_canvas, fg_context); 
//                                     circle.centerX = startX;
//                                     circle.centerY = startY;
//                                     circle.r = Math.sqrt(Math.pow(endX-startX,2) + Math.pow(endY-startY,2));
//                                     circle.startAngle = 0;
//                                     circle.endAngle = 2*Math.PI;
//                                     bg_context.stroke();
//                                     bg_context.beginPath();
//                                     socket.emit('circleToServer', {
//                                         lineWidth: range_stick.value,
//                                         centerX: circle.centerX, 
//                                         centerY: circle.centerY, 
//                                         r: circle.r, 
//                                         start: circle.startAngle, 
//                                         end: circle.endAngle
//                                     });
//                                 }
//                                 // startX = 0;
//                                 // startY = 0;
//                                 // endX = 0;
//                                 // endX = 0;
//                                 sendCircleCoordsToServer = false;
                                
//                             }   
//                         break;     
//                         default:
//                             if (mouseDown) {                        
//                                 bg_context.lineTo(e.offsetX==undefined?e.layerX:e.offsetX, e.offsetY==undefined?e.layerY:e.offsetY);
//                                 bg_context.stroke();
//                                 bg_context.beginPath();
//                                 bg_context.moveTo(e.offsetX==undefined?e.layerX:e.offsetX, e.offsetY==undefined?e.layerY:e.offsetY);
//                             }
//                                 else{
//                                     if (sendCircleCoordsToServer)
//                                         bg_context.beginPath();
//                                 }    
//                 }
//         });    

//         socket.on('penToClients', function(data){
//             bg_context.lineWidth = data.lineWidth;
//             let drawCoords = data.coords;
//             for (let i = 0; i < drawCoords.length - 2; i++){
//                 bg_context.beginPath();
//                 bg_context.moveTo(drawCoords[i][0], drawCoords[i][1]);
//                 bg_context.lineTo(drawCoords[i+1][0], drawCoords[i+1][1]);
//                 bg_context.stroke();   
//             }
//         });
//         socket.on('lineToClients', function(data){
//             bg_context.lineWidth = data.lineWidth;
//             bg_context.beginPath();
//             bg_context.moveTo(data.startX, data.startY);
//             bg_context.lineTo(data.endX, data.endY);
//             bg_context.stroke();
//             bg_context.beginPath();
            
//         });
//         socket.on('clearCanvas', function(){
//             clearCanvas(bg_canvas, bg_context);
//         });
//         // socket.on('broadcast', function(count){
//         //     let usersCount = document.querySelector('.countOfUsers');

//         //         usersCount.textContent = count;
//         // });
//         socket.on('circleToClients', function(data){
//             console.log(data);
//             bg_context.lineWidth = data.lineWidth;
//             bg_context.beginPath();
//             bg_context.arc(data.centerX, data.centerY, data.r, data.start, data.end);
//             bg_context.stroke();

//         });
//         socket.on('penStepBackForClients',function(data){
//             console.log(data[0][0]);
//             for (let i = data.length-1; i > 1; i--){
//                 bg_context.lineWidth = range_stick.value;
//                 bg_context.strokeStyle = "#fff";
//                 bg_context.beginPath();
//                 bg_context.moveTo(data[i][0], data[i][1]);
//                 bg_context.lineTo(data[i-1][0], data[i-1][1]);
//                 bg_context.stroke();
//                 bg_context.strokeStyle = "black";
                
//             }
//         });
//         socket.on('broadcast', function(path){
//                 console.log("принял" + path);
               
//                 var img = new Image();
//                     img.src = path;
//                     img.width = 300;
//                     img.height = 300;
//                     console.log(img);
//                     setTimeout(function(){
//                         bg_context.drawImage(img, 0, 0);
//                     },200);
                    
                    

//         });

//         let input_file = document.getElementById('input_file'),
//         formUpload = document.forms.namedItem('formUpload');
        
//         formUpload.addEventListener('submit', function(e){
            
//             e.preventDefault();

//                 let fileData = new FormData(formUpload);
//                 let request = new XMLHttpRequest();
//                 request.open("POST", '/upload', true);
//                 request.onreadystatechange = function(){
//                     console.log(request.readyState);
//                     if(request.readyState == 4)
//                         setTimeout(function(){
//                             socket.emit('imageDrawForServer');
//                         },200);
                        
                    
//                 };
//                 request.send(fileData);
//         });
// };