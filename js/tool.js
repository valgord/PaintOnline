
    'use strict';
    class Line {
        constructor(startX, startY, endX, endY)
        {
            this.startX = startX;
            this.startY = startY;
            this.endX = endX;
            this.endY = endY;
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


