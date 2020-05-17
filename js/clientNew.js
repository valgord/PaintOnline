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
    let clearCanv = document.getElementById('clearCanvas');
        clearCanv.addEventListener('click', () => {
            clearCanvas(bg_canvas, bg_context);
            myObjects = new ObjectForDrawing();
            objectsFromOthers = new ObjectForDrawing();
            socket.emit('clearCanvas');
        });
        function clearCanvas(canvas, context){
            context.clearRect(0, 0, canvas.width, canvas.height);    
        }


    let start = new Point(100, 100),
        finish = new Point(-1,-1),
        penId = "pen",
        lineId = "line",
        circleId = "circle",
        rectId = 'rectangle',
        isosTriangleId = 'isoscelesTriangle';
        chosenToolId = "pen";
        let tools = document.querySelector('.tools');
        let tool = document.querySelectorAll('.tool');
        tools.addEventListener('click', function(e){
                tool.forEach(function(tool){
                    if (tool.parentNode.classList.contains('active'))
                        tool.parentNode.classList.remove('active');
                });
                
                if (e.target.classList.contains('tool')){
                    e.target.parentNode.classList.add('active');
                    chosenToolId = e.target.id;
                }
        });    
    let objects = [];        
    let mouseDown = false;
    let mouseDownFlag = false;
    let coords = [];
    let myObjects = new ObjectForDrawing();
    let objectsFromOthers = new ObjectForDrawing();
    let curve = new Curve();   
    let curveFromOthers = new Curve(); 
    let stepBack = document.getElementById('back');
    let shiftLeftIsDown = false;
    let input_file = document.getElementById('input_file'),
        formUpload = document.forms.namedItem('formUpload');
    stepBack.addEventListener('click', function(){
        myObjects.removeLast();
        clearCanvas(bg_canvas, bg_context);
        myObjects.draw(bg_context);
        objectsFromOthers.draw(bg_context);
        socket.emit('stepBackForServer', "ok");
    });  
    document.addEventListener('keydown', function(e){
        if (e.code == 'ShiftLeft') console.log('Левый шифт нажат');
        shiftLeftIsDown = true;
    });
    document.addEventListener('keyup', function(e){
        if (e.code == 'ShiftLeft') console.log('Левый шифт отпущен');
        shiftLeftIsDown = false;
    });
    fg_canvas.addEventListener('mousedown', function(e){
        mouseDown = true;
        start = getMousePosition(e);        
    });
    fg_canvas.addEventListener('mouseup', function(e){
        mouseDown = false;
        finish = getMousePosition(e);
    });
    fg_canvas.addEventListener('mousemove', function(e){
            bg_context.lineWidth = range_stick.value;
            fg_context.lineWidth = range_stick.value;
            switch(chosenToolId){
                case lineId:
                    let line = new Line(start, finish, range_stick.value);
                    let tmpLine = new Line(start, finish, range_stick.value);
                    if (mouseDown)
                        {
                            line.start = start;
                            tmpLine.start = start;
                            tmpLine.finish = getMousePosition(e);
                            clearCanvas(fg_canvas, fg_context);
                            if (shiftLeftIsDown){
                                tmpLine.reCalculateFinish();
                                tmpLine.draw(fg_context);
                                socket.emit('tmpLineDrawingWithShiftToServer', tmpLine);
                            }                                
                                else{
                                    tmpLine.draw(fg_context);
                                    socket.emit('tmpLineDrawingToServer', tmpLine);
                                }
                                    
                            mouseDownFlag = true;
                        }
                     else {
                        clearCanvas(fg_canvas, fg_context); 
                         if (mouseDownFlag){
                            line.finish = finish;
                            if (shiftLeftIsDown){
                                line.reCalculateFinish();
                                line.draw(bg_context);
                                socket.emit('sendLineWithShiftToServer', line);
                            }
                                else {
                                    line.draw(bg_context);
                                    socket.emit('sendLineToServer', line);
                                }
                                                                 
                            mouseDownFlag = false;
                            myObjects.add(line);
                         }
                     }  
                    break;
                case penId:                    
                    let linePartOfCurve = new Line(start, finish, range_stick.value);
                    if (mouseDown){                       
                        let p = getMousePosition(e);
                        linePartOfCurve.start = p;
                        linePartOfCurve.finish = p;
                        coords.push(p);
                        if (coords.length > 1){
                            linePartOfCurve.start = coords[coords.length-2];
                            linePartOfCurve.finish = coords[coords.length-1];
                            linePartOfCurve.draw(bg_context);
                            socket.emit('linePartOfCurveToServer', linePartOfCurve);
                            curve.add(linePartOfCurve); 
                        }
                        mouseDownFlag = true;                        
                    }
                    else
                        if(mouseDownFlag){
                                myObjects.add(curve);
                                socket.emit('curveIsDoneForServer');
                            // objects.push(curve);
                                coords = [];
                                curve = new Curve();
                                mouseDownFlag = false;
                        }
                    break;    
                case circleId:
                        if (mouseDown){
                            mouseDownFlag = true;
                            clearCanvas(fg_canvas, fg_context);
                            socket.emit('tmpCircleForServer', {
                                start: start,
                                mousePosition: getMousePosition(e),
                                thickness: range_stick.value
                            });
                            let circleTmp = new Circle(start, getMousePosition(e), range_stick.value);
                            circleTmp.draw(fg_context);
                        }    
                        else {
                            if (mouseDownFlag){
                                let circle = new Circle(start, finish, range_stick.value);
                                socket.emit('commitCircleForServer', {
                                    start: start,
                                    finish: finish,
                                    thickness: range_stick.value
                                });
                                myObjects.add(circle);
                                mouseDownFlag = false;
                                clearCanvas(fg_canvas, fg_context);
                                circle.draw(bg_context);
                                
                            }
                        }
                        break;
                case rectId:
                    if (mouseDown){
                        mouseDownFlag = true;
                        clearCanvas(fg_canvas, fg_context);
                        socket.emit('tmpRectForServer', {
                            start: start,
                            mousePosition: getMousePosition(e),
                            thickness: range_stick.value
                        });
                        let rectTmp = new Rectangle(start, getMousePosition(e), range_stick.value);
                        rectTmp.draw(fg_context);
                    }    
                    else {
                        if (mouseDownFlag){
                            let rect = new Rectangle(start, finish, range_stick.value);
                            socket.emit('commitRectForServer', {
                                start: start,
                                finish: finish,
                                thickness: range_stick.value
                            });
                            myObjects.add(rect);
                            mouseDownFlag = false;
                            clearCanvas(fg_canvas, fg_context);
                            rect.draw(bg_context);                           
                        }
                    }
                    break;    
                case isosTriangleId:
                    if (mouseDown){
                        mouseDownFlag = true;
                        clearCanvas(fg_canvas, fg_context);
                        socket.emit('tmpIsoscelesTriangleForServer', {
                            start: start,
                            mousePosition: getMousePosition(e),
                            thickness: range_stick.value
                        });
                        let isosTrTmp = new IsoscelesTriangle(start, getMousePosition(e), range_stick.value);
                        isosTrTmp.draw(fg_context);
                    }    
                    else {
                        if (mouseDownFlag){
                            let isosTr = new IsoscelesTriangle(start, finish, range_stick.value);
                            socket.emit('commitIsoscelesTriangleForServer', {
                                start: start,
                                finish: finish,
                                thickness: range_stick.value
                            });
                            myObjects.add(isosTr);
                            mouseDownFlag = false;
                            clearCanvas(fg_canvas, fg_context);
                            isosTr.draw(bg_context);                           
                        }
                    }
                    break;  
            }               
    });

    socket.on('clearCanvasToClients', function(){
        clearCanvas(bg_canvas, bg_context);
        myObjects = new ObjectForDrawing();
        objectsFromOthers = new ObjectForDrawing();
    });
    socket.on('sendLineToClients', function(line){
        clearCanvas(fg_canvas, fg_context);
        let new_line = new Line(line.start, line.finish, line.thickness);
            new_line.draw(bg_context);
            objectsFromOthers.add(new_line);
    });
    socket.on('tmpLineDrawingToClients', function(line){
        let new_tmpLine = new Line(line.start, line.finish, line.thickness);
        clearCanvas(fg_canvas, fg_context);
        new_tmpLine.draw(fg_context);
    });
    socket.on('tmpLineDrawingWithShiftToClients', function(line){
        let new_tmpLine = new Line(line.start, line.finish, line.thickness);
        clearCanvas(fg_canvas, fg_context);
        new_tmpLine.draw(fg_context);
    });
    socket.on('sendLineWithShiftToClients', function(line){
        clearCanvas(fg_canvas, fg_context);
        let new_line = new Line(line.start, line.finish, line.thickness);
           objectsFromOthers.add(new_line);
            new_line.draw(bg_context);
    });    
    
    socket.on('linePartOfCurveToClient', function(data){
        let my_line  = new Line(data.start, data.finish, data.thickness);
        my_line.draw(bg_context);
        curveFromOthers.add(my_line);
    });
    socket.on('curveIsDoneForClient', function(){
        //myObjects.add(curveFromOthers);
        objectsFromOthers.add(curveFromOthers);
        curveFromOthers = new Curve();
    });

    socket.on('stepBackToClients', function(){
        console.log(objectsFromOthers);
        objectsFromOthers.removeLast();
        clearCanvas(bg_canvas, bg_context);
        myObjects.draw(bg_context);
        objectsFromOthers.draw(bg_context);
    });
    socket.on('broadcast', function(count){
        let usersCount = document.querySelector('.countOfUsers');
        usersCount.textContent = count;
    });
    socket.on('imageDrawForClients', function(path){
        var img = new Image();
        img.src = path;
        img.width = 300;
        img.height = 300;
        console.log(img);
        setTimeout(function(){
            bg_context.drawImage(img, 0, 0);
        },200);
    });
    socket.on('tmpCircleForClients', function(data){
        clearCanvas(fg_canvas, fg_context);
        let tmpCircle = new Circle(data.start, data.mousePosition, data.thickness);
        tmpCircle.draw(fg_context);
    });
    socket.on('commitCircleForClients', function(data){
        clearCanvas(fg_canvas, fg_context);
        let commitedCircle = new Circle(data.start, data.finish, data.thickness);
        commitedCircle.draw(bg_context);
        objectsFromOthers.add(commitedCircle);
    });
    socket.on('tmpRectForClients', function(data){
        clearCanvas(fg_canvas, fg_context);
        let tmpRect = new Rectangle(data.start, data.mousePosition, data.thickness);
        tmpRect.draw(fg_context);
    });
    
    socket.on('commitRectForClients', function(data){
        clearCanvas(fg_canvas, fg_context);
        let commitedRect = new Rectangle(data.start, data.finish, data.thickness);
        commitedRect.draw(bg_context);
        objectsFromOthers.add(commitedRect);
    });
    socket.on('tmpIsoscelesTriangleForClients', function(data){
        clearCanvas(fg_canvas, fg_context);
        let tmpIsosTr = new IsoscelesTriangle(data.start, data.mousePosition, data.thickness);
        tmpIsosTr.draw(fg_context);
    });
    socket.on('commitIsoscelesTriangleForClients', function(data){
        clearCanvas(fg_canvas, fg_context);
        let commitedIsosTr = new IsoscelesTriangle(data.start, data.finish, data.thickness);
        commitedIsosTr.draw(bg_context);
        objectsFromOthers.add(commitedIsosTr);
    });


    
    formUpload.addEventListener('submit', function(e){
        e.preventDefault();
        console.log(document.getElementById("input_file").files[0]);
            // let fileData = new FormData(formUpload);
            // let request = new XMLHttpRequest();
            // request.open("POST", '/upload', true);
            // request.onreadystatechange = function(){
            //     console.log(request.readyState);
            //     if(request.readyState == 4)
            //         setTimeout(function(){
            //             socket.emit('imageDrawForServer');
            //         },200);        
            // };
            // request.send(fileData);
    });
};