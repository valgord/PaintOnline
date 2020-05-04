window.onload = function(){
    let socket = io();
    let bg_canvas = document.getElementById('bg_canvas');
    let fg_canvas = document.getElementById('fg_canvas');
    let bg_context = bg_canvas.getContext('2d'),
        fg_context = fg_canvas.getContext('2d'),
        range_stick = document.getElementById('range_stick'),
        range_value = document.querySelector('.range_value');
        range_stick.addEventListener('input', function(){
            range_value.textContent = range_stick.value; 
        });
    //let canv = document.querySelector('.canvas');    
        socket.on('broadcast', function(count){
            let usersCount = document.querySelector('.countOfUsers');

                usersCount.textContent = count;
        });
    let clearCanv = document.getElementById('clearCanvas');
        clearCanv.addEventListener('click', () => {
            clearCanvas(bg_canvas, bg_context);
            socket.emit('clearCanvas');
        });
        function clearCanvas(canvas, context){
            context.clearRect(0, 0, canvas.width, canvas.height);    
        }
    let stepBack = document.getElementById('back');
        stepBack.addEventListener('click', ()=>{
            let masCoords = JSON.parse(localStorage.getItem('coords'));
            console.log(masCoords);
            for (let i = masCoords.length - 2; i >-1; i--){
                    if (masCoords[i][0] !== -1) {
                        bg_context.beginPath();
                        bg_context.arc(masCoords[i][0],masCoords[i][1], range_stick.value * 1.1 ,0, 2*Math.PI);;
                        bg_context.fillStyle = "white";
                        bg_context.fill();     
                    }
                    else {
                        masCoords.splice(i, masCoords.length);
                        localStorage.setItem('coords', JSON.stringify(masCoords));
                        break;
                    }                
            }
        });    
    let penId = 1,
        lineId = 2,
        circleId = 3,
        chosenToolId = 1,
        startX = 0,
        startY = 0,
        endX = 0,
        endY = 0,
        coords = [];//координаты точек,по которым рисуем линии. Нужно для сохранения в localstorage.
        coordsToServer = [];
        menu = document.querySelector('.menu');
        menu.addEventListener('click', function(e){
                if (e.target.classList.contains('btn')){
                    if (e.target.value)
                    chosenToolId = +e.target.value;
                }
        });
    let mouseDown = false;
        fg_canvas.addEventListener('mousedown', function(e){
                mouseDown = true;
                startX = e.offsetX==undefined?e.layerX:e.offsetX;
                startY = e.offsetY==undefined?e.layerY:e.offsetY;
        });
        fg_canvas.addEventListener('mouseup', function(e){
                coordsToServer = [];
                mouseDown = false;
                endX = e.offsetX==undefined?e.layerX:e.offsetX;
                endY = e.offsetY==undefined?e.layerY:e.offsetY;
                coords.push([-1, -1]);
                localStorage.setItem('coords', JSON.stringify(coords));
        });
        fg_canvas.addEventListener('mousemove', function(e){
                bg_context.lineWidth = range_stick.value;
                fg_context.lineWidth = range_stick.value;
                switch(chosenToolId){
                    case penId:
                        if (mouseDown) {
                            coordsToServer.push([e.offsetX==undefined?e.layerX:e.offsetX, e.offsetY==undefined?e.layerY:e.offsetY]);
                            socket.emit('penToServer', {
                                lineWidth: range_stick.value,
                                coords: coordsToServer
                            });
                            coords.push([e.offsetX==undefined?e.layerX:e.offsetX, e.offsetY==undefined?e.layerY:e.offsetY]);
                            bg_context.lineTo(e.offsetX==undefined?e.layerX:e.offsetX, e.offsetY==undefined?e.layerY:e.offsetY);
                            bg_context.stroke();
                            // bg_context.arc(e.offsetX==undefined?e.layerX:e.offsetX, e.offsetY==undefined?e.layerY:e.offsetY, bg_context.lineWidth/1.5, 0, 2*Math.PI);
                            // bg_context.stroke();
                            bg_context.beginPath();
                            bg_context.moveTo(e.offsetX==undefined?e.layerX:e.offsetX, e.offsetY==undefined?e.layerY:e.offsetY);
                        }
                            else{

                                bg_context.beginPath();
                            }       
                        break;
                    case lineId:
                        let line = new Line(startX, startY, e.offsetX==undefined?e.layerX:e.offsetX, e.offsetY==undefined?e.layerY:e.offsetY);
                        // let line = new Line(startX, startY, endX, endY);
                        if (mouseDown){
                            bg_context.beginPath();    
                            bg_context.moveTo(line.startX, line.startY);
                            fg_context.beginPath();
                            fg_context.moveTo(line.startX, line.startY); 
                            fg_context.lineTo(line.endX, line.endY);
                            clearCanvas(fg_canvas, fg_context);  
                            fg_context.stroke(); 
                                    
                         }
                            else {
                                bg_context.lineTo(line.endX, line.endY);
                                bg_context.stroke();
                                bg_context.beginPath();
                                socket.emit('lineToServer', {
                                    lineWidth: range_stick.value,
                                    startX: startX, 
                                    startY: startY,
                                    endX: endX,
                                    endY: endY
                                });
                                startX = 0;
                                startY = 0;
                                endX = 0;
                                endY = 0;
                                clearCanvas(fg_canvas, fg_context);
                                
                            } 
                        break;
                    case circleId:
                        if (mouseDown) {
                            let r = Math.sqrt(Math.pow(e.offsetX==undefined?e.layerX:e.offsetX-startX,2) + Math.pow(e.offsetY==undefined?e.layerY:e.offsetY-startY,2));
                            let circle = new Circle(startX, startY, r, 0, 2*Math.PI);
                            bg_context.beginPath();
                            bg_context.arc(circle.centerX, circle.centerY, circle.r, circle.startAngle, circle.endAngle);
                            fg_context.beginPath();
                            fg_context.arc(circle.centerX, circle.centerY, circle.r, circle.startAngle, circle.endAngle);
                            clearCanvas(fg_canvas, fg_context); 
                            fg_context.stroke();
                                                   
                        }
                        else {
                                clearCanvas(fg_canvas, fg_context); 
                                bg_context.stroke();
                                bg_context.beginPath();
                            }   
                        break;     
                        default:
                            if (mouseDown) {                        
                                bg_context.lineTo(e.offsetX==undefined?e.layerX:e.offsetX, e.offsetY==undefined?e.layerY:e.offsetY);
                                bg_context.stroke();
                                bg_context.beginPath();
                                bg_context.moveTo(e.offsetX==undefined?e.layerX:e.offsetX, e.offsetY==undefined?e.layerY:e.offsetY);
                            }
                                else{
                                    bg_context.beginPath();
                                }    
                           

                }
                // if(chosenToolId == penId){
                //     if (mouseDown) {
                        
                //         bg_context.lineTo(e.offsetX==undefined?e.layerX:e.offsetX, e.offsetY==undefined?e.layerY:e.offsetY);
                //         bg_context.stroke();
                //         bg_context.beginPath();
                //         bg_context.moveTo(e.offsetX==undefined?e.layerX:e.offsetX, e.offsetY==undefined?e.layerY:e.offsetY);
                //     }
                //         else{
                //             bg_context.beginPath();
                //         }                  
                // }
                // else if (chosenToolId == lineId ){
                //     let line = new Line(startX, startY, e.offsetX==undefined?e.layerX:e.offsetX, e.offsetY==undefined?e.layerY:e.offsetY);
                //         if (mouseDown){
                        
                //         bg_context.beginPath();    
                //         bg_context.moveTo(line.startX, line.startY);
                //         fg_context.beginPath();
                //         fg_context.moveTo(line.startX, line.startY); 
                        
                //         fg_context.lineTo(line.endX, line.endY);
                //         clearCanvas(fg_canvas, fg_context);  
                //         fg_context.stroke();
                        
                                       
                //     }
                //     else {
                //         bg_context.lineTo(line.endX, line.endY);
                //         bg_context.stroke();
                //         bg_context.beginPath();
                //         clearCanvas(fg_canvas, fg_context);
                        
                //     }     
                // }
                // else if (chosenToolId == circleId){
                //     if (mouseDown) {
                //         let r = Math.sqrt(Math.pow(e.offsetX==undefined?e.layerX:e.offsetX-startX,2) + Math.pow(e.offsetY==undefined?e.layerY:e.offsetY-startY,2));
                //         let circle = new Circle(startX, startY, r, 0, 2*Math.PI);
                //         bg_context.beginPath();
                //         bg_context.arc(circle.centerX, circle.centerY, circle.r, circle.startAngle, circle.endAngle);
                //         fg_context.beginPath();
                //         fg_context.arc(circle.centerX, circle.centerY, circle.r, circle.startAngle, circle.endAngle);
                //         clearCanvas(fg_canvas, fg_context); 
                //         fg_context.stroke();
                                               
                //     }
                //     else
                //         {
                //             clearCanvas(fg_canvas, fg_context); 
                //             bg_context.stroke();
                //             bg_context.beginPath();
                //         }
                // }

        });    

        socket.on('penToClients', function(data){
            bg_context.lineWidth = data.lineWidth;
            let drawCoords = data.coords;
            for (let i = 0; i < drawCoords.length - 2; i++){
                bg_context.beginPath();
                bg_context.moveTo(drawCoords[i][0], drawCoords[i][1]);
                bg_context.lineTo(drawCoords[i+1][0], drawCoords[i+1][1]);
                bg_context.stroke();
                
            }
        });
        socket.on('lineToClients', function(data){
            bg_context.lineWidth = data.lineWidth;
            console.log(data);
            bg_context.beginPath();
            bg_context.moveTo(data.startX, data.startY);
            bg_context.lineTo(data.endX, data.endY);
            bg_context.stroke();
            bg_context.beginPath();
            
        });
        socket.on('clearCanvas', function(){
            clearCanvas(bg_canvas, bg_context);
        });
};