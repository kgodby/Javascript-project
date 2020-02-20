

import {sampler} from './sampler'
import {VoronoiDiagram} from './mesh'
import {throttle} from '../util/throttle'



  
    const form = document.getElementById("img-form")
    const canvas =  document.getElementById("sampleSpace")
    const ctx = canvas.getContext('2d')    
    const slider = document.getElementById('slider') 
    let voronoi, i, imageData, p
    let r = slider.value

    const draw = function (imageData, voronoi, i) {
        ctx.globalAlpha = 1;
        
        for( let j = 0; j< 1000; j++){
           
            if(voronoi.mesh.cellPolygon(i)){
               let color = voronoi.samplePolygonPixels(imageData, i)
               ctx.beginPath()
               voronoi.mesh.renderCell(i, ctx)
               ctx.closePath()
               ctx.fillStyle = color;
               ctx.strokeStyle = color;
               ctx.stroke()
               ctx.fill()
               i++
           }else{
               return true
           } 
            

        }
             
            
        window.requestAnimationFrame(() => { draw(imageData, voronoi, i) })
    }
    
    const newSample = function(canvas, r, p){
        const collection = sampler(canvas.width, canvas.height, parseFloat(r), p);
        const voronoi = new VoronoiDiagram(collection, canvas.width, canvas.height);
        
        return voronoi

    }
   

    form.onsubmit = (e) => {
        e.preventDefault()
        
        let img = e.target.children['img'].files[0],
        image = new Image();
        image.src = URL.createObjectURL(img)

        

        image.onload = function(){ 
            image = this
            canvas.width = this.width;
            canvas.height = this.height;
            
            ctx.globalAlpha = 0.2;
            ctx.drawImage(this, 0, 0)
            
            
            imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        }   
     
    }
        slider.addEventListener('change', (event) => 
                r = event.target.value  
            )

        const clickHandler = function(p){
            i = 0
                ctx.clearRect(0,0,canvas.width, canvas.height)
                
                voronoi = newSample(canvas, r,p)
                window.requestAnimationFrame(() =>draw(imageData, voronoi, i));
            }

        canvas.addEventListener('click', (e) =>
            clickHandler(p = [e.clientX, e.clientY])
        )


