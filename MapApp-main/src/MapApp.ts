/** CSci-4611 Example Code
 * Copyright 2023+ Regents of the University of Minnesota
 * Please do not distribute beyond the CSci-4611 course
 */

import * as gfx from 'gophergfx'
import { Image } from './Image';


export class MapApp extends gfx.GfxApp
{   
    private map: Image;
    private time: number = 0;
    private points = [];

    constructor() {
        // initialize the base class gfx.GfxApp
        super();

        this.renderer.viewport = gfx.Viewport.CROP;
    }

    // --- Initialize the graphics scene ---
    createScene(): void {
        this.map = new Image("assets/umn.png");
        this.scene.add(this.map);
    }
    
    // --- Update is called once each frame by the main graphics loop ---
    update(deltaTime: number): void {
        this.time += deltaTime;
        this.map.update();
    }

    onMouseDown(event: MouseEvent): void {
        // Get's the position of the mouse in normalized device coordinates
        // console.log(event);
        // const mousePosition = this.getNormalizedDeviceCoordinates(event.x, event.y);
        // console.log(mousePosition);
        // TODO: Create a circle at the point and add it to the list of points
        const kellerPos = new gfx.Vector3(500, 500, 0);
        const coffmanPos = new gfx.Vector3(400, 400, 0);
        // TODO: If there are more than one points, draw a line between them
        const toKeller = new gfx.Vector3.subtract(kellerPos, coffmanPos);
;
        // TODO: Calculate the total distance traveled by finding the magnitude of the vectors
        //       between points.  (Draw the text for the distance)
        const magnitude = Math[Symbol]sqrt(kellerPos**2 + coffmanPos***2)

        // Challenge Task: Draw a normalized direction vector at each point
    }

}
