import Element from "../Element";

let numberCount = 0;
function NumberGen() {
    numberCount++;
    return numberCount - 1;
}

/**
 * This callback is called when a widget is click.
 * @callback onClickCallback
 */

/**
 * This callback is called when the value on an input widget has changed.
 * @callback onChangeCallback
 * @param {*} value The new value of the input widget.
 */

/**
 * The widget base class that wraps around the OpenRCT2 Plugin API UI widgets, and is mostly used for input widgets and labels.
 * @extends Element
 */
class Widget extends Element {
    constructor() {
        super();

        this.setMargins(2, 4, 2, 2);
        this._type = "none";
        this._name = NumberGen();
        this._tooltip = "";
    }

    /**
     * Get the reference to the OpenRCT2 Plugin API UI widget.
     * @returns {Widget} Reference to an OpenRCT2 Plugin API UI widget.
     */
    getHandle() {
        let window = this.getWindow();
        if (window != null && window.isOpen()) {
            return window._handle.findWidget(this._name);
        }
        return null;
    }

    /**
     * Set the widget's tooltip.
     * @param {number} text Tooltip to display. 
     */
    setTooltip(text) {
        this._tooltip = text;
        this.requestSync();
    }

    _getDescription() {
        let calcPos = this._getWindowPixelPosition();
        let desc = {
            type: this._type,
            name: this._name,
            x: calcPos.x,
            y: calcPos.y,
            width: this.getPixelWidth(),
            height: this.getPixelHeight(),
            isDisabled: this.isDisabled()
        };
        if (this._tooltip != "") {
            desc.tooltip = this._tooltip;
        }
        return desc;
    }

    _update() {
        if (this.requiresSync()) {
            let handle = this.getHandle();
            let desc = this._getDescription();
            this._applyDescription(handle, desc);
        }
        this._requireSync = false;
    }

    _applyDescription(handle, desc) {
        handle.x = desc.x;
        handle.y = desc.y;
        handle.width = desc.width;
        handle.height = desc.height;
        handle.isDisabled = desc.isDisabled;
        if (handle.tooltip != this._tooltip) {
            handle.tooltip = this._tooltip;
        }
    }
}

Widget.NumberGen = NumberGen;

export default Widget;
