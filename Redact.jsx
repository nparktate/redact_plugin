function createDockableUI(thisObj) {
  var dialog =
      thisObj instanceof Panel
          ? thisObj
          : new Window("window", undefined, undefined, { resizeable: true });

  dialog.onResizing = dialog.onResize = function() {
      // Resize the layout whenever the dialog is resized
      this.layout.resize();
  };

  return dialog;
}

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

function setVerticalScale(shapeLayer, value) {
  var verticalScale = shapeLayer.Effects.property("Vertical Scale");
      verticalScale.property("Slider").setValue(value);
}

function addMarkerStyle(shapeLayer) {
  var turbulentDisplace = shapeLayer.Effects.addProperty("ADBE Turbulent Displace");
      turbulentDisplace.name = "Marker Texture";
      turbulentDisplace.property("Displacement").setValue(5); // 5 represents Turbulent Smoother
      turbulentDisplace.property("Amount").setValue(35);
      turbulentDisplace.property("Size").setValue(20);
      turbulentDisplace.property("Complexity").setValue(5);
      turbulentDisplace.property("Offset (Turbulence)").expression = "thisComp.layer('" + shapeLayer.parent.name + "').transform.position";

  var verticalScale = shapeLayer.Effects.property("Vertical Scale");
  setVerticalScale(shapeLayer, 80);
}

function addBrushStyle(shapeLayer) {
  var brushTexture = shapeLayer.Effects.addProperty("ADBE Turbulent Displace");
      brushTexture.name = "Brush texture";
      brushTexture.property("Displacement").setValue(10); // 10 represents Turbulent Horizontal
      brushTexture.property("Amount").setValue(400);
      brushTexture.property("Size").setValue(20);
      brushTexture.property("Complexity").setValue(5);
      brushTexture.property("Offset (Turbulence)").expression = "thisComp.layer('" + shapeLayer.parent.name + "').transform.position";

  var brushTipFinishing = shapeLayer.Effects.addProperty("ADBE Roughen Edges");
      brushTipFinishing.name = "Brush Tip Finishing";
      brushTipFinishing.property("Edge Type").setValue(4);
      brushTipFinishing.property("Border").setValue(3);
      brushTipFinishing.property("Complexity").setValue(5);
      brushTipFinishing.property("Offset (Turbulence)").expression = "thisComp.layer('" + shapeLayer.parent.name + "').transform.position";

  var verticalScale = shapeLayer.Effects.property("Vertical Scale");
  setVerticalScale(shapeLayer, 80);
}

function addStrikethroughStyle(shapeLayer) {
  var verticalScale = shapeLayer.Effects.property("Vertical Scale");
  setVerticalScale(shapeLayer, 25);
}

function addBasicStyle(shapeLayer) {
  var verticalScale = shapeLayer.Effects.property("Vertical Scale");
  setVerticalScale(shapeLayer, 80);
}

