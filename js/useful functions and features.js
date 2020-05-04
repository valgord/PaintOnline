//Определение координат мыши относительно конкретного блока. Использовал для корректного рисования
//на канве с учетом скороллинга.
function Pos(e) {
        canv.addEventListener('click', function(e) {
            var x = e.offsetX==undefined?e.layerX:e.offsetX;
            var y = e.offsetY==undefined?e.layerY:e.offsetY;
            console.log(x +'x'+ y);
        });
    }