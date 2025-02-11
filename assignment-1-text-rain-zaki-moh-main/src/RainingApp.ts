/** CSci-4611 Text Rain Assignment Support Code
 * Assignment concept by Daniel Keefe, 2014+
 * GopherGfx implementation, Daniel Keefe, 2023
 * Inspired by Camille Utterbeck's "Text Rain" installation, 2000+
 * Copyright Regents of the University of Minnesota
 * Please do not distribute beyond the CSci-4611 course
 */

import * as gfx from 'gophergfx'
import { GUI, GUIController } from 'dat.gui'
import { VideoSourceManager } from './VideoSourceManager';
import { ImageUtils } from './ImageUtils';

export class RainingApp extends gfx.GfxApp
{   
    // --- constants ---
    private readonly FALLBACK_VIDEO = './TextRainInput.m4v';
    private readonly OPEN_SETTINGS_LABEL_TEXT = '▼ Open Settings';
    private readonly CLOSE_SETTINGS_LABEL_TEXT = '▲ Close Settings';


    // --- GUI related member vars ---
    // the gui object created using the dat.gui library.
    private gui: GUI;
    // the gui controllers defined in the constructor are tied to these member variables, so these
    // variables will update automatically whenever the checkboxes, sliders, etc. in the gui are changed.
    private poem = "Code flows bright, Logic takes flight, Dreams ignite, Stars in night";
    private raindrops: gfx.Mesh2[];
    private _debugging: boolean;
    private _threshold: number;
    // the video source is also controlled by the GUI, but the logic is a bit more complex as we
    // do not know the names of the video devices until we are given permission to access them.  so,
    // we save a reference to the GUIController and option list in addition to the currentVideoDevice
    // variable that gets updated when the user changes the device via the gui.
    private videoSourceDropDown: GUIController;
    

    // --- Graphics related member vars ---
    private videoSourceManager: VideoSourceManager;
    private displayImage: ImageData | null;
    private obstacleImage: ImageData | null;
    private backgroundRect: gfx.Mesh2 | null;



    // --- Getters and setters ---
    // any variables that can be changed from outside the class, including by the GUI, need to either be
    // declared public rather than private (this is usually faster to code and generally ok for small
    // projects) OR have getters & setters defined as below (this is generally better / safer practice).
    // since the variables cannot have exactly the same name as the getter and setter, we prepend an
    // underscore to the name of the underlying member variable.
    // learn more: https://www.typescripttutorial.net/typescript-tutorial/typescript-getters-setters/
    public get debugging() 
    {
        return this._debugging;
    }

    public set debugging(value: boolean) 
    {
        this._debugging = value;
    }

    public get threshold() 
    {
        return this._threshold;
    }

    public set threshold(value: number) 
    {
        this._threshold = value;
    }


    // --- Constructor ---
    // note: typescript requires that we initialize all member variables in the constructor.
    constructor()
    {
        // initialize the base class gfx.GfxApp
        super();
        
        // this writes directly to some variables within the dat.gui library. the library does not
        // provide a nicer way to customize the text for the buttons used to open/close the gui.
        GUI.TEXT_CLOSED = this.CLOSE_SETTINGS_LABEL_TEXT;
        GUI.TEXT_OPEN = this.OPEN_SETTINGS_LABEL_TEXT;

        // initialize all member variables
        this._debugging = false;
        this._threshold = 0.5;
        this.backgroundRect = null;
        this.displayImage = null;
        this.obstacleImage = null;
        this.videoSourceManager = new VideoSourceManager(this.FALLBACK_VIDEO,
            // video sources are loaded asynchronously, and this little callback function
            // is called when the loading finishes to update the choices in the GUI dropdown
            (newSourceDictionary: { [key: string]: string }) => {
                this.videoSourceDropDown.options(newSourceDictionary);
            });

        // initialize the gui and add various controls
        this.gui = new GUI({width: 300, closed: false});

        // create a dropdown list to select the video source; initially the only option is the
        // fallback video, more options are added when the VideoSourceManager is done loading
        const videoDeviceOptions: {[key: string]: string} = {};
        videoDeviceOptions[this.FALLBACK_VIDEO] = this.FALLBACK_VIDEO;
        this.videoSourceDropDown = this.gui.add(this.videoSourceManager, 'currentVideoSourceId', videoDeviceOptions);

        // this creates a checkbox for the debugging member variable
        const debuggingCheckbox = this.gui.add(this, 'debugging');

        // this creates a slider to set the value of the threshold member variable
        const thresholdSlider = this.gui.add(this, 'threshold', 0, 1);

        // This is a good place to initialize any variables you need to create as part of your solution.
        //this.poem =['a', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b' ];
        this.raindrops = [];


    }


