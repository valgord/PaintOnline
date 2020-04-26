window.addEventListener("load",function(){
    let bg_canvas = document.getElementById('bg_canvas');
        bg_canvas.width = 1000;
        bg_canvas.height = 500;
    let fg_canvas = document.getElementById('fg_canvas');
        fg_canvas.width = 1000;
        fg_canvas.height = 500;
    let bg_context = bg_canvas.getContext('2d'),
        fg_context = fg_canvas.getContext('2d'),
        range_stick = document.getElementById('range_stick'),
        range_value = document.querySelector('.range_value');
        range_stick.addEventListener('input', function(){
            range_value.textContent = range_stick.value; 
        });
    let clearCanv = document.getElementById('clearCanvas');
        clearCanv.addEventListener('click', () => clearCanvas(bg_canvas, bg_context));
        function clearCanvas(canvas, context){
            context.clearRect(0, 0, canvas.width, canvas.height);    
        }
    let penId = 1,
        lineId = 2,
        circleId = 3,
        chosenToolId = 1,
        startX = 0,
        startY = 0,
        endX = 0,
        endY = 0,
        menu = document.querySelector('.menu');
        menu.addEventListener('click', function(e){
                if (e.target.classList.contains('btn')){
                    if (e.target.value)
                    chosenToolId = e.target.value;
                }
        });
    let mouseDown = false;
        fg_canvas.addEventListener('mousedown', function(e){
                mouseDown = true;
                startX = e.clientX;
                startY = e.clientY;
        });
        fg_canvas.addEventListener('mouseup', function(e){
                mouseDown = false;
                endX = e.clientX+1;
                endY = e.clientY;
        });
        fg_canvas.addEventListener('mousemove', function(e){
                bg_context.lineWidth = range_stick.value;
                fg_context.lineWidth = range_stick.value;
                if(chosenToolId == penId){
                    if (mouseDown) {
                        
                        bg_context.lineTo(e.clientX, e.clientY);
                        bg_context.stroke();
                        bg_context.beginPath();
                        bg_context.moveTo(e.clientX, e.clientY);
                    }
                        else{
                            bg_context.beginPath();
                        }                  
                }
                else if (chosenToolId == lineId ){
                    let line = new Line(startX, startY, e.clientX, e.clientY);
                        if (mouseDown){
                        
                        bg_context.beginPath();    
                        bg_context.moveTo(line.startX, line.startY);
                        fg_context.beginPath();
                        fg_context.moveTo(line.startX, line.startY); 
                        bg_context.lineTo(line.endX, line.endY);
                        fg_context.lineTo(line.endX, line.endY);
                        clearCanvas(fg_canvas, fg_context);  
                        fg_context.stroke();
                        
                                       
                    }
                    else {
                        bg_context.stroke();
                        bg_context.beginPath();
                        
                        clearCanvas(fg_canvas, fg_context);
                        
                    }     
                }
                else if (chosenToolId == circleId){
                    if (mouseDown) {
                        let r = Math.sqrt(Math.pow(e.clientX-startX,2) + Math.pow(e.clientY-startY,2));
                        let circle = new Circle(startX, startY, r, 0, 2*Math.PI);
                        bg_context.beginPath();
                        bg_context.arc(circle.centerX, circle.centerY, circle.r, circle.startAngle, circle.endAngle);
                        fg_context.beginPath();
                        fg_context.arc(circle.centerX, circle.centerY, circle.r, circle.startAngle, circle.endAngle);
                        clearCanvas(fg_canvas, fg_context); 
                        fg_context.stroke();
                                               
                    }
                    else
                        {
                            clearCanvas(fg_canvas, fg_context); 
                            bg_context.stroke();
                            bg_context.beginPath();
                        }
                }

        });
});
