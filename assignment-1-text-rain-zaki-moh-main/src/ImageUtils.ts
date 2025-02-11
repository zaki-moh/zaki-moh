/** CSci-4611 Text Rain Assignment Support Code
 * Assignment concept by Daniel Keefe, 2014+
 * GopherGfx implementation, Daniel Keefe, 2023
 * Inspired by Camille Utterbeck's "Text Rain" installation, 2000+
 * Copyright Regents of the University of Minnesota
 * Please do not distribute beyond the CSci-4611 course
 */

import * as gfx from 'gophergfx'

/**
 * A collection of helper routines for working with images stored in ImageData objects.
 * Feel free to add additional routines (e.g., image filters) if you like.  (We did in
 * our implementation.)
 */
export class ImageUtils
{
    /**
     * Creates a new ImageData object of the specified width and height.  Every byte in the data array
     * will be be initialized to 0 (i.e., black completely transparent pixels).
     */
    public static createBlank(width: number, height: number): ImageData
    {
        const nBytes = width * height * 4;
        return new ImageData(new Uint8ClampedArray(nBytes), width, height);
    }

    /**
     * Checks the image variable to determine if has already been created, then checks to see if it has
     * the desired width and height.  If these checks pass, then the function returns the existing image.
     * If either check fails, then the function creates a new ImageData object of the desired width and 
     * height and returns it.  In this case, the image will be initialized using ImageUtils.createBlank().   
     * @param image Can be null, undefined, or an existing image
     * @param width The desired width of the image
     * @param height The desired height of the image
     * @returns The current image if it matches the desired width and height or a new image that matches
     */
    public static createOrResizeIfNeeded(image: ImageData | undefined | null, width: number, height: number): ImageData
    {
        if (!(image instanceof ImageData) || image.width != width || image.height != height) {
            return this.createBlank(width, height);
        } else {
            return image;
        }
    }

    /**
     * Returns a new ImageData object that is a deep copy of the source image provided.  This includes copying
     * all of the pixel data from the source to the new image object.
     */
    public static clone(source: ImageData): ImageData
    {
        const copyOfPixelData = new Uint8ClampedArray(source.data);
        return new ImageData(copyOfPixelData, source.width, source.height);
    }

    /**
     * Copies the pixel data from the source image into the pixels of the destination image. 
     * @param source An existing ImageData object that is the source for the pixel data.
     * @param dest An existing ImageData object that is the destination for the pixel data.
     */
    public static copyPixels(source: ImageData, dest: ImageData): void
    {
        for (let i=0; i<source.data.length; i++) {
            dest.data[i] = source.data[i];
        }
    }


    /* The following helper functions should be fairly easy to implement based on the slides
     * and may be useful to use as part of your solution. 
     */

    /**
     * Returns the value of the red component of the color for the pixel located at the
     * given row and column in the image.
     */
    public static getRed(image: ImageData, col: number, row: number): number
    {
        return image.data[((row * image.width) + col) * 4];
    }

    /**
     * Returns the value of the green component of the color for the pixel located at the
     * given row and column in the image.
     */
    public static getGreen(image: ImageData, col: number, row: number): number
    {
        return image.data[(((row * image.width) + col) + 1) * 4];
    }    

    /**
     * Returns the value of the blue component of the color for the pixel located at the
     * given row and column in the image.
     */
    public static getBlue(image: ImageData, col: number, row: number): number
    {
        return image.data[(((row * image.width) + col) + 2) * 4];
    }    

    /**
     * Returns the value of the alpha component of the color for the pixel located at the
     * given row and column in the image.
     */
    public static getAlpha(image: ImageData, col: number, row: number): number
    {
        return image.data[(((row * image.width) + col) + 3) * 4];
    }

    /**
     * Returns the color (RGBA) for the pixel located at the given row and column in 
     * the image using the GopherGfx Color class.
     */
    public static getPixel(image: ImageData, col: number, row: number): gfx.Color
    {
        return gfx.Color.BLACK;
    }

    
}


