

import {poissonDiscSampler} from './sampler'
import {Delaunay} from 'd3-delaunay'


let ctx, canvas, image, collection;
window.onload = () =>{
    canvas = document.getElementById("sampleSpace");
    ctx = canvas.getContext("2d");
    canvas.width = 960;
    canvas.height = 500;
}

const sortY = (a, b) => {
    if (a[1] === b[1]) {
        return 0;
    }
    else {
        return (a[1] < b[1]) ? -1 : 1;
    }
}

const getColorIndices = (x, y, canvasWidth, imageData) =>{
    const red = y  * (canvasWidth * 4) + x * 4;
    let color = [imageData[red], imageData[red + 1], imageData[red + 2]];
    return color
}

const samplePolygonPixels = (polygon, cellIdx, voronoi, imageData) =>{
    let x0, x1, y0, y1;

    polygon.sort()
        x0 = Math.ceil(polygon[0][0]);
        x1 = Math.floor(polygon[polygon.length - 1][0]);
    polygon.sort(sortY)
        y0 = Math.ceil(polygon[0][1]);
        y1 = Math.floor(polygon[polygon.length - 1][1]);
    let sampleSize = 0,
    total = [0,0,0,0];
    
    for(let i = x0; i < x1; i++){
        for(let j = y0; j < y1; j++){
            if (voronoi.contains(cellIdx, i, j)){
                const color =  getColorIndices(i, j, imageData.width, imageData.data)
                
                for( let k = 0; k < 2; k++) {
                    total[k] += color[k]**2
                }
                
                sampleSize++;
                
            }
        }
    }
    let result = `rgb(${Math.ceil(Math.sqrt(total[0] / sampleSize))}, ${Math.ceil(Math.sqrt(total[1] / sampleSize))}, ${Math.ceil(Math.sqrt(total[2] / sampleSize))})`
    
    return result
}
    
    
  const form = document.getElementById("img-form")
  
    form.onsubmit = (e) => {
        
        e.preventDefault()
        
        let img = e.target.children['img'].files[0];
        image = new Image();

        image.src = URL.createObjectURL(img)
        
        image.onload =  function(){ 
          
            canvas.width = this.width;
            canvas.height = this.height;
            let dim = [0,0,this.width, this.height];

        
            ctx.drawImage(this, 0, 0)
            const imageData = ctx.getImageData(...dim);
            ctx.clearRect(...dim);
            debugger
            const r = this.height * this.width
            collection = [];
            
            let p, s = poissonDiscSampler(canvas.width, canvas.height, 6);

            while (p = s.next().value) {
                if (p.add) {
                    collection.push(p.add)
                }
            } 

          
                
            const delaunay = Delaunay.from(collection);
            const voronoi = delaunay.voronoi(dim);
           
        
             const polygons = voronoi.cellPolygons();
             let cellIdx = 0;
          
             while(p = polygons.next().value){
                
                 
              
                 let cell = new Path2D();
                 cell.moveTo(p[0][0], p[0][1]);
                    
                 for( let i = 0; i < p.length-1; i++){
                    cell.lineTo(p[i+1][0], p[i+1][1]);
                 }
                
                let color = samplePolygonPixels(p, cellIdx, voronoi, imageData)
                
                 cell.closePath();
                 ctx.fillStyle = color;
                 ctx.fill(cell)
                 cellIdx++;
             }
        }
    }












