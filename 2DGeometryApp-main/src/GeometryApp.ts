/** CSci-4611 Example Code
 * Copyright 2023+ Regents of the University of Minnesota
 * Please do not distribute beyond the CSci-4611 course
 */

import * as gfx from 'gophergfx'


export class GeometryApp extends gfx.GfxApp
{   
    private enableWireframe = true;
    private raindrop : gfx.Mesh2;
    private raindrops = [];
 
    // --- Create the ExampleApp class ---
    constructor()
    {
        // initialize the base class gfx.GfxApp
        super();

    }


    // --- Initialize the graphics scene ---
    createScene(): void {
        let gl  = this.renderer.gl;

        this.raindrop = gfx.Geometry2Factory.createRect(0.5, 0.5); 
        //this.raindrop.material.texture = new gfx.Text("Abc",64,64,'25px Helvetica','red'); 
        this.raindrop.material.color = gfx.Color.RED;
        this.scene.add(this.raindrop);


        // Rectangle
        let rect = gfx.Geometry2Factory.createRect(1,1);
        rect.material.color = gfx.Color.RED;
        rect.position = new gfx.Vector2(-0.5, 0.5);
        rect.scale = new gfx.Vector2(0.5, 0.5);
        this.scene.add(rect);
        this.createWireframe(rect);

        // Circle
        let circle = gfx.Geometry2Factory.createCircle(0.5, 20);;
        circle.material.color = gfx.Color.RED;
        circle.position = new gfx.Vector2(0.5, 0.5);
        circle.scale = new gfx.Vector2(0.5, 0.5);
        this.scene.add(circle);
        this.createWireframe(circle);

        // Pacman
        let pacman = gfx.Geometry2Factory.createPieSlice(0.5, Math.PI/4.0, 7.0*Math.PI/4.0, 0.2);
        pacman.material.color = gfx.Color.RED;
        pacman.position = new gfx.Vector2(-0.5, -0.5);
        pacman.scale = new gfx.Vector2(0.5, 0.5);
        this.scene.add(pacman);
        this.createWireframe(pacman);
        
        // Curve
        let curve = this.createCurve();
        curve.material.color = gfx.Color.RED;
        curve.position = new gfx.Vector2(0.5, -0.5);
        curve.scale = new gfx.Vector2(0.5, 0.35);
        this.scene.add(curve);
        this.createWireframe(curve);

        // Triangle Mesh
        let pumpkin = this.createPumpkinFace();
        pumpkin.material.color = gfx.Color.BLUE;
        pumpkin.scale = new gfx.Vector2(0.5, 0.35);
        this.scene.add(pumpkin);
        this.createWireframe(pumpkin);
    }

    

    // --- Update is called once each frame by the main graphics loop ---
    update(deltaTime: number): void {
        //this.raindrop.position.y = this.raindrop.position.y - deltaTime;
    }

    createCurve(): Mesh2
    {
        const tristrip = new gfx.Mesh2();
        tristrip.material.drawMode = this.renderer.gl.TRIANGLE_STRIP;
        const verts: gfx.Vector2[] = [];
        const nSteps = 20;
        for (let n = 0; n <= nSteps; n++) {
            const fraction01 = n/nSteps;
            const x = -1 + 2 * fraction01;
            const angle = -Math.PI + 2 * Math.PI * fraction01;
            const y1 = (Math.cos(angle) + 1) / 2;
            verts.push(new gfx.Vector2(x, y1));
            const y2 = -y1;
            verts.push(new gfx.Vector2(x, y2));
            console.log(x + " " + angle + " " + y1);
        }
        tristrip.setVertices(verts);
        return tristrip;
    }

    createPumpkinFace(): Mesh2
    {
        const mesh = new gfx.Mesh2();
        mesh.material.drawMode = this.renderer.gl.TRIANGLES;
        const verts: gfx.Vector2[] = [];

        // Triangle 1
        verts.push(new gfx.Vector2(0-1,2));
        verts.push(new gfx.Vector2(-0.5-1,1));
        verts.push(new gfx.Vector2(0.5-1,1));

        // Triangle 2
        verts.push(new gfx.Vector2(0+1,2));
        verts.push(new gfx.Vector2(-0.5+1,1));
        verts.push(new gfx.Vector2(0.5+1,1));

        // Triangle 3
        verts.push(new gfx.Vector2(0,0+0.5));
        verts.push(new gfx.Vector2(-0.5,-1+0.5));
        verts.push(new gfx.Vector2(0.5,-1+0.5));

        // mouth
        verts.push(new gfx.Vector2(-2, 0.25-1.5));
        verts.push(new gfx.Vector2(-2, -0.25-1.5));
        verts.push(new gfx.Vector2(2, 0.25-1.5));
        verts.push(new gfx.Vector2(2, 0.25-1.5));
        verts.push(new gfx.Vector2(-2, -0.25-1.5));
        verts.push(new gfx.Vector2(2, -0.25-1.5));

        mesh.setVertices(verts);
        return mesh;
    }

    createWireframe(mesh : gfx.Mesh2): gfx.Line2 {
        const wireframe = new gfx.Line2(gfx.LineMode2.LINE_STRIP);
        const hex_verts: number[] = [];

        const verts = mesh.getVertices();

        if (mesh.material.drawMode == WebGL2RenderingContext.TRIANGLE_STRIP) {
            let lineVerts = []
            lineVerts.push(verts[0], verts[1]);
            lineVerts.push(verts[2], verts[3]);
            for (let i = 2; i < verts.length/2; i++) {
                lineVerts.push(verts[i*2], verts[i*2+1]);
                lineVerts.push(verts[(i-2)*2], verts[(i-2)*2 + 1]);
                lineVerts.push(verts[i*2], verts[i*2+1]);
            }
            wireframe.setVertices(lineVerts);
        }
        else if (mesh.material.drawMode == WebGL2RenderingContext.TRIANGLE_FAN) {
            let lineVerts = []
            lineVerts.push(verts[0], verts[1]);
            for (let i = 2; i < verts.length/2; i++) {
                lineVerts.push(verts[i*2], verts[i*2+1]);
                lineVerts.push(verts[(i-1)*2], verts[(i-1)*2+1]);
                lineVerts.push(verts[0], verts[1]);
            }
            wireframe.setVertices(lineVerts);
        }
        else if (mesh.material.drawMode == WebGL2RenderingContext.TRIANGLES) {
            wireframe.lineMode = gfx.LineMode2.LINES;
            let lineVerts = []
            for (let i = 0; i < verts.length/2; i+=3) {
                lineVerts.push(verts[i*2], verts[i*2+1]);
                lineVerts.push(verts[(i+1)*2], verts[(i+1)*2+1]);
                lineVerts.push(verts[(i+1)*2], verts[(i+1)*2+1]);
                lineVerts.push(verts[(i+2)*2], verts[(i+2)*2+1]);
                lineVerts.push(verts[(i+2)*2], verts[(i+2)*2+1]);
                lineVerts.push(verts[i*2], verts[i*2+1]);
            }
            wireframe.setVertices(lineVerts);
        }
        else {   
            wireframe.setVertices(verts);
        }
        
        wireframe.position = mesh.position;
        wireframe.scale = mesh.scale;
        wireframe.rotation = mesh.rotation;

        if (this.enableWireframe) {
            this.scene.add(wireframe);
        }

        return wireframe;
    }
}
