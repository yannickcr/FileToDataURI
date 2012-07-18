FileToDataURI.as
====

An ActionScript application that allow you to retrieve the content (base64 encoded) of a local file without the use of HTML5 File API.

It can be very useful under some not-so-modern browsers like IE9.

How to use
----------

Place the Flash object hover the button used to select a file. The object will catch the user click and ask him to select a file.

The flash application is compiled to allow only jpg, png and gif files, but you can easily customize this behavior by changing the parameters in the ActionScript file.

On file selection, the file content will be sent (base64 encoded) as parameter to the javascript function Flash.getFileData (you can also configure this function name in the ActionScript file).

### Example

HTML:

	<div>
		<div class="button">
			<button id="file-button">Select an image</button>
			<!--[if IE]>
			<object id="file-object" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0">
				<param name="movie" value="FileToDataURI.swf" />
				<param name="allowScriptAccess" value="always" />
				<param name="wmode" value="transparent" />
			</object>
			<![endif]-->
			<input id="file-input" type="file" accept="image/*" />
		</div>
	</div>
	<img id="file-preview" src="" />

CSS:

	/* Use .button as a container for the real button and the invisible flash object */
	.button {
		display: inline-block;
		position: relative;
	}

	/* Hide the file input */
	#file-input {
		position: absolute;
		left: -9999em;
	}

	/* Style the flash object to cover the real button (the background prevents the cursor to go 'throught' the transparent object) */
	#file-object {
		background: rgba(0,0,0,0);
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
	}

JavaScript:

	var
		// Retrieve the file from Flash
		Flash = {
			getFileData: function(base64) {
				// do stuffs with the file content
			}
		}
	;

You can see a full example in the ["example" directory](https://github.com/Country/FileToDataURI.as/blob/master/example).

TODO
------

* Build a javascript library to ease application use.
* Evolve as a Polyfill ?

Licenses
----------

FileToDataURI.as is licensed under the [MIT License](http://www.opensource.org/licenses/mit-license.php).

The Base64 library, by [Jean-Philippe Auclair](http://jpauclair.net), is licensed under the [MIT License](http://www.opensource.org/licenses/mit-license.php).