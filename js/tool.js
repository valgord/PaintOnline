
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
            constructor(start, finish, thickness)
            {
                this.start = start;
                this.finish = finish;
                this.thickness = thickness;
            }
            draw(context){
                context.lineWidth = this.thickness;
                context.beginPath();    
                context.moveTo(this.start.x, this.start.y);
                context.lineTo(this.finish.x, this.finish.y);
                context.stroke();
                context.beginPath();
                context.arc(this.finish.x, this.finish.y, this.thickness/64, 0, Math.PI*2);
                context.stroke();
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
            constructor(start, curPoint, thickness, color ){
                this.centerX= (curPoint.x + start.x)/2;
                this.centerY = (curPoint.y + start.y)/2;
                this.r = Math.sqrt(Math.pow(this.centerX - start.x,2) + Math.pow(this.centerY - start.y,2));
                this.thickness = thickness;
                //this.r = (Math.abs(this.centerX - start.x) - Math.abs(this.centerY - start.y) > 0) ? Math.abs(this.centerX - start.x) : Math.abs(this.centerY - start.y);
                this.startAngle = 0;
                this.endAngle = Math.PI*2;
                this.color = color;
            }
            draw(context){
                context.lineWidth = this.thickness;
                context.beginPath();
                context.arc(this.centerX, this.centerY, this.r, this.startAngle, this.endAngle);
                context.stroke();
            }
        }
        class Rectangle{
            constructor(start, curPoint, thickness, color){
                this.startX = start.x;
                this.startY = start.y;
                this.thickness = thickness;
                this.color = color;
                // this.width = Math.abs(Point.x - this.startX);
                // this.height = Math.abs(Point.y - this.startY);
                this.width = curPoint.x - this.startX;
                this.height = curPoint.y - this.startY;
            }
            draw(context){
                context.lineWidth = this.thickness;
                context.beginPath();
                context.rect(this.startX, this.startY, this.width, this.height);
                context.stroke();
            }
        }
        class IsoscelesTriangle{
            constructor(start, curPoint, thickness, color){
                this.startX = start.x;
                this.startY = start.y;
                this.thickness = thickness;
                this.color = color;
                this.pointA = new Point(start.x, start.y);
                this.pointB = new Point((start.x + curPoint.x)/2, curPoint.y);
                this.pointC = new Point(curPoint.x, start.y);              
            }
            draw(context){
                context.lineWidth = this.thickness;
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
     
        
      

  
 
   
   
