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
			this.attr('data-filetodatauri-id', Math.round(Math.random()*1e9));

			// Detect if FileReader is supported
			if (!FileReader) this.FileToDataURI('_nativeInit');
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
			this.data('FileToDataURI.flash', $('<object>').attr({
				codebase: 'http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=7',
				classid: 'clsid:d27cdb6e-ae6d-11cf-96b8-444553540000',
				type: 'application/x-oleobject'
			}));

			$('<param>').attr({
				name: 'src',
				value: '../src/FileToDataURI.swf'
			}).appendTo(this.data('FileToDataURI.flash'));

			$('<param>').attr({
				name: 'FlashVars',
				value: 'instanceId=' + this.attr('data-filetodatauri-id') + '&allowedType=' + this.data('FileToDataURI').options.allowedType + '&allowedExts=' + this.data('FileToDataURI').options.allowedExts + '&multiple=' + this.data('FileToDataURI').options.multiple
			}).appendTo(this.data('FileToDataURI.flash'));

			$('<embed>').attr({
				src: '../src/FileToDataURI.swf',
				FlashVars: 'instanceId=' + this.attr('data-filetodatauri-id') + '&allowedType=' + this.data('FileToDataURI').options.allowedType + '&allowedExts=' + this.data('FileToDataURI').options.allowedExts + '&multiple=' + this.data('FileToDataURI').options.multiple,
				type: 'application/x-shockwave-flash',
				pluginspage: 'http://www.adobe.com/go/getflashplayer'
			}).appendTo(this.data('FileToDataURI.flash'));

			$(document.body).append(this.data('FileToDataURI.flash'));
		},

		/*
		 * Use the native browser technologies to read the file(s)
		 */
		_flashRead: function(e) {

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

	$.fn.FileToDataURI.javascriptReceiver = function(id, filesData) {
		// Find the instance by id and call the callback function
		$('[data-filetodatauri-id=' + id + ']').data('FileToDataURI').options.onSelect([filesData]);
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