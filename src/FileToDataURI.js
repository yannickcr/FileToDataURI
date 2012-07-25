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
		init : function( options ) {

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

		/*
		 * Initialize
		 */
		_init: function() {
			var id = Math.round(Math.random()*1e9);
			this.data('FileToDataURI.id', id);
			this.attr('data-filetodatauri-id', id);

			// Detect if FileReader is supported
			if (typeof FileReader == 'function') this.FileToDataURI('_nativeInit');
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
				flashvars = 'id=' + this.data('FileToDataURI.id') + '&allowedType=' + this.data('FileToDataURI').options.allowedType + '&allowedExts=' + this.data('FileToDataURI').options.allowedExts.join(',') + '&fileDescription=' + this.data('FileToDataURI').options.fileDescription + '&multiple=' + this.data('FileToDataURI').options.multiple;
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
					zIndex = el.css('z-index')
				;
				
				el.data('FileToDataURI.flash').css({
					top: coords.top + 'px',
					left: coords.left + 'px',
					width: el.outerWidth() + 'px',
					height: el.outerHeight() + 'px',
					'z-index': zIndex
				});
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
		// Find the instance by id and call the callback function
		$('[data-filetodatauri-id=' + id + ']').data('FileToDataURI').options.onSelect([filesData]);
	};

	$.fn.FileToDataURI.defaults = {
		allowedType: 'image',
		allowedExts: ['jpg', 'jpeg', 'gif', 'png'],
		fileDescription: 'Images',
		moviePath: 'FileToDataURI.swf',
		multiple : false, // TODO: not implemented in the flash file
		onSelect: function(files) {}
	};

	$.fn.FileToDataURI.options  = {};

})(jQuery);