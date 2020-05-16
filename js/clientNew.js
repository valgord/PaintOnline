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
        chosenToolId = "pen",
        tools = document.querySelector('.tools'),
            tool = document.querySelectorAll('.tool');
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
    let input_file = document.getElementById('input_file'),
        formUpload = document.forms.namedItem('formUpload');
    stepBack.addEventListener('click', function(){
        myObjects.removeLast();
        console.log(myObjects);
        clearCanvas(bg_canvas, bg_context);
        myObjects.draw(bg_context);
        objectsFromOthers.draw(bg_context);
        socket.emit('stepBackForServer', "ok");
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
                            tmpLine.draw(fg_context);
                            socket.emit('tmpLineDrawingToServer', tmpLine);
                            mouseDownFlag = true;
                        }
                     else {
                         if (mouseDownFlag){
                            clearCanvas(fg_canvas, fg_context);
                            line.finish = finish;
                            line.draw(bg_context);
                            socket.emit('sendLineToServer', line);
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
            }               
    });



    socket.on('sendLineToClients', function(line){
        let new_line = new Line(line.start, line.finish, line.thickness);
           objectsFromOthers.add(new_line);
            console.log(objectsFromOthers);
            clearCanvas(bg_canvas, bg_context);
            clearCanvas(fg_canvas, fg_context);
            myObjects.draw(bg_context);
            objectsFromOthers.draw(bg_context);
    });
    socket.on('tmpLineDrawingToClients', function(line){
        let new_tmpLine = new Line(line.start, line.finish, line.thickness);
        clearCanvas(fg_canvas, fg_context);
        new_tmpLine.draw(fg_context);
    });

    socket.on('linePartOfCurveToClient', function(data){
        let my_line  = new Line(data.start, data.finish, data.thickness);
        my_line.draw(bg_context);
        curveFromOthers.add(my_line);
    });
    socket.on('curveIsDoneForClient', function(){
        //myObjects.add(curveFromOthers);
        objectsFromOthers.add(curveFromOthers);
        console.log(objectsFromOthers);
        curveFromOthers = new Curve();
    });

    socket.on('stepBackToClients', function(){
        objectsFromOthers.removeLast();
        console.log(objectsFromOthers);
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