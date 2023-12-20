class GraphEditor{
    constructor(canvas, graph){
        this.canvas = canvas;
        this.graph = graph;

        this.ctx = this.canvas.getContext("2d");

        this.selected = null;
        this.hovered = null;
        this.dragging = false;
        this.mouse = null;

        this.#addEventListeners();
    }

    //private method for mouse action
    #addEventListeners(){
        //this gives the location of mouse
        this.canvas.addEventListener("mousedown", this.#handleMouseDown.bind(this));
        
        //event listener for mouse move
        this.canvas.addEventListener("mousemove", this.#handleMouseMove.bind(this));

        //disabling Default menu viewing that prevents from right click
        this.canvas.addEventListener("contextmenu", (evt) => evt.preventDefault());

        //when the mouse is released after dragging
        this.canvas.addEventListener("mouseup", () => this.dragging = false);
    }

    #handleMouseMove(evt){
        this.mouse = new Point(evt.offsetX, evt.offsetY);

            //get nearest point from all the graph points
            this.hovered = getNearestPoint(this.mouse, this.graph.points, 10);

            if(this.dragging == true){
                this.selected.x = this.mouse.x;
                this.selected.y = this.mouse.y;
            }
    }

    #handleMouseDown(evt){
        //for adding point on right click
        if(evt.button == 2){ //2 -> is for right click
            if(this.selected){
                this.selected = null;
            }else if(this.hovered){
                this.#removePoint(this.hovered);
            }
        }

        // add point on clicking left button
        if(evt.button == 0){ //0 -> is for left click

            if(this.hovered){
                this.#select(this.hovered);
                //when a mouse is hovered to a point we
                //also want to enable dragging
                this.dragging = true;
                return;
            }

            //drawing point anywhere the mouse clicks
            this.graph.addPoint(this.mouse);

            //adding a segment between a new and previous points
            this.#select(this.mouse);

            //we want to assign the newly created point to
            // mouse hover without actually moving over
            this.hovered = this.mouse;
        }
    }

    #select(point){
        //adding a segment between a new and previous points
        if(this.selected){
            this.graph.tryAddSegment(new Segment(this.selected, point));
        }

        this.selected = point;
    }


    //this removes the selected point without a delay
    //it also resets tthe hovered and selected to null such that
    //it does not appear until the mouse is moved to another location
    #removePoint(point){
        this.graph.removePoint(point);
        this.hovered = null;
        
        //we want the previously selected point to remain selected
        if(this.selected == point){
            this.selected = null;
        }
    }
    
    display(){
        this.graph.draw(this.ctx);

        if (this.hovered){
            this.hovered.draw(this.ctx, { fill: true});
        }

        if (this.selected){
            //drawing an imaginary segment
            const intent = this.hovered ? this.hovered : this.mouse;
            //the intent with 3 dashed lines with 3 spaces in between
            new Segment(this.selected, intent).draw(ctx, {dash: [3, 3] });
            this.selected.draw(this.ctx, { outline: true});
        }

    }
}