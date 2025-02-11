/** CSci-4611 Example Code
 * Copyright 2023+ Regents of the University of Minnesota
 * Please do not distribute beyond the CSci-4611 course
 */

import * as gfx from 'gophergfx'


export class Image extends gfx.Node2
{   
    private rect: gfx.Mesh2 | null;
    private texture: gfx.Texture;
    private initialized: boolean = false;
    private changed: boolean = false;
    private pixels: Uint8ClampedArray | null;
    private originalPixels: Uint8ClampedArray | null;

    protected readonly gl: WebGL2RenderingContext;

    constructor(path : string) {
        super();
        this.gl  = gfx.GfxApp.getInstance().renderer.gl;
        this.rect = gfx.Geometry2Factory.createRect(2,2);
        this.texture = new gfx.Texture(path);

        this.rect.material.texture = this.texture;
        this.add(this.rect);
        this.update();
    }

    public get width() {
        return this.texture.width;
    }

    public get height() {
        return this.texture.height;
    }

    update() {
        if (!this.initialized && gfx.GfxApp.getInstance().assetManager.allAssetsLoaded()) {
            
            const nBytes = this.texture.width * this.texture.height * 4;
            this.originalPixels = new Uint8ClampedArray(nBytes);
            this.pixels = new Uint8ClampedArray(nBytes);

            console.log(this.texture.width, this.texture.height);
            this.rect.scale = new gfx.Vector2(1.0, this.texture.height/this.texture.width);

            this.gl.bindTexture(this.gl.TEXTURE_2D, null);

            var fb = this.gl.createFramebuffer();
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, fb);
            this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this.texture.texture, 0);
            if (this.gl.checkFramebufferStatus(this.gl.FRAMEBUFFER) == this.gl.FRAMEBUFFER_COMPLETE) {
                this.gl.readPixels(0, 0, this.texture.width, this.texture.height, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.pixels);
            }
            this.gl.deleteFramebuffer(fb);

            for (let i = 0; i < this.pixels.length; i++) {
                this.originalPixels[i] = this.pixels[i];
            }

            this.initialized = true;
        }

        if (this.changed) {
            const imageData = new ImageData(this.pixels, this.texture.width, this.texture.height);
            this.texture.setFullImageData(imageData);
            this.changed = false;
        }
    }

    reset() : void {
        for (let i = 0; i < this.pixels.length; i++) {
            this.pixels[i] = this.originalPixels[i];
            this.changed = true;
        }
    }

    getPixel(x : number, y: number) : gfx.Color {
        const pos = (y * this.width + x) * 4;
        let r = this.pixels[pos + 0]/255.0;
        let g = this.pixels[pos + 1]/255.0;
        let b = this.pixels[pos + 2]/255.0;
        let a = this.pixels[pos + 3]/255.0;
        return new gfx.Color(r, g, b, a);
    }

    setPixel(x : number, y: number, color : gfx.Color) : void {
        const pos = (y * this.texture.width + x) * 4;
        this.pixels[pos + 0] = color.r*255;
        this.pixels[pos + 1] = color.g*255;
        this.pixels[pos + 2] = color.b*255;
        this.pixels[pos + 3] = color.a*255;
        this.changed = true;
    }

}
