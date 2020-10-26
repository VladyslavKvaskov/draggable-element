const dragElementEvent = new CustomEvent('drag-element', {
  bubbles: true
});

class DraggableElement extends HTMLElement {
  constructor() {
    super();

    this.shiftX;
    this.shiftY;
    this.X;
    this.Y;
    this.hasBeenDragged = false;
    this.canDrag = false;



    this.dragInit = (e) => {
      if (e.target.closest('draggable-element')) {
        this.elementBounds = this.getBoundingClientRect();
        this.clientXY = {};

        if (e.touches) {
          this.clientXY.x = e.touches[0].clientX;
          this.clientXY.y = e.touches[0].clientY;
        } else {
          this.clientXY.x = e.clientX;
          this.clientXY.y = e.clientY;
        }

        this.shiftX = this.clientXY.x - this.elementBounds.left;
        this.shiftY = this.clientXY.y - this.elementBounds.top;

        this.canDrag = true;
      } else {
        this.canDrag = false;
      }
    }

    this.dragDestroy = () => {
      this.canDrag = false;
      if (this.hasBeenDragged) {
        this.hasBeenDragged = false;
      }
    }

    this.addEventListener('mousedown', (e) => {
      this.dragInit(e);
    });

    this.addEventListener('touchstart', (e) => {
      this.dragInit(e);
    }, {
      passive: true
    });

    document.addEventListener('mouseup', (e) => {
      this.dragDestroy();
    });

    document.addEventListener('touchend', (e) => {
      this.dragDestroy();
    }, {
      passive: true
    });

    this.dragging = (e) => {
      if (this.canDrag) {
        e.preventDefault();

        this.hasBeenDragged = true;
        this.elementBounds = this.getBoundingClientRect();

        this.pageXY = {};

        if (e.touches) {
          this.pageXY.x = e.touches[0].pageX;
          this.pageXY.y = e.touches[0].pageY;
        } else {
          this.pageXY.x = e.pageX;
          this.pageXY.y = e.pageY;
        }
        this.X = (this.pageXY.x / window.innerWidth * 100) - (this.shiftX / window.innerWidth * 100);
        this.Y = (this.pageXY.y / window.innerHeight * 100) - (this.shiftY / window.innerHeight * 100);

        this.style.left = `${this.X}%`;
        this.style.top = `${this.Y}%`;
        this.style.right = 'auto';
        this.style.bottom = 'auto';

        this.dispatchEvent(dragElementEvent);
      }
    }

    document.addEventListener('mousemove', (e) => {
      this.dragging(e);
    });

    document.addEventListener('touchmove', (e) => {
      this.dragging(e);
    }, {
      passive: false
    });
  }
  connectedCallback() {
    if (window.getComputedStyle(this, null).getPropertyValue('position') === 'static' || window.getComputedStyle(this, null).getPropertyValue('position') === 'static') {
      this.style.position = 'relative';
    }
  }
}

customElements.define('draggable-element', DraggableElement);