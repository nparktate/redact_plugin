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

  // Calculate the new anchor point
  var newAnchorPoint = [
    boundingBox.left + boundingBox.width / 2,
    boundingBox.top + boundingBox.height / 2,
  ];

  // Get the text layer's scale values
  var textLayerScale = textLayer.transform.scale.value;

  // Calculate the new position based on the new anchor point and scale values
  var oldPosition = textLayer.transform.position.value;
  var newPosition = [
    oldPosition[0] + (newAnchorPoint[0] * textLayerScale[0] / 100),
    oldPosition[1] + (newAnchorPoint[1] * textLayerScale[1] / 100),
  ];

  // Set the anchor point of the text layer to the new anchor point
  textLayer.transform.anchorPoint.setValue(newAnchorPoint);

  // Set the position of the text layer to the new position
  textLayer.transform.position.setValue(newPosition); 

  // Create a new shape layer
  var shapeLayer = app.project.activeItem.layers.addShape();

  // Set the shape layer's name based on the dropdown selection
  shapeLayer.name = dropdown1.selection.text + " Redacted";

  // Create a new rectangle path
  var rectPath = shapeLayer.property("Contents").addProperty("ADBE Vector Shape - Rect");

  // Set the rectangle path to the bounding box of the text layer and add rounded corners
  rectPath.property("Size").expression = "var t = thisComp.layer('" + textLayer.name + "'); [t.sourceRectAtTime(time,false).width, t.sourceRectAtTime(time,false).height*thisComp.layer('" + shapeLayer.name + "').effect('Vertical Scale')('Slider')/100];";
  rectPath.property("Position").setValue([boundingBox.left + boundingBox.width/2, boundingBox.top + boundingBox.height/2]);
  rectPath.property("ADBE Vector Rect Roundness").expression = "thisComp.layer('" + shapeLayer.name + "').effect('Rounded Corners Radius')('Slider')";


  // Set the fill color of the rectangle
  var fill = shapeLayer.property("Contents").addProperty("ADBE Vector Graphic - Fill");
  fill.property("Color").setValue([0, 0, 0]); // black fill
  fill.property("Opacity").setValue(100); // 100% opacity

  // Add a slider control to the shape layer for vertical scale
  var verticalScale = shapeLayer.Effects.addProperty("ADBE Slider Control");
  verticalScale.name = "Vertical Scale";
  
  // Check if the dropdown selection is "Strikethrough" and set the slider value accordingly
  if (dropdown1.selection.text === "Strikethrough") {
    verticalScale.property("Slider").setValue(25);
  } else {
    verticalScale.property("Slider").setValue(100);
  }

  // Add a slider control to the shape layer for rounded corners radius
  var roundedCornersRadius = shapeLayer.Effects.addProperty("ADBE Slider Control");
  roundedCornersRadius.name = "Rounded Corners Radius";
  roundedCornersRadius.property("Slider").setValue(10);

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
win.text = "Redact Text"; 
win.preferredSize.width = 200; 
win.preferredSize.height = 60; 
win.orientation = "column"; 
win.alignChildren = ["center","top"]; 
win.spacing = 10; 
win.margins = 16;

// Add static text description to the window or panel
var statictext1 = win.add("group", undefined , {name: "statictext1"}); 
statictext1.getText = function() { var t=[]; for ( var n=0; n<statictext1.children.length; n++ ) { var text = statictext1.children[n].text || ''; if ( text === '' ) text = ' '; t.push( text ); } return t.join('\n'); }; 
statictext1.orientation = "column"; 
statictext1.alignChildren = ["left","center"]; 
statictext1.spacing = 0; 
statictext1.alignment = ["left","top"];
statictext1.add("statictext", undefined, "Choose a Text Layer, select"); 
statictext1.add("statictext", undefined, "Style, and click Apply for the"); 
statictext1.add("statictext", undefined, "redacted effect."); 

// Add a divider to the window or panel
var divider1 = win.add("panel", undefined, undefined, {name: "divider1"}); 
divider1.alignment = "fill"; 

// Add a dropdown to the window or panel
var dropdown1_array = ["Basic","-","Brush","-","Marker","-","Strikethrough"]; 
var dropdown1 = win.add("dropdownlist", undefined, undefined, {name: "dropdown1", items: dropdown1_array}); 
dropdown1.helpTip = "Style that is applied to text (You can change and add your own effects to the line after the fact. If you want a blank slate, chose Basic)."; 
dropdown1.selection = 0; 
dropdown1.alignment = ["left","top"];

// Add a button to the window or panel
var button1 = win.add("button", undefined, undefined, {name: "button1"}); 
button1.helpTip = "Applies Redact animation to selected text."; 
button1.text = "Apply"; 
button1.alignment = ["left","top"];
button1.onClick = onApplyButtonClick; // Assign the event handler

// Show the window or panel (depending on whether the script is run in a dockable panel or a separate window)
showWindow(win);