    // --- Initialize the Graphics Scene ---
    createScene(): void 
    {
        // This parameter zooms in on the scene to fit within the window.
        // Other options include FIT or STRETCH.
        // for (let i = 0; i <= 10; i++){
        //     const raindrop = gfx.Geometry2Factory .createRect (0.5, 0.5);
        //     raindrop.material.texture = new gfx.Text("A",64,64,'25px Helvetica' ,'blue');
        //     this.scene.add(raindrop)
        // }
        // To see each frame of the video, we need to apply it as a meterial to some geometry.
        // So, we'll create a big rectangle that fills the entire screen (width = 2, height = 2).
        this.backgroundRect = gfx.Geometry2Factory.createRect(2, 2);
        // add the backgroundRect to the root of the scene graph
        this.scene.add(this.backgroundRect);
        for(let i = 0; i < this.poem.length; i++){
            const raindrop = gfx.Geometry2Factory .createRect (0.14, 0.14);
            const char = this.poem[Math.floor(Math.random() * this.poem.length)];
            raindrop.material.texture = new gfx.Text(char,64,64,'25px Helvetica' ,'blue');
            raindrop.position.x = Math.random() *2 - 1;
            raindrop.position.y = Math.random() * (1/2) + 1;
            this.raindrops.push(raindrop);
            this.scene.add(raindrop);
        }

    }


    update(deltaTime: number): void 
    {
        
        const sourceImage = this.videoSourceManager.currentVideoSource.getImageData();
        if (sourceImage instanceof ImageData) {
            const width = sourceImage.width;
            const height = sourceImage.height;
            this.displayImage = ImageUtils.createOrResizeIfNeeded(this.displayImage, width, height);
            this.obstacleImage = ImageUtils.createOrResizeIfNeeded(this.obstacleImage, width, height);
            if (this.displayImage instanceof ImageData && this.obstacleImage instanceof ImageData) {
                
                for (let i = 0; i < this.raindrops.length; i++) {
                    const raindrop = this.raindrops[i];
                    const x = Math.floor(this.sceneXtoImageColumn(raindrop.position.x, width));
                    const y = Math.floor(this.sceneYtoImageRow(raindrop.position.y, height));
                    const index = (y * width + x) * 4;
                    const r = this.obstacleImage.data[index];
                    const g = this.obstacleImage.data[index + 1];
                    const b = this.obstacleImage.data[index + 2];

                    const grayscaleValue = (r + g + b) / 3;
                    if(grayscaleValue < this.threshold){
                        raindrop.position.y = raindrop.position.y;
                    }
                    else {
                        raindrop.position.y -= deltaTime;
                    }

                    if (raindrop.position.y < -1) {
                        raindrop.position.y = Math.random() * (1 / 2) + 1; 
                        raindrop.position.x = Math.random() * 2 - 1; 
                    }
                }

                
                // Inside this IF statement, we know that sourceImage, this.displayImage, and 
                // this.obstacleImage are all defined and all have the same width and height.
                // The pixels in sourceImage will contain the latest picture from the webcam or 
                // video file, and our job is to update the pixels in this.displayImage and
                // this.obstacleImage based on the new source data.

                // IMPORTANT: Treat sourceImage as READ ONLY.  You should access color data from
                // sourceImage to copy it over to this.displayImage and/or this.obstacleImage and/or
                // any temporary images you may wish to create.  this.displayImage is drawn on the
                // screen by default, and this.obstacleImage is drawn with the "Debug Mode" checkbox
                // is checked.

                
                // You will want to replace these examples with your own code, but here are two
                // examples to help you get started.

                // this.displayImage is the image displayed on the screen by default.  You will need
                // to set its pixels to a grayscale and mirrored version of the sourceImage as part of
                // your assignment.  This line just copies the pixels from sourceImage to this.displayImage
                // so this should display the exact pixels coming from the webcam or video file.
                ImageUtils.copyPixels(sourceImage, this.displayImage);
                for (let i = 0; i < this.displayImage.data.length; i+=4) {        
                    const avg = (this.displayImage.data[i] + this.displayImage.data[i + 1] + this.displayImage.data[i + 2]) / 3;
                    this.displayImage.data[i + 0] = avg;
                    this.displayImage.data[i + 1] = avg;   
                    this.displayImage.data[i + 2] = avg;                   
                }



                // this.obstacleImage is the image you should use to prevent the rain from falling through
                // dark pixels.  You will need to set its pixels to a thresholded version of the displayImage.
                // To help with debugging your code, the app will display this.obstacleImage instead of
                // this.displayImage when you check the Debug Mode checkbox.  This example, sets each pixel
                // of the obstacleImage to the color red.
                for (let i=0; i < this.obstacleImage.width; i++) {
                    for(let j = 0; j < this.obstacleImage.height; j++){
                        this.obstacleImage.data[i + 0] = this.threshold; 
                        this.obstacleImage.data[i + 1] = this.threshold;   
                        this.obstacleImage.data[i + 2] = this.threshold;   
                        this.obstacleImage.data[i + 3] = this.threshold;   
                    }
                }
                
                
                // If not debugging, sets the texture for the background rect to this.displayImage.
                // If debugging, sets the texture for the background rect to this.obstacleImage.
                this.updateBackgroundRectTexture();
            }
        }
    }


