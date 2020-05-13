
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
            constructor(centerX, centerY, r, startAngle, endAngle, direction){
                this.centerX= centerX;
                this.centerY = centerY;
                this.r = r;
                this.startAngle = startAngle;
                this.endAngle = endAngle;
            }

        }
   

        function getMousePosition(e){
            var point = new Point(e.offsetX==undefined?e.layerX:e.offsetX, e.offsetY==undefined?e.layerY:e.offsetY);
            return point;
        }
        
      

  
 
   
   