function onApplyButtonClick() {
  var textLayer = app.project.activeItem.selectedLayers[0];
  var boundingBox = textLayer.sourceRectAtTime(0, false);

  // Calculate the new anchor point
  var newAnchorPoint = [
    boundingBox.left + boundingBox.width / 2,
    boundingBox.top + boundingBox.height / 2,
  ];

  var textLayerScale = textLayer.transform.scale.value;

  // Calculate the new position based on the new anchor point and scale values
  var oldPosition = textLayer.transform.position.value;
  var newPosition = [
    oldPosition[0] + (newAnchorPoint[0] * textLayerScale[0] / 100),
    oldPosition[1] + (newAnchorPoint[1] * textLayerScale[1] / 100),
  ];

  // Set the anchor point and position of the text layer based on the calulated values above
  textLayer.transform.anchorPoint.setValue(newAnchorPoint);
  textLayer.transform.position.setValue(newPosition); 

  // Create the new shape layer and name it
  var shapeLayer = app.project.activeItem.layers.addShape();
      shapeLayer.name = dropdown1.selection.text + " Redacted";
  var rectPath = shapeLayer.property("Contents").addProperty("ADBE Vector Shape - Rect");

  // Set the rectangle path to the bounding box of the text layer and add rounded corners
  rectPath.property("Size").expression = "var t = thisComp.layer('" + textLayer.name + "'); [t.sourceRectAtTime(time,false).width, t.sourceRectAtTime(time,false).height*thisComp.layer('" + shapeLayer.name + "').effect('Vertical Scale')('Slider')/100];";
  rectPath.property("Position").setValue([boundingBox.left + boundingBox.width/2, boundingBox.top + boundingBox.height/2]);
  rectPath.property("ADBE Vector Rect Roundness").expression = "thisComp.layer('" + shapeLayer.name + "').effect('Rounded Corners Radius')('Slider')";

  // Set the fill color of the rectangle
  var fill = shapeLayer.property("Contents").addProperty("ADBE Vector Graphic - Fill");
      fill.property("Color").setValue([0, 0, 0]); // black fill
      fill.property("Opacity").setValue(100); // 100% opacity

  var verticalScale = shapeLayer.Effects.addProperty("ADBE Slider Control");
      verticalScale.name = "Vertical Scale";
  var roundedCornersRadius = shapeLayer.Effects.addProperty("ADBE Slider Control");
      roundedCornersRadius.name = "Rounded Corners Radius";
      roundedCornersRadius.property("Slider").setValue(10);

  // Set the anchor point of the text layer & shape layer to the center of the bounding box
  textLayer.transform.anchorPoint.expression = "var s = sourceRectAtTime(); [s.left+s.width/2, s.top+s.height/2];";
  shapeLayer.transform.anchorPoint.setValue([boundingBox.left + boundingBox.width/2, boundingBox.top + boundingBox.height/2]);

  // Parent the shape layer to the text layer & set the position of the shape layer to the text layer's anchor point + reset its scale  
  shapeLayer.parent = textLayer;
  shapeLayer.transform.position.expression = "var t = thisComp.layer('" + textLayer.name + "'); t.transform.anchorPoint;";
  shapeLayer.transform.position.setValue(textLayer.transform.anchorPoint.value);
  shapeLayer.transform.scale.setValue([100, 100]);

  // Add the CC Line Sweep effect to the shape layer to animate from left to right
  var lineSweep = shapeLayer.Effects.addProperty("CC Line Sweep");
      lineSweep.name = "Redact Animation";
      lineSweep.property("Thickness").setValue(1000);
      lineSweep.property("Slant").setValue(99);
      lineSweep.property("Flip Direction").setValue(true);
      lineSweep.property("Completion").setValue(100);
      lineSweep.property("Completion").setValuesAtTimes([0, 1], [100, 0]);

  // Apply the chosen styles
  switch (dropdown1.selection.text) {
    case "Marker":
      addMarkerStyle(shapeLayer);
      break;
    case "Brush":
      addBrushStyle(shapeLayer);
      break;
    case "Strikethrough":
      addStrikethroughStyle(shapeLayer);
      break;
    default:
      addBasicStyle(shapeLayer);
  }

  // Check if the checkbox is checked and set the text layer opacity to 0 if true
  if (checkbox1.value) {
    textLayer.property("ADBE Transform Group").property("ADBE Opacity").setValue(0);
  }

  // Parent the shape layer to the text layer for a final time & move the text layer to be under the shape layer
  shapeLayer.parent = textLayer;
  textLayer.moveAfter(shapeLayer);  
}

// Create a dockable UI panel
var win = createDockableUI(this);
    win.text = "Redact Text"; 
    win.preferredSize.width = 200; 
    win.preferredSize.height = 60; 
    win.orientation = "column"; 
    win.alignChildren = ["center","top"]; 
    win.spacing = 10; 
    win.margins = 16;

// Add static text description explaining how to use plugin
var statictext1 = win.add("group", undefined , {name: "statictext1"}); 
    statictext1.getText = function() { var t=[]; for ( var n=0; n<statictext1.children.length; n++ ) { var text = statictext1.children[n].text || ''; if ( text === '' ) text = ' '; t.push( text ); } return t.join('\n'); }; 
    statictext1.orientation = "column"; 
    statictext1.alignChildren = ["left","center"]; 
    statictext1.spacing = 0; 
    statictext1.alignment = ["left","top"];

    statictext1.add("statictext", undefined, "Choose a Text Layer, select"); 
    statictext1.add("statictext", undefined, "Style, and click Apply for the"); 
    statictext1.add("statictext", undefined, "redacted effect."); 

// Add a divider
var divider1 = win.add("panel", undefined, undefined, {name: "divider1"}); 
    divider1.alignment = "fill";

// Add a checkbox that hides text when [true]
var checkbox1 = win.add("checkbox", undefined, undefined, {name: "checkbox1"}); 
    checkbox1.helpTip = "Hides text when true (Used to only show the redacted line). Sets text opacity to 0%)"; 
    checkbox1.text = "Hide Text"; 
    checkbox1.alignment = ["left","top"]; 

// Add a dropdown where the style of redacted line is selected 
var dropdown1_array = ["Basic","Brush","Marker","Strikethrough"]; 
var dropdown1 = win.add("dropdownlist", undefined, undefined, {name: "dropdown1", items: dropdown1_array}); 
    dropdown1.helpTip = "Style that is applied to text (You can change and add your own effects to the line after the fact. If you want a blank slate, chose Basic)."; 
    dropdown1.selection = 0; 
    dropdown1.alignment = ["left","top"];

// Add a button that applys the script to the selected text layer
var button1 = win.add("button", undefined, undefined, {name: "button1"}); 
    button1.helpTip = "Applies Redact animation to selected text."; 
    button1.text = "Apply"; 
    button1.alignment = ["left","top"];
    button1.onClick = onApplyButtonClick; // Assign the event handler

showWindow(win);
