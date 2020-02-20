import {Delaunay} from 'd3-delaunay'

export class VoronoiDiagram{
    constructor(collection, width, height){
        let delaunay = Delaunay.from(collection)
        this.mesh = delaunay.voronoi([0, 0, width, height]);
    }

samplePolygonPixels(imageData, cellIdx){
   
    let polygon = this.mesh.cellPolygon(cellIdx)

    const sortY = (a, b) => {
        if (a[1] === b[1]) {
            return 0;
        }
        else {
            return (a[1] < b[1]) ? -1 : 1;
        }
    }
    const sortX = (a, b) => {
        if (a[0] === b[0]) {
            return 0;
        }
        else {
            return (a[0] < b[0]) ? -1 : 1;
        }
    }
    const getColorIndices = (x, y, canvasWidth, imageData) => {

        const red = y * (canvasWidth * 4) + x * 4;
        let color = [imageData[red], imageData[red + 1], imageData[red + 2]];
        return color
    }

    if (polygon){
        let x0, x1, y0, y1;
        
        polygon = polygon.sort(sortX)
            x0 = Math.ceil(polygon[0][0]);
            x1 = Math.floor(polygon[polygon.length - 1][0]);
        polygon = polygon.sort(sortY)
            y0 = Math.ceil(polygon[0][1]);
            y1 = Math.floor(polygon[polygon.length - 1][1]);
    let sampleSize = 0,
        total = [0, 0, 0, 0];

        for (let i = x0; i < x1; i++) {
            for (let j = y0; j < y1; j++) {
                if (this.mesh.contains(cellIdx, i, j)) {
                    const color = getColorIndices(i, j, imageData.width, imageData.data)

                    for (let k = 0; k < 3; k++) {
                        total[k] += color[k] ** 2
                    }

                    sampleSize++;

                }
            }
        }
        let result = `rgb(${Math.ceil(Math.sqrt(total[0] / sampleSize))}, ${Math.ceil(Math.sqrt(total[1] / sampleSize))}, ${Math.ceil(Math.sqrt(total[2] / sampleSize))})`
        return result
    }else{
        return null
    }

    }




}   

