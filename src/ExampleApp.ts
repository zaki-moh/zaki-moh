/** CSci-4611 Example Code
 * Copyright 2023+ Regents of the University of Minnesota
 * Please do not distribute beyond the CSci-4611 course
 */

import * as gfx from 'gophergfx'


export class ExampleApp extends gfx.GfxApp
{   
 
    // --- Create the ExampleApp class ---
    constructor()
    {
        // initialize the base class gfx.GfxApp
        super();

    }


    // --- Initialize the graphics scene ---
    createScene(): void 
    {
        this.renderer.background = new gfx.Color(0.25, 0.5, 0.3);
        let rect = gfx.Geometry2Factory.createRect(0.5,0.25);
        rect.position.x = 0.5;
        rect.position.y = 0.5;
        rect.scale = new gfx.Vector2(2.0, 1.0);
        this.scene.add(rect);
    }

    // --- Update is called once each frame by the main graphics loop ---
    update(deltaTime: number): void 
    {
    }
}
