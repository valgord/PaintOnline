
        class ObjectForDrawing{
            constructor(){
                this.arrObjs = [];
            }
            add(obj){
                this.arrObjs.push(obj);
            }
            removeLast(){
                this.arrObjs.splice(this.arrObjs.length-1, 1);
            }
            draw(context){
                this.arrObjs.forEach(function(item){
                    item.draw(context);
                });
            }
        }
        class Point{
            constructor(x, y){
                this.x = x;
                this.y = y;
            }
        }
        class Line {
            constructor(start, finish, thickness, color)
            {
                this.color = color;
                this.start = start;
                this.finish = finish;
                this.thickness = thickness;
            }
            draw(context){
                context.lineWidth = this.thickness;
                context.strokeStyle = this.color;
                context.beginPath();    
                context.moveTo(this.start.x, this.start.y);
                context.lineTo(this.finish.x, this.finish.y);
                context.stroke();
                context.beginPath();
                context.fillStyle = this.color;
                context.arc(this.finish.x, this.finish.y, this.thickness/2, 0, Math.PI*2);
                context.fill();
                
            }
            // drawWithShift(context){
            //     context.beginPath();    
            //     context.moveTo(this.start.x, this.start.y);
            //     let deltaX = this.finish.x - this.start.x;  //определяем вправо или влево относительно старта ведем курсор
            //     let deltaY = this.finish.y - this.start.y;  //определяем вверх или вниз относительно старта ведем курсор
            //     let absDeltaX = Math.abs(deltaX);           //Определяем смещение по Х
            //     let absDeltaY = Math.abs(deltaY);           //Определяем смещение по Y
            //     let k = deltaY/deltaX;                      //Вводим tg наклона нашей прямой
            //     if (k >= -1/2 && k <= 1/2) {
            //         console.log(k);
            //         context.lineTo(this.finish.x, this.start.y);
            //     }
                    
            //     else if (k >= 1/2 && k <= 3/2){
            //         if (deltaX > 0) {
            //             if (absDeltaX >= absDeltaY)
            //                 context.lineTo(this.start.x + absDeltaX/Math.sqrt(2), this.start.y + absDeltaX/Math.sqrt(2));
            //                     else 
            //                         context.lineTo(this.start.x + absDeltaY/Math.sqrt(2), this.start.y + absDeltaY/Math.sqrt(2));   
            //         }
            //         else{
            //             if (absDeltaX >= absDeltaY)
            //             context.lineTo(this.start.x - absDeltaX/Math.sqrt(2), this.start.y - absDeltaX/Math.sqrt(2));
            //                 else 
            //                     context.lineTo(this.start.x - absDeltaY/Math.sqrt(2), this.start.y - absDeltaY/Math.sqrt(2));  
            //         }
                      
            //     }
            //     else if (k >= -3/2 && k <= -1/2){
            //         if (deltaX > 0) {
            //             if (absDeltaX >= absDeltaY)
            //                 context.lineTo(this.start.x + absDeltaX/Math.sqrt(2), this.start.y - absDeltaX/Math.sqrt(2));
            //                     else    
            //                         context.lineTo(this.start.x + absDeltaY/Math.sqrt(2), this.start.y - absDeltaY/Math.sqrt(2)); 
            //         }
            //         else {                                                
            //                 if (absDeltaX >= absDeltaY)
            //                 context.lineTo(this.start.x - absDeltaX/Math.sqrt(2), this.start.y + absDeltaX/Math.sqrt(2));
            //                     else    
            //                         context.lineTo(this.start.x - absDeltaY/Math.sqrt(2), this.start.y + absDeltaY/Math.sqrt(2)); 
            //         }

            //     }
            //     else context.lineTo(this.start.x, this.finish.y);
                    
            //     context.stroke();

            // }
            reCalculateFinish(){
                let deltaX = this.finish.x - this.start.x;  //определяем вправо или влево относительно старта ведем курсор
                let deltaY = this.finish.y - this.start.y;  //определяем вверх или вниз относительно старта ведем курсор
                let absDeltaX = Math.abs(deltaX);           //Определяем смещение по Х
                let absDeltaY = Math.abs(deltaY);           //Определяем смещение по Y
                let k = deltaY/deltaX;                      //Вводим tg наклона нашей прямой
                if (k >= -1/2 && k <= 1/2) {
                    this.finish.x = this.finish.x;
                    this.finish.y = this.start.y;
                }
                    
                else if (k >= 1/2 && k <= 3/2){
                    if (deltaX > 0) {
                        if (absDeltaX >= absDeltaY){
                            this.finish.x = this.start.x + absDeltaX/Math.sqrt(2);
                            this.finish.y = this.start.y + absDeltaX/Math.sqrt(2);
                        }
                                else {
                                    this.finish.x = this.start.x + absDeltaY/Math.sqrt(2);
                                    this.finish.y = this.start.y + absDeltaY/Math.sqrt(2); 
                                } 
                    }
                    else{
                        if (absDeltaX >= absDeltaY){
                            this.finish.x = this.start.x - absDeltaX/Math.sqrt(2);
                            this.finish.y = this.start.y - absDeltaX/Math.sqrt(2);
                        }
                            else {
                                this.finish.x = this.start.x - absDeltaY/Math.sqrt(2);
                                this.finish.y = this.start.y - absDeltaY/Math.sqrt(2);
                            }
                    }
                      
                }
                else if (k >= -3/2 && k <= -1/2){
                    if (deltaX > 0) {
                        if (absDeltaX >= absDeltaY){
                            this.finish.x = this.start.x + absDeltaX/Math.sqrt(2);
                            this.finish.y = this.start.y - absDeltaX/Math.sqrt(2);
                        }
                                else  {
                                    this.finish.x = this.start.x + absDeltaY/Math.sqrt(2);
                                    this.finish.y = this.start.y - absDeltaY/Math.sqrt(2);     
                                }  
                    }
                    else {                                                
                            if (absDeltaX >= absDeltaY){
                                this.finish.x = this.start.x - absDeltaX/Math.sqrt(2);
                                this.finish.y = this.start.y + absDeltaX/Math.sqrt(2);       
                            }
                                else {
                                    this.finish.x = this.start.x - absDeltaY/Math.sqrt(2);
                                    this.finish.y = this.start.y + absDeltaY/Math.sqrt(2);  
                                }   
                    }

                }
                else {
                    this.finish.x = this.start.x;
                    this.finish.y = this.finish.y;  
                }             
            }

        }
        class Curve{
            constructor(){
                this.lines = [];
            }
            add(line){
                this.lines.push(line);
            }
            draw(context){
                this.lines.forEach(function(line){
                    line.draw(context);
                    context.beginPath();
                    console.log("thickness  " + line.thickness/64);
                    context.arc(line.finish.x, line.finish.y, line.thickness/32, 0, Math.PI*2);
                    context.stroke();
                });
            }
            cleanCurve(){
                this.lines = [];
            }


        }

        class Circle{            
            constructor(center, r, thickness, color ){
                this.center= center;
                this.thickness = thickness;
                this.r = r;
                this.startAngle = 0;
                this.endAngle = Math.PI*2;
                this.color = color;
            }
            draw(context){
                context.lineWidth = this.thickness;
                context.strokeStyle = this.color;
                context.beginPath();
                context.arc(this.center.x, this.center.y, this.r, this.startAngle, this.endAngle);
                context.stroke();
            }
        }
        class Rectangle{
            constructor(start, width, height, thickness, color){
                this.start = start;
                this.thickness = thickness;
                this.color = color;
                this.width = width;
                this.height = height;
            }
            draw(context){
                context.lineWidth = this.thickness;
                context.strokeStyle = this.color;
                context.beginPath();
                context.rect(this.start.x, this.start.y, this.width, this.height);
                context.stroke();
            }
        }
        class IsoscelesTriangle{

            constructor(pointA, pointB, pointC, thickness, color){
                this.pointA = pointA;
                this.pointB = pointB;
                this.pointC = pointC;
                this.thickness = thickness;
                this.color = color;              
            }
            draw(context){
                context.lineWidth = this.thickness;
                context.strokeStyle = this.color;
                context.beginPath();
                context.moveTo(this.pointA.x, this.pointA.y);
                context.lineTo(this.pointB.x, this.pointB.y);
                context.stroke();
                context.moveTo(this.pointB.x, this.pointB.y);
                context.lineTo(this.pointC.x, this.pointC.y);
                context.stroke();
                context.moveTo(this.pointA.x, this.pointA.y);
                context.lineTo(this.pointC.x, this.pointC.y);                
                context.stroke();

            }
        }
        function getMousePosition(e){
            var point = new Point(e.offsetX==undefined?e.layerX:e.offsetX, e.offsetY==undefined?e.layerY:e.offsetY);
            return point;
        }
        function getTouchPosition(e){
            let rect = e.target.getBoundingClientRect();
            let point = new Point(e.targetTouches[0].pageX - rect.left, e.targetTouches[0].pageY - rect.top);
            return point; 
        }
        
        
      
        function parseToObjectForDrawing(objToBeParsed){
            let objectsFromLocalstorage = new ObjectForDrawing();
            if (objToBeParsed != null){
                objMas = objToBeParsed.arrObjs;//просто сокращение кода. Нам поступает на вход JSON.parse(из локалсторэйж достаем объект, содержащий все нарисованные объекты)
                for (let i = 0; i < objMas.length; i++){
                    //----------проверяем, является ли очередной объект прямой-------------
                    if (objMas[i].start && objMas[i].finish){ 
                        let line = new Line(objMas[i].start, objMas[i].finish, objMas[i].thickness, objMas[i].color);
                        objectsFromLocalstorage.add(line);
                        continue;
                    }
                    //----------проверяем, является ли очередной объект кривой-------------
                    if (objMas[i].lines){
                        let curve = new Curve();
                        for (let j = 0; j < objMas[i].lines.length; j++){
                            let line = new Line(objMas[i].lines[j].start, objMas[i].lines[j].finish, objMas[i].lines[j].thickness, objMas[i].lines[j].color);
                            curve.add(line);
                        }
                        objectsFromLocalstorage.add(curve);
                        continue;
                    }
                    //----------проверяем, является ли очередной объект окружностью-------------
                    if (objMas[i].center && objMas[i].r){
                        let circle = new Circle(objMas[i].center, objMas[i].r, objMas[i].thickness, objMas[i].color);
                        objectsFromLocalstorage.add(circle);
                        continue;
                    }
                    //----------проверяем, является ли очередной объект прямоугольником-------------
                    if (objMas[i].start && objMas[i].width && objMas[i].height){
                        let new_rect = new Rectangle(objMas[i].start, objMas[i].width, objMas[i].height, objMas[i].thickness, objMas[i].color);
                        objectsFromLocalstorage.add(new_rect);
                        continue;
                    }
                     //----------проверяем, является ли очередной объект равнобедренным треугольником-------------    
                    if (objMas[i].pointA && objMas[i].pointB && objMas[i].pointC){
                        let newTriangle = new IsoscelesTriangle(objMas[i].pointA, objMas[i].pointB, objMas[i].pointC, objMas[i].thickness,objMas[i].color);
                        objectsFromLocalstorage.add(newTriangle);
                        continue;
                    }





                }
                return objectsFromLocalstorage;
            }
 
        }
  
 
   
   
