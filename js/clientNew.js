window.onload = function(){
    let socket = io();
    let bg_canvas = document.getElementById('bg_canvas');
    let fg_canvas = document.getElementById('fg_canvas');
    let bg_context = bg_canvas.getContext('2d'),
        fg_context = fg_canvas.getContext('2d'),
        range_stick = document.getElementById('range_stick'),
        range_value = document.querySelector('.range_value'),
        //color = document.getElementById('color');
        color = 'black';
        range_stick.addEventListener('input', function(){
            range_value.textContent = range_stick.value; 
        });      
    let clearCanv = document.getElementById('clearCanvas');
        clearCanv.addEventListener('click', () => {
            clearCanvas(bg_canvas, bg_context);
            localStorage.clear();
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
    let myObjectsFromLocalStorage = new ObjectForDrawing();
    if (localStorage.getItem('myObjects') != null){
        myObjectsFromLocalStorage = parseToObjectForDrawing(JSON.parse(localStorage.getItem('myObjects')));
        myObjectsFromLocalStorage.draw(bg_context);
        myObjects = myObjectsFromLocalStorage;
    } 
    if (localStorage.getItem('objectsFromOthers') != null){
        objectsFromOthersFromLocalStorage = parseToObjectForDrawing(JSON.parse(localStorage.getItem('objectsFromOthers')));
        objectsFromOthersFromLocalStorage.draw(bg_context);
        objectsFromOthers = objectsFromOthersFromLocalStorage;
    } 
    let curve = new Curve();   
    let curveFromOthers = new Curve(); 
    let stepBack = document.getElementById('back');
    let shiftLeftIsDown = false;
    let objectsForLocalStorage = [];

    let input_file = document.getElementById('input_file'),
        formUpload = document.forms.namedItem('formUpload');
    stepBack.addEventListener('click', function(){
        myObjects.removeLast();
        console.log(myObjects);
        console.log(objectsFromOthers);
        localStorage.setItem('myObjects', JSON.stringify(myObjects));
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
                    let line = new Line(start, finish, range_stick.value, color.value);
                    let tmpLine = new Line(start, finish, range_stick.value, color.value);
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
                            localStorage.setItem('myObjects', JSON.stringify(myObjects));
                            socket.emit('myObjectsToServer', JSON.stringify(myObjects));
                            console.log(line.color);
                         }
                     }  
                    break;
                case penId:                    
                    let linePartOfCurve = new Line(start, finish, range_stick.value, color.value);
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
                                localStorage.clear();
                                localStorage.setItem('myObjects', JSON.stringify(myObjects));
                                socket.emit('myObjectsToServer', JSON.stringify(myObjects));
                                //socket.emit('curveIsDoneForServer', 'ok');
                            // objects.push(curve);
                                coords = [];
                                curve = new Curve();
                                mouseDownFlag = false;
                        }
                    break;    
                case circleId:
                    let circleRadius = 0;
                    let circleCenter = new Point();
                        if (mouseDown){
                            mouseDownFlag = true;
                            clearCanvas(fg_canvas, fg_context);
                            circleCenter.x = (getMousePosition(e).x + start.x)/2;
                            circleCenter.y = (getMousePosition(e).y + start.y)/2;
                            circleRadius = Math.sqrt(Math.pow(circleCenter.x - start.x,2) + Math.pow(circleCenter.y - start.y,2));
                            console.log(circleCenter); 
                            console.log(circleRadius);
                            socket.emit('tmpCircleForServer', {
                                center: circleCenter,
                                r: circleRadius,
                                thickness: range_stick.value,
                                color: color.value
                            });
                            let circleTmp = new Circle(circleCenter, circleRadius, range_stick.value, color.value);
                            circleTmp.draw(fg_context);
                        }    
                        else {
                            if (mouseDownFlag){
                                circleCenter.x = (finish.x + start.x)/2;
                                circleCenter.y = (finish.y + start.y)/2;
                                circleRadius = Math.sqrt(Math.pow(circleCenter.x - start.x,2) + Math.pow(circleCenter.y - start.y,2));
                                let circle = new Circle(circleCenter, circleRadius, range_stick.value, color.value);
                                socket.emit('commitCircleForServer', {
                                    center: circleCenter,
                                    r: circleRadius,
                                    thickness: range_stick.value,
                                    color: color.value
                                });
                                myObjects.add(circle);
                                localStorage.setItem('myObjects', JSON.stringify(myObjects));
                                socket.emit('myObjectsToServer', JSON.stringify(myObjects));
                                mouseDownFlag = false;
                                clearCanvas(fg_canvas, fg_context);
                                circle.draw(bg_context);
                                
                            }
                        }
                        break;
                case rectId:
                    let width = 0;
                    let height = 0;
                    if (mouseDown){
                        mouseDownFlag = true;
                        clearCanvas(fg_canvas, fg_context);
                        width = getMousePosition(e).x - start.x;
                        height = getMousePosition(e).y - start.y;
                        socket.emit('tmpRectForServer', {
                            start: start,
                            width: width,
                            height: height,
                            thickness: range_stick.value
                        });
                        let rectTmp = new Rectangle(start, width, height, range_stick.value, color.value);
                        rectTmp.draw(fg_context);
                    }    
                    else {
                        if (mouseDownFlag){
                            width = finish.x - start.x;
                            height = finish.y - start.y;
                            let rect = new Rectangle(start, width, height, range_stick.value, color.value);
                            socket.emit('commitRectForServer', {
                                start: start,
                                width: width,
                                height: height,
                                thickness: range_stick.value,
                                color: color.value
                            });
                            myObjects.add(rect);
                            localStorage.setItem('myObjects', JSON.stringify(myObjects));
                            socket.emit('myObjectsToServer', JSON.stringify(myObjects));                              
                            mouseDownFlag = false;
                            clearCanvas(fg_canvas, fg_context);
                            rect.draw(bg_context);                           
                        }
                    }
                    break;    
                case isosTriangleId:
                    if (mouseDown){
                        mouseDownFlag = true;
                        let curPoint = getMousePosition(e);
                        let pointA = new Point(start.x, start.y);
                        let pointB = new Point((start.x + curPoint.x)/2, curPoint.y);
                        let pointC = new Point(curPoint.x, start.y); 
                        clearCanvas(fg_canvas, fg_context);
                        socket.emit('tmpIsoscelesTriangleForServer', {
                            pointA: pointA,
                            pointB: pointB,
                            pointC: pointC,
                            thickness: range_stick.value
                        });
                        let isosTrTmp = new IsoscelesTriangle(pointA, pointB, pointC, range_stick.value, color.value);
                        isosTrTmp.draw(fg_context);
                    }    
                    else {
                        if (mouseDownFlag){
                            let pointA = new Point(start.x, start.y);
                            let pointB = new Point((start.x + finish.x)/2, finish.y);
                            let pointC = new Point(finish.x, start.y); 
                            let isosTr = new IsoscelesTriangle(pointA, pointB, pointC, range_stick.value, color.value);
                            socket.emit('commitIsoscelesTriangleForServer', {
                                pointA: pointA,
                                pointB: pointB,
                                pointC: pointC,
                                thickness: range_stick.value,
                                color: color.value
                            });
                            myObjects.add(isosTr);
                            localStorage.setItem('myObjects', JSON.stringify(myObjects));
                            socket.emit('myObjectsToServer', JSON.stringify(myObjects));                          
                            mouseDownFlag = false;
                            clearCanvas(fg_canvas, fg_context);
                            isosTr.draw(bg_context);  
                            console.log(myObjects);                              
                        }
                    }
                    break;  
            }               
    });
    socket.on('clearCanvasToClients', function(){
        clearCanvas(bg_canvas, bg_context);
        myObjects = new ObjectForDrawing();
        objectsFromOthers = new ObjectForDrawing();
        localStorage.clear();
    });
    socket.on('sendLineToClients', function(line){
        clearCanvas(fg_canvas, fg_context);
        let new_line = new Line(line.start, line.finish, line.thickness, line.color);
            new_line.draw(bg_context);
            objectsFromOthers.add(new_line);
    });
    socket.on('tmpLineDrawingToClients', function(line){
        let new_tmpLine = new Line(line.start, line.finish, line.thickness, line.color);
        clearCanvas(fg_canvas, fg_context);
        new_tmpLine.draw(fg_context);
    });
    socket.on('tmpLineDrawingWithShiftToClients', function(line){
        let new_tmpLine = new Line(line.start, line.finish, line.thickness, line.color);
        clearCanvas(fg_canvas, fg_context);
        new_tmpLine.draw(fg_context);
    });
    socket.on('sendLineWithShiftToClients', function(line){
        clearCanvas(fg_canvas, fg_context);
        let new_line = new Line(line.start, line.finish, line.thickness, line.color);
           objectsFromOthers.add(new_line);
            new_line.draw(bg_context);
    });    
    
    socket.on('linePartOfCurveToClient', function(data){
        let my_line  = new Line(data.start, data.finish, data.thickness, data.color);
        my_line.draw(bg_context);
        curveFromOthers.add(my_line);
    });
    socket.on('curveIsDoneForClient', function(data){
    curveFromOthers = new Curve();
    });

    socket.on('stepBackToClients', function(data){
        console.log(objectsFromOthers);
        objectsFromOthers.removeLast();
        console.log(objectsFromOthers);
        localStorage.setItem('objectsFromOthers', JSON.stringify(objectsFromOthers));
        clearCanvas(bg_canvas, bg_context);
        myObjects.draw(bg_context);
        objectsFromOthers.draw(bg_context);
    });
    socket.on('broadcast', function(data){
        let usersCount = document.querySelector('.countOfUsers');
        usersCount.textContent = data.count;
    });
    socket.on('imageDrawForClients', function(path){
        var img = new Image();
        img.src = path;
        console.log(img);
        bg_context.drawImage(img, 0, 0, 500, 700);
    });
    socket.on('tmpCircleForClients', function(data){
        clearCanvas(fg_canvas, fg_context);
        let tmpCircle = new Circle(data.center, data.r, data.thickness, data.color);
        tmpCircle.draw(fg_context);
    });
    socket.on('commitCircleForClients', function(data){
        clearCanvas(fg_canvas, fg_context);
        let commitedCircle = new Circle(data.center, data.r, data.thickness, data.color);
        commitedCircle.draw(bg_context);
        objectsFromOthers.add(commitedCircle);
    });
    socket.on('tmpRectForClients', function(data){
        clearCanvas(fg_canvas, fg_context);
        let tmpRect = new Rectangle(data.start, data.width, data.height, data.thickness, data.color);
        tmpRect.draw(fg_context);
    });
    
    socket.on('commitRectForClients', function(data){
        clearCanvas(fg_canvas, fg_context);
        let commitedRect = new Rectangle(data.start, data.width, data.height, data.thickness, data.color);
        commitedRect.draw(bg_context);
        objectsFromOthers.add(commitedRect);
    });
    socket.on('tmpIsoscelesTriangleForClients', function(data){
        clearCanvas(fg_canvas, fg_context);
        let tmpIsosTr = new IsoscelesTriangle(data.pointA, data.pointB, data.pointC, data.thickness, data.color);
        tmpIsosTr.draw(fg_context);
    });
    socket.on('commitIsoscelesTriangleForClients', function(data){
        clearCanvas(fg_canvas, fg_context);
        let commitedIsosTr = new IsoscelesTriangle(data.pointA, data.pointB, data.pointC, data.thickness, data.color);
        commitedIsosTr.draw(bg_context);
        objectsFromOthers.add(commitedIsosTr);
    });
    socket.on('objectsFromOthersToClients', function(data){
        console.log("info");
        let obj = new parseToObjectForDrawing(JSON.parse(data));
        objectsFromOthers = obj;
        localStorage.setItem('objectsFromOthers', JSON.stringify(objectsFromOthers));
    });  

    formUpload.addEventListener('submit', function(e){
        e.preventDefault();
        let pr = new Promise(function(resolve, reject){
            let fileData = new FormData(formUpload);
            let xhr = new XMLHttpRequest();
            xhr.open("POST", '/upload', true);
            xhr.onload = () => {
                resolve(xhr.response);
            };
            xhr.send(fileData);
            
        });
        pr.then(data => {
            var img = new Image();
            img.src = data;
            bg_context.drawImage(img, 0, 0, 500, 700) ;
            socket.emit('imageDrawForServer');
            // setTimeout(() => {
                
            // }, 200);
            
            console.log(img);
            console.log(data);
        }).catch(function(err){
            console.log(err);            
        });        
        // console.log(document.getElementById("input_file").files[0]);
        // let pr = new Promise(function(resolve, reject){
        //     let fileData = new FormData(formUpload);
        //     let xhr = new XMLHttpRequest();
        //     xhr.open("POST", '/upload', true);
        //     xhr.onreadystatechange = function(){
        //         console.log(xhr.readyState);
        //         if(xhr.readyState == 4)
        //             resolve(xhr.response);
        //     };
        //     xhr.send(fileData);
        //     xhr.onload = () => console.log(xhr.response);
        // });
        // pr.then(data => {
        //     var img = new Image();
        //     img.src = data;
        //     bg_context.drawImage(img, 0, 0, 500, 900);
        //     console.log(img.src);
        //     console.log(data);
        // }).catch(function(err){
        //     console.log(err);            
        // });

        
    });
    socket.on('imageDrawingIsAllowed', function(){
        var img = new Image();
        img.src = `/uploadedImages/${document.getElementById("input_file").files[0].name}`;
        console.log(img);
        setTimeout(function(){
            bg_context.drawImage(img, 0, 0, 500, 700);
        },200);
    });

};