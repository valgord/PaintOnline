
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
                });
            }
            cleanCurve(){
                this.lines = [];
            }


        }

        class Circle{            
            constructor(start, Point){
                this.centerX= (Point.x + start.x)/2;
                this.centerY = (Point.y + start.y)/2;
                this.r = Math.sqrt(Math.pow(this.centerX - start.x,2) + Math.pow(this.centerY - start.y,2));
                //this.r = (Math.abs(this.centerX - start.x) - Math.abs(this.centerY - start.y) > 0) ? Math.abs(this.centerX - start.x) : Math.abs(this.centerY - start.y);
                this.startAngle = 0;
                this.endAngle = Math.PI*2;
            }
            draw(context, thickness, color){
                context.lineWidth = thickness;
                context.beginPath();
                context.arc(this.centerX, this.centerY, this.r, this.startAngle, this.endAngle);
                context.stroke();
            }
        }
        class Rectangle{
            constructor(start, Point){
                this.startX = start.x;
                this.startY = start.y;
                // this.width = Math.abs(Point.x - this.startX);
                // this.height = Math.abs(Point.y - this.startY);
                this.width = Point.x - this.startX;
                this.height = Point.y - this.startY;
            }
            draw(context, thickness, color){
                context.lineWidth = thickness;
                context.beginPath();
                context.rect(this.startX, this.startY, this.width, this.height);
                context.stroke();
            }
        }
   
        function getMousePosition(e){
            var point = new Point(e.offsetX==undefined?e.layerX:e.offsetX, e.offsetY==undefined?e.layerY:e.offsetY);
            return point;
        }
     
        
      

  
 
   
   
