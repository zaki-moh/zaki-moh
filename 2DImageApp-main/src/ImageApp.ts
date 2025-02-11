/** CSci-4611 Example Code
 * Copyright 2023+ Regents of the University of Minnesota
 * Please do not distribute beyond the CSci-4611 course
 */

import * as gfx from 'gophergfx'
import { Image } from './Image';


export class ImageApp extends gfx.GfxApp
{   
    private statue: Image;
    private dog: Image;
    private img: Image | null;
    private time: number = 0;

    constructor() {
        // initialize the base class gfx.GfxApp
        super();

    }

    // --- Initialize the graphics scene ---
    createScene(): void {
        this.statue = new Image("assets/statue.png");
        this.dog = new Image("assets/dog.png");

        this.img = this.statue;

        this.scene.add(this.img);
    }
    
    // --- Update is called once each frame by the main graphics loop ---
    update(deltaTime: number): void {
        this.time += deltaTime;
        this.img.update();
    }

    colorRed(image : Image) : void {
        for (let i = 0; i < image.width; i++) {
            for (let j = 0; j < image.height; j++) {
                let pixel = image.getPixel(i,j);

                pixel.r = 1.0;
                pixel.g = 0.0;
                pixel.b = 0.0;
                pixel.a = 1.0;

                image.setPixel(i, j, pixel);
            }
        }
    }

    threshold(image : Image, value : number) : void {
        for (let i = 0; i < image.width; i++) {
            for (let j = 0; j < image.height; j++) {
                let pixel = image.getPixel(i,j);
                if (pixel.r < 128) {
                    pixel.r = 0
                }
                else {
                    pixel.r = 255
                }
                if (pixel.g < 128) {
                    pixel.g = 0
                }
                else {
                    pixel.g = 255
                }
                image.setPixel(i, j, pixel);
            }
        }
    }

    grayscale(image : Image) : void {
        for (let i = 0; i < image.width; i++) {
            for (let j = 0; j < image.height; j++) {
                let pixel = image.getPixel(i,j);

            // Modify pixel (example: grayscale effect)
            let avg = (pixel.r + pixel.g + pixel.b) / 3;
            pixel.r = avg;
            pixel.g = avg;
            pixel.b = avg;
            image.setPixel(i, j, pixel);
            }
        }
    }

    channel(image : Image, color : gfx.Color) : void {
    }
    
    quantize(image : Image, bins : number) : void {
        for (let i = 0; i < image.width; i++) {
            for (let j = 0; j < image.height; j++) {
                let pixel = image.getPixel(i,j);
                this.quantize(image, bins);
                image.setPixel(i, j, pixel);
            }
        }
    }
    
    saturate(image : Image, value : number) : void {

    }

    onMouseDown(event: MouseEvent): void {
        //this.colorRed(this.img);

        // TODO: Write threshold filter
        //this.threshold(this.img, 0.5);
        
        // TODO: Write grayscale filter
        this.grayscale(this.img);
        // TODO: Write channel filter
        // this.channel(this.img, new gfx.Color(1.0, 0.2, 0.0, 1.0));

        // TODO: Write quantize filter
        //this.quantize(this.img, 0.7);

        // TODO: Write saturation filter
        // this.saturate(this.img, 2.0);
        
        // Challenge: Modify the pixels where your mouse is:
        // let point = this.renderer.getNormalizedDeviceCoordinates(event.screenX, event.screenY);
        // console.log(point);

        // Challenge: Draw on the screen with your mouse
        // Hint: use onMouseDown(), onMouseUp(), onMouseMove()
    }

    onKeyDown(event: KeyboardEvent): void {
        this.img?.reset();
    }

}
