/** CSci-4611 Example Code
 * Copyright 2023+ Regents of the University of Minnesota
 * Please do not distribute beyond the CSci-4611 course
 */

import * as gfx from 'gophergfx'


export class ExampleApp extends gfx.GfxApp
{
    private sceneNode = new gfx.Node2();
    private time = 0.0;
 
    // --- Create the ExampleApp class ---
    constructor() {
        // initialize the base class gfx.GfxApp
        super();
        this.renderer.gl.disable(this.renderer.gl.CULL_FACE);
    }

    createHouse(translation : gfx.Vector2 = new gfx.Vector2(0.0,0.0)) : gfx.Mesh2 {
        const house = new gfx.Mesh2();
        house.material.drawMode = WebGL2RenderingContext.TRIANGLE_STRIP;
        const vertices : gfx.Vector2[] = [];
        vertices.push(new gfx.Vector2(0.0,0.1));
        vertices.push(new gfx.Vector2(-0.1,0.0));
        vertices.push(new gfx.Vector2(0.1,0.0));
        vertices.push(new gfx.Vector2(-0.1,-0.1));
        vertices.push(new gfx.Vector2(0.1,-0.1));
        vertices.forEach(vertex => {
            vertex.add(translation);
        });
        house.setVertices(vertices)
        return house;
    }

    createTarget(matrix : gfx.Matrix3) {
        const target = this.createHouse();
        target.material.color = new gfx.Color(0.6, 0.6, 0.6);
        target.setLocalToParentMatrix(matrix);
        const wrapper = new gfx.Node2();
        wrapper.add(target);
        wrapper.visible = false;
        this.sceneNode.add(wrapper);
    }

    createStart(translation : gfx.Vector2 = new gfx.Vector2(0.0,0.0)) : gfx.Mesh2 {
        const house = this.createHouse(translation)
        house.material.color = gfx.Color.YELLOW;
        this.sceneNode.add(house);
        house.visible = false;
        return house;
    }

    // --- Initialize the graphics scene ---
    createScene(): void {
        this.scene.add(this.sceneNode);
        const currentScene = 0;

        // Scene 0
        {
            this.createTarget(gfx.Matrix3.fromColumnMajor(0.3535533905932738,0.35355339059327373,0,-0.35355339059327373,0.3535533905932738,0,2.7755575615628914e-17,0.35355339059327373,1));
            const object = this.createStart();
            const mat = gfx.Matrix3.IDENTITY;
            //mat.multiply(gfx.Matrix3.makeRotation(Math.PI/4));
            //mat.multiply(gfx.Matrix3.makeScale(new gfx.Vector2(0.5,0.5)));
            //mat.multiply(gfx.Matrix3.makeTranslation(new gfx.Vector2(0.5,0.5)));
            object.setLocalToParentMatrix(mat);
        }

        // Scene 1
        {
            this.createTarget(gfx.Matrix3.fromColumnMajor(2,0,0,0,-2,0,0,0,1));
            const object = this.createStart();
            const mat = gfx.Matrix3.IDENTITY;
            // TODO: add matrix multiplications
            object.setLocalToParentMatrix(mat);
        }

        // Scene 2
        {
            this.createTarget(gfx.Matrix3.fromColumnMajor(0.3535533905932738,0.35355339059327373,0,-0.7071067811865475,0.7071067811865476,0,0.5,0.5,1));
            const object = this.createStart(new gfx.Vector2(-0.5, 0.0));
            const mat = gfx.Matrix3.IDENTITY;
            // TODO: add matrix multiplications
            object.setLocalToParentMatrix(mat);
        }

        // Scene 3
        {
            this.createTarget(gfx.Matrix3.fromColumnMajor(1,0,0,0,1,0,    0.5,    0.5,    1));
            const object = this.createStart(new gfx.Vector2(-0.5, -0.5));
            const mat = gfx.Matrix3.IDENTITY;
            // TODO: add matrix multiplications
            object.setLocalToParentMatrix(mat);
        }

        // Scene 4
        {
            this.createTarget(gfx.Matrix3.fromColumnMajor(1.2246467991473532e-16,    -2,    0,    1,    6.123233995736766e-17,    0,    0.6,    -0.5,    1));
            const object = this.createStart(new gfx.Vector2(0.5, -0.5));
            const mat = gfx.Matrix3.IDENTITY;
            // TODO: add matrix multiplications
            object.setLocalToParentMatrix(mat);
        }

        // Scene 5
        {
            this.createTarget(gfx.Matrix3.fromColumnMajor(0.14142135623730953,    -0.1414213562373095,    0,    3.5355339059327373,    3.5355339059327378,    0,    0.4535533905932737,    0.4535533905932738,    1));
            const object = this.createStart();
            const mat = gfx.Matrix3.IDENTITY;
            // TODO: add matrix multiplications
            object.setLocalToParentMatrix(mat);
        }

        // Scene 6
        {
            this.createTarget(gfx.Matrix3.fromColumnMajor(0.14142135623730953,    -0.1414213562373095,    0,    3.5355339059327373,    3.5355339059327378,    0,    0.4535533905932737,    0.4535533905932738,    1));
            const object = this.createStart();
            const mat = gfx.Matrix3.IDENTITY;
            // TODO: add matrix multiplications
            object.setLocalToParentMatrix(mat);
        }
        
        this.sceneNode.children[2*currentScene + 0].visible = true;
        this.sceneNode.children[2*currentScene + 1].visible = true;
    }

    // --- Update is called once each frame by the main graphics loop ---
    update(deltaTime: number): void {
        this.time += deltaTime;
        this.sceneNode.children[2*6 + 0].rotation = -this.time/1000;
    }

    onKeyDown(event: KeyboardEvent): void {
        this.sceneNode.children.forEach(node => {
            node.visible = false;
        });

        const num = parseInt(event.key);
        if (num < 10) {
            this.sceneNode.children[2*num + 0].visible = true;
            this.sceneNode.children[2*num + 1].visible = true;
        }
    }
}
