Class: FileToDataURI {#FileToDataURI}
=========================================

FileToDataURI is a jQuery plugin that allow you to retrieve the content (base64 encoded) of a local file using the HTML5 File API or using a Flash application if the File API is not available.

FileToDataURI Method: constructor {#FileToDataURI:constructor}
-------------------------------------------------------------------

### Syntax:

	$(element).FileToDataURI(options);

### Arguments:

1. options - (object) Options for the plugin.

### Options:

* allowedType - (string: defaults to `image`) The allowed file type.
* allowedExts - (array: defaults to `['jpg', 'jpeg', 'gif', 'png']`) The allowed file extensions (Only used by the Flash application).
* fileDescription - (string: defaults to `Images`) Description of the allowed files (Only used by the Flash application).
* moviePath - (string: defaults to `FileToDataURI.swf`) The path to the FileToDataURI swf file.
* multiple - (boolean: defaults to `false`) Enable or disable multiple file selection (Not currently implemented in the flash file).

### Events:

* onSelect (function) The function to execute after the file selection; passed the files array, each entry contains the base64 encoded content of a file.

### Example:

#### HTML:

	<button id="file-button">Select an image</button>
	<div id="file-content"></div>

#### JavaScript:

	$('#file-button').FileToDataURI({
		onSelect: function(files) {
			// Select the first file
			var file = files[0];

			// Write his content in the document
			$('#file-content').text(file);
		}
	});

FileToDataURI Method: hide {#FileToDataURI:hide}
-------------------------------------------------------------------

Force to hide the Flash application by moving it off-screen.

### Syntax:

	$('#file-button').FileToDataURI('hide'));

### Returns:

* (object) jQuery collection.

### Notes:

 * This plugin needs [Adobe Flash](http://get.adobe.com/fr/flashplayer/) to works under IE7/8/9 and other browsers who do not support the File API.