import fs from 'fs-extra'
import path from 'path'
import { PNG } from 'pngjs'

export const run = async ({ state, element, events, iteration }) => {
  
  const config = {
  	width: 28,
    height: 28,
		size: 28 * 28,
		totalPerRow: 20,
		totalRows: 964,
		imagePath: path.join(__dirname, '/data/images_background.png')
	}
  
  const pixelsPerRow = config.width * config.totalPerRow
    
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  canvas.width = pixelsPerRow
  canvas.height = pixelsPerRow * config.totalRows
  
  const data = await new Promise(resolve => {
  	fs.createReadStream(config.imagePath)
  	.pipe(new PNG())
  	.on('parsed', data => {
    	resolve(data)
  	})  
  })
  
  state.data = []
  
  for(var y=0; y<config.totalRows; y++){
    for(var x=0; x<config.totalPerRow; x++){
   		const image = new Float64Array(config.size)
   		
      const xpos = x * config.width
      const ypos = y * config.height
      
      for(var iy=0; iy<config.height; iy++){
        for(var ix=0; ix<config.width; ix++){
          const pixelpos = (ypos + iy) * pixelsPerRow + (xpos + ix)
        	image[iy * config.width + ix] = data[pixelpos * 4] / 255  
        }
      }
      
      state.data.push(image)
    }
  }  
  
  state.config = config
}
