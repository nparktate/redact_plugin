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
fill.property("Opacity").setValue(50); // 50% opacity

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

