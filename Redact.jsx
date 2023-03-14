// Creates a dockable UI panel or a separate window depending on the input object
function createDockableUI(thisObj) {
  // If the input object is a Panel, use it directly, otherwise create a new Window
  var dialog =
      thisObj instanceof Panel
          ? thisObj
          : new Window("window", undefined, undefined, { resizeable: true });
  
  // Assign the resize event handlers for the dialog (both onResizing and onResize)
  dialog.onResizing = dialog.onResize = function() {
      // Resize the layout whenever the dialog is resized
      this.layout.resize();
  };
  
  // Return the created dialog (either Panel or Window)
  return dialog;
}

// Displays the given window (either a Panel or a Window)
function showWindow(myWindow) {
  // If the input object is a Window, center and show it
  if (myWindow instanceof Window) {
      myWindow.center();
      myWindow.show();
  }
  
  // If the input object is a Panel, refresh the layout and resize it
  if (myWindow instanceof Panel) {
      myWindow.layout.layout(true);
      myWindow.layout.resize();
  }
}

// Apply the base Redact script when text layer is selected and apply button is pressed
function onApplyButtonClick() {
  var win = createDockableUI(this);

  // Get the selected text layer
  var textLayer = app.project.activeItem.selectedLayers[0];

  // Get the bounding box of the text layer
  var boundingBox = textLayer.sourceRectAtTime(0, false);

  // Create a new shape layer
  var shapeLayer = app.project.activeItem.layers.addShape();

  // Create a new rectangle path
  var rectPath = shapeLayer.property("Contents").addProperty("ADBE Vector Shape - Rect");

  // Set the rectangle path to the bounding box of the text layer
  rectPath.property("Size").expression = "var t = thisComp.layer('" + textLayer.name + "'); [t.sourceRectAtTime(time,false).width, t.sourceRectAtTime(time,false).height*thisComp.layer('" + shapeLayer.name + "').effect('Vertical Scale')('Slider')/100];";
  rectPath.property("Position").setValue([boundingBox.left + boundingBox.width/2, boundingBox.top + boundingBox.height/2]);

  // Set the fill color of the rectangle
  var fill = shapeLayer.property("Contents").addProperty("ADBE Vector Graphic - Fill");
  fill.property("Color").setValue([0, 0, 0]); // black fill
  fill.property("Opacity").setValue(100); // 50% opacity

  // Add a slider control to the shape layer for vertical scale
  var verticalScale = shapeLayer.Effects.addProperty("ADBE Slider Control");
  verticalScale.name = "Vertical Scale";
  verticalScale.property("Slider").setValue(100);

  // Set the anchor point of the text layer to the center of the bounding box
  textLayer.transform.anchorPoint.expression = "var s = sourceRectAtTime(); [s.left+s.width/2, s.top+s.height/2];";

  // Set the anchor point of the shape layer to the center of the bounding box
  shapeLayer.transform.anchorPoint.setValue([boundingBox.left + boundingBox.width/2, boundingBox.top + boundingBox.height/2]);

  // Parent the shape layer to the text layer
  shapeLayer.parent = textLayer;

  // Set the position of the shape layer to the text layer's anchor point
  shapeLayer.transform.position.expression = "var t = thisComp.layer('" + textLayer.name + "'); t.transform.anchorPoint;";
  shapeLayer.transform.position.setValue(textLayer.transform.anchorPoint.value);

  // Set the scale of the shape layer to 100%
  shapeLayer.transform.scale.setValue([100, 100]);

  // Add the CC Line Sweep effect to the shape layer
  var lineSweep = shapeLayer.Effects.addProperty("CC Line Sweep");
  lineSweep.name = "Redact Animation";
  lineSweep.property("Thickness").setValue(1000);
  lineSweep.property("Slant").setValue(99);
  lineSweep.property("Flip Direction").setValue(true);
  lineSweep.property("Completion").setValue(100);
  lineSweep.property("Completion").setValuesAtTimes([0, 1], [100, 0]);

}

// Create a dockable UI panel or a separate window
var win = createDockableUI(this);

// Set the title of the window or panel
win.text = "Redact Text";

// Set the preferred size of the window or panel
win.preferredSize.width = 200;
win.preferredSize.height = 60;

// Set the orientation and alignment of the window or panel's children
win.orientation = "column";
win.alignChildren = ["center", "top"];

// Set the spacing and margins of the window or panel
win.spacing = 10;
win.margins = 16;

// Add a button to the window or panel
var button1 = win.add("button", undefined, undefined, { name: "button1" });

// Set the text of the button
button1.text = "Apply";

// Assign the event handler (onApplyButtonClick) to the button's onClick event
button1.onClick = onApplyButtonClick;

// Show the window or panel (depending on whether the script is run in a dockable panel or a separate window)
showWindow(win);