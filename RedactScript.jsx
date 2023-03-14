// Get the selected text layer
var textLayer = app.project.activeItem.selectedLayers[0];

// Get the bounding box of the text layer
var boundingBox = textLayer.sourceRectAtTime(0, false);

// Create a new shape layer
var shapeLayer = app.project.activeItem.layers.addShape();

// Create a new rectangle path
var rectPath = shapeLayer.property("Contents").addProperty("ADBE Vector Shape - Rect");

// Set the rectangle path to the bounding box of the text layer
rectPath.property("Size").expression = "var t = thisComp.layer('" + textLayer.name + "'); [t.sourceRectAtTime(time,false).width, t.sourceRectAtTime(time,false).height];";
rectPath.property("Position").setValue([boundingBox.left + boundingBox.width/2, boundingBox.top + boundingBox.height/2]);

// Set the stroke and fill colors of the rectangle
var stroke = shapeLayer.property("Contents").addProperty("ADBE Vector Graphic - Stroke");
stroke.property("Color").setValue([1, 1, 1]); // white stroke
stroke.property("Stroke Width").setValue(2);

var fill = shapeLayer.property("Contents").addProperty("ADBE Vector Graphic - Fill");
fill.property("Color").setValue([0, 0, 0]); // black fill

// Set the anchor point of the text layer to the center of the bounding box
textLayer.transform.anchorPoint.expression = "var s = sourceRectAtTime(); [s.left+s.width/2, s.top+s.height/2];";

// Set the anchor point of the shape layer to the center of the bounding box
shapeLayer.transform.anchorPoint.setValue([boundingBox.left + boundingBox.width/2, boundingBox.top + boundingBox.height/2]);

// Parent the shape layer to the text layer
shapeLayer.parent = textLayer;

// Set the position of the shape layer to the text layer's anchor point
shapeLayer.transform.position.expression = "var t = thisComp.layer('" + textLayer.name + "'); t.transform.anchorPoint;";
shapeLayer.transform.position.setValue(textLayer.transform.anchorPoint.value);

// Set the shape layer's transform properties to match the text layer
shapeLayer.transform.scale.expression = textLayer.transform.scale.expression;
shapeLayer.transform.rotation.expression = textLayer.transform.rotation.expression;