    /**
     * The following routines help with converting back and forth between GopherGfx
     * 2D coordinates (x,y) and Image coordinates (col, row).  We will be stretching
     * an image to fill the entire GopherGfx 2D canvas.  Given a 2D location on the
     * screen, we need to know what (col, row) it maps to in the image so we can look
     * up the color at that location. Similarly, given a pixel in the image, we may
     * need to know what position it would occupy on the screen in GopherGfx's 2D
     * coordinates.  A conversion is needed because the origin and range of the 
     * different coordinate systems are not the same:
     * 
     * The GopherGfx 2D Scene/Screen Coordinates range from -1 to +1 in X and Y:
     *  (-1, 1) +----------+ 
     *          |          |
     *          |          |
     *          +----------+ (1, -1)
     *
     * Image Coordinates range from 0 to imageWidth-1 and imageHeight-1
     *   (0,0) +----------+ 
     *         |          |
     *         |          |
     *         +----------+ (imageWidth-1, imageHeight-1)
     */


    /** Convert the x value of a location in 2D scene coordinates to the nearest column number 
     * of an image stretched across the screen. */
    sceneXtoImageColumn(x: number, imageWidth: number): number {
        return ((x + 1)/2)*(imageWidth - 1)
    }

    /** Convert the y value of a location in 2D scene coordinates to the nearest row number 
     * of an image stretched across the screen. */
    sceneYtoImageRow(y: number, imageHeight: number): number {
        return ((1-y)/2)*(imageHeight - 1);
    }

    /** Convert the column number of a pixel in an image stretched across the screen to the
     * x value of a location in 2D scene coordinates. */
    imageColumnToSceneX(col: number, imageWidth: number): number {
        return (2*col/(imageWidth - 1))- 1;
    }

    /** Convert the row number of a pixel in an image stretched across the screen to the
     * y value of a location in 2D scene coordinates. */
    imageRowToSceneY(row: number, imageHeight: number): number {
        return 1 - (2*row/(imageHeight - 1));
    }


    /** Helper routine to set the background rect's texture to be either the displayImage
     * the obstacleImage depending on whether we are in debugging mode or not. */
    updateBackgroundRectTexture(): void {
        if (this.backgroundRect instanceof gfx.Mesh2) {
            const imageToDraw = this.debugging ? this.obstacleImage : this.displayImage;
            if (imageToDraw instanceof ImageData) {
                if (this.backgroundRect.material.texture == null || 
                    this.backgroundRect.material.texture.width != imageToDraw.width || 
                    this.backgroundRect.material.texture.height != imageToDraw.height) 
                {
                    // need to create a new texture
                    this.backgroundRect.material.texture = new gfx.Texture(imageToDraw);
                } else {
                    // appropriate texture already exists, just update its pixel array
                    this.backgroundRect.material.texture.setFullImageData(imageToDraw);
                }
            }
        }
    }
}
