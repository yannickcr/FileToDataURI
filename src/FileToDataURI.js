/*
* Copyright (C) 2012 Yannick Croissant
* Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
* FileToDataURI.as : FileToDataURI is a jQuery plugin that allow you to retrieve the content (base64 encoded) of a local file using the HTML5 File API or using a Flash application if the File API is not available.
* Authors :
* - Yannick Croissant, https://github.com/Country
*/
(function($) {

	'use strict';

	var methods = {

		/*
		 * Constructor
		 */
		init: function( options ) {

			this.FileToDataURI.options = $.extend({}, this.FileToDataURI.defaults, options);

			this.each(function() {

				var $this = $(this),
					data = $this.data('FileToDataURI')
				;

				if ( data ) return; // Already extended element, skip

				$this.data('FileToDataURI', {
					target: $this,
					options: $this.FileToDataURI.options
				});

				$this.FileToDataURI('_init');
			});

			return this;
		},

		hide: function() {
			if (this.data('FileToDataURI.context') == 'flash') this.FileToDataURI('_flashHide');
			return this;
		},

		/*
		 * Initialize
		 */
		_init: function() {
			var
				id = Math.round(Math.random()*1e9),
				context = typeof FileReader == 'function' ? 'native' : 'flash' // Detect if FileReader is supported or not
			;

			if ( this.data('FileToDataURI').options.forceFlash ) {
				context = 'flash';
			}


			this.data('FileToDataURI.id', id);
			this.attr('data-filetodatauri-id', id);
			this.data('FileToDataURI.context', context);

			// Call the context-related constructor
			this.FileToDataURI('_' + context + 'Init');
		},

		/*
		 * Use the native browser technologies to select the file(s)
		 */
		_nativeInit: function() {
			this.data( 'FileToDataURI.context', 'native' );
			this.data('FileToDataURI.input', input);

			// Create the file input
			var input =
				$('<input>')
					.attr({
						type:'file',
						accept: this.data('FileToDataURI').options.allowedExts.map(prefixDot).join(','),
						multiple: this.data('FileToDataURI').options.multiple,
						style: 'position:absolute;left:-9999px'
					})
					.css({
						position: 'absolute',
						left: '-9999px'
					});
			// Inject the input in the body (the click event will not work under Opera if the element is not in the DOM)
			$(document.body).append(input);
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

			function prefixDot( arrayItem ) {
				return '.' + arrayItem;
			}
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
				filesData = [],                // Init an empty array to store the results,
				currentFileName = ''		   // Keep track of the file name
			;

			// onLoad event
			fileReader.onload = function (e) {
				// Push the file content in the result array
				filesData.push({
					name : currentFileName,
					data : e.target.result
				});


				if (filesData.length == filesL) {
					// Call the callback function if we reach the end of the list
					this.data('FileToDataURI').options.onSelect(filesData);
				} else {
					// Else read the next file
					processFile( files[ ++i ] );
				}
			}.bind(this);

			// Exit if there is no selected files
			if (filesL === 0) return;

			// Read the first selected file
			processFile( files[0] );

			function processFile( file ) {
				// Hang on to the current file as global
				currentFileName = file.name;
				fileReader.readAsDataURL( file );
			}
		},

		/*
		 * Use the flash object to select/read the file(s)
		 */
		_flashInit: function(e) {
			// Construct the flash container
			this.data('FileToDataURI.flash',
				$('<div>')
					.attr({
						id: 'FileToDataURIContainer' + this.data('FileToDataURI.id')
					})
					.css({
						overflow: 'hidden',
						position: 'absolute',
						height: '1px',
						left: '-9999px',
						width: '1px'
					})
			);

			// Construct the flash object
			var
				html,
				flashvars = 'id=' + this.data('FileToDataURI.id') + '&allowedExts=' + this.data('FileToDataURI').options.allowedExts.join(',') + '&fileDescription=' + this.data('FileToDataURI').options.fileDescription + '&multiple=' + this.data('FileToDataURI').options.multiple
			;
			// Internet Explorer
			if ($.browser.msie) {
				html = '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="//download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" width="500" height="500" id="FileToDataURI' + this.data('FileToDataURI.id') + '" align="middle">' +
							'<param name="allowScriptAccess" value="always" />' +
							'<param name="movie" value="' + this.data('FileToDataURI').options.moviePath + '" />' +
							'<param name="flashvars" value="' + flashvars + '"/>' +
							'<param name="wmode" value="transparent"/>' +
						'</object>';
			// Others
			} else {
				html = '<embed id="FileToDataURI' + this.data('FileToDataURI.id') + '" src="' + this.data('FileToDataURI').options.moviePath + '" width="500" height="500" name="FileToDataURI' + this.data('FileToDataURI.id') + '" align="middle" allowScriptAccess="always" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" flashvars="' + flashvars + '" wmode="transparent" />';
			}

			// Insert the flash object in the container
			this.data('FileToDataURI.flash').html(html);

			// Insert the container object in the page
			$(document.body).append(this.data('FileToDataURI.flash'));

			// Move the flash container hover the element when needed
			this.on('mouseover', function(e){

				var
					el = $(this),
					coords = el.offset(),
					zIndex = 2147483647 // Max z-index allowed by most browsers
				;

				el.data('FileToDataURI.flash').css({
					top: coords.top + 'px',
					left: coords.left + 'px',
					width: el.outerWidth() + 'px',
					height: el.outerHeight() + 'px',
					'z-index': zIndex
				});
			});
		},

		_flashHide: function() {
			this.data('FileToDataURI.flash').css({
				left: '-9999px'
			});
		}
	};

	$.fn.FileToDataURI = function( method ) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' + method + ' does not exist on jQuery.FileToDataURI');
		}
	};

	/*
	 * Flash callback
	 */
	$.fn.FileToDataURI.javascriptReceiver = function(id, filesData) {
		// Find the instance by id
		var el = $('[data-filetodatauri-id="' + id + '"]');
		// Hide the flash
		el.FileToDataURI('hide');
		// Call the callback function by wrapping it in an array - could we do this in Flash?
		// el.data('FileToDataURI').options.onSelect([filesData]);
		el.data('FileToDataURI').options.onSelect(filesData);
	};

	/*
		Flash helper debug during development
	 */
	$.fn.FileToDataURI.log = function(message) {
		console.log('From FileToDataURI.swf: ', message);
	};

	$.fn.FileToDataURI.defaults = {
		allowedExts: ['jpg', 'jpeg', 'gif', 'png'],
		fileDescription: 'Images',
		moviePath: 'FileToDataURI.swf',
		multiple : false, // TODO: not implemented in the flash file
		onSelect: function(files) {}
	};

	$.fn.FileToDataURI.options  = {};

})(jQuery);