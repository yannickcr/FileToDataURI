FileToDataURI
====

FileToDataURI is a jQuery plugin that allow you to retrieve the content (base64 encoded) of a local file using the HTML5 File API or using a Flash application if the File API is not available.

It can be very useful under some not-so-modern browsers like IE7/8/9.

How to use
----------

You can find the full documentation in the ["docs" directory](https://github.com/yannickcr/FileToDataURI/blob/master/docs).

### Example

HTML:

	<button id="file-button">Select an image</button>
	<div id="file-content"></div>

JavaScript:

	$('#file-button').FileToDataURI({
		onSelect: function(files) {
			// Select the first file
			var file = files[0];

			// Write his content in the document
			$('#file-content').text(file);
		}
	});

You can see a working example in the ["example" directory](https://github.com/yannickcr/FileToDataURI/blob/master/example).

Flash application compilation
-----------

Install the [Flex SDK](https://www.adobe.com/devnet/flex/flex-sdk-download.html) and run the following command :

	$ ./bin/mxmlc FileToDataURI.as

And that's it !

TODO
------

* Multiple file selection
* Better mime-type generation

Licenses
----------

FileToDataURI.as is licensed under the [MIT License](http://www.opensource.org/licenses/mit-license.php).

The Base64 library, by [Jean-Philippe Auclair](http://jpauclair.net), is licensed under the [MIT License](http://www.opensource.org/licenses/mit-license.php).