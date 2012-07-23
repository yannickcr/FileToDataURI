(function($) {

	'use strict';

	var methods = {

		/*
		 * Constructor
		 */
		init : function( options ) {

			this.FileToDataURI.options = $.extend({}, this.FileToDataURI.defaults, options );

			this.each(function() {

				var $this = $(this),
					data = $this.data('FileToDataURI')
				;

				if ( data ) return; // Already extended element, skip

				$this.data('FileToDataURI', {
					target: $this,
					options: $this.FileToDataURI.options
				});

				$this.FileToDataURI( '_init' );
			});

			return this;
		},

		/*
		 * Initialize
		 */
		_init: function() {
			// Detect if FileReader is supported
			if (FileReader) this.FileToDataURI('_nativeInit');
			// If not, use the flash fallback
			else this.FileToDataURI('_flashInit');
		},

		/*
		 * Use the native browser technologies to select the file(s)
		 */
		_nativeInit: function() {
			// Create the file input
			var input = $('<input>').attr({
				type:'file',
				accept: this.data('FileToDataURI').options.allowedType + '/*',
				multiple: this.data('FileToDataURI').options.multiple
			});
			// Store the input reference
			this.data('FileToDataURI.input', input);

			// onChange event (triggered when one file is selected)
			input.on('change', function(e){
				this.FileToDataURI('_nativeRead', e);
			}.bind(this));

			// onClick event (triggered when the user click on the file selection button)
			this.on('click', function(){
				this.data('FileToDataURI.input').trigger('click');
			}.bind(this));
		},

		/*
		 * Use the native browser technologies to read the file(s)
		 */
		_nativeRead: function(e) {
			var
				files = e.target.files,        // Get the selected files
				filesL = files.length,         // Store the length
				fileReader = new FileReader(), // Create a new FileReader instance
				i = 0,                         // Init i
				filesData = [];                // Init an empty array to store the results
			;

			// onLoad event
			fileReader.onload = function (e) {
				// Push the file content in the result array
				filesData.push(e.target.result);

				// Call the callback function if we reach the end of the list
				if (filesData.length == filesL) this.data('FileToDataURI').options.onSelect(filesData);
				// Else read the next file
				else fileReader.readAsDataURL(files[++i]);
			}.bind(this);

			// Exit if there is no selected files
			if (filesL === 0) return;

			// Read the first selected file
			fileReader.readAsDataURL(files[0]);
		},

		/*
		 * Use the flash object to select the file(s)
		 */
		_flashInit: function(e) {

		},

		/*
		 * Use the native browser technologies to read the file(s)
		 */
		_flashRead: function(e) {

		}

	};

	$.fn.FileToDataURI = function( method ) {

		if ( methods[method] ) {
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ) );
		} else if ( typeof method === 'object' || !method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.FileToDataURI' );
		}

	};

	$.fn.FileToDataURI.defaults = {
		allowedType: 'image',
		allowedExts: ['jpg', 'jpeg', 'gif', 'png'],
		fileDescription: 'Images',
		multiple : false,
		onSelect: function(files) {}
	};

	$.fn.FileToDataURI.options  = {};

})(jQuery);