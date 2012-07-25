/* 
* Copyright (C) 2012 Yannick Croissant
* Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php 
* FileToDataURI.as : FileToDataURI is a jQuery plugin that allow you to retrieve the content (base64 encoded) of a local file using the HTML5 File API or using a Flash application if the File API is not available.
* Authors :
* - Yannick Croissant, https://github.com/Country
* - Jean-Philippe Auclair for the Base64 library, http://jpauclair.net
*/
package {
	// Imports
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.display.Sprite;
	import flash.display.StageScaleMode;
	import flash.net.FileReference;
	import flash.net.FileFilter;
	import flash.utils.ByteArray;
	import flash.external.ExternalInterface;

	public class FileToDataURI extends Sprite {

		// Flash vars
		private var flashvars:Object = stage.loaderInfo.parameters;
		private var id:int = flashvars['id'] || 0;
		private var allowedType:String = flashvars['allowedType'] || 'image';
		private var allowedExts:Array = flashvars['allowedExts'] ? flashvars['allowedExts'].split(',') : new Array('jpg', 'jpeg', 'gif', 'png');
		private var fileDescription:String = flashvars['fileDescription'] || 'Images';
		private var multiple:Boolean = flashvars['multiple'] || false; // Unused

		private var ext:String;
		private var button:Sprite;
		private var javascriptReceiver:String = 'jQuery.fn.FileToDataURI.javascriptReceiver';
		private var fileRef:FileReference = new FileReference();
		private var TypesList:FileFilter = new FileFilter(fileDescription + '(*.' + allowedExts.join(', *.') + ')', '*.' + allowedExts.join('; *.'));
		private var Types:Array = new Array(TypesList);
		private	var extPattern:RegExp = /(.*)\.([a-z0-9]*)$/gi;
		private static const _encodeChars:Vector.<int> = InitEncoreChar();
		
		public function FileToDataURI() {
			stage.scaleMode = StageScaleMode.EXACT_FIT;
			
			button = new Sprite();
			button.buttonMode = true;
			button.useHandCursor = true;
			button.graphics.beginFill(0xCCFF00);
			button.graphics.drawRect(0, 0, 500, 500);
			button.alpha = 0.0;
			addChild(button);

			button.addEventListener(MouseEvent.CLICK, browseFiles);
			fileRef.addEventListener(Event.SELECT, onFileSelected);
			fileRef.addEventListener(Event.COMPLETE, onComplete);
		}

		private function sendFileData(base64:String):void {
			ext = fileRef.name.replace(extPattern, '$2').toLowerCase();

			if (allowedExts.indexOf(ext) !== -1) ExternalInterface.call(javascriptReceiver, id, 'data:' + allowedType + '/' + ext + ';base64,' + base64);
			return;
		}
		
		private function browseFiles(evt:MouseEvent):void {
			fileRef.browse(Types);
		}
		
		private function onFileSelected(event:Event):void {
			fileRef.load();
		}

		public function onComplete(evt:Event):void {
			sendFileData(encode(fileRef.data));
		}

		/* 
		* Copyright (C) 2012 Jean-Philippe Auclair 
		* Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php 
		* Base64 library for ActionScript 3.0. 
		* By: Jean-Philippe Auclair : http://jpauclair.net 
		* Based on article: http://jpauclair.net/2010/01/09/base64-optimized-as3-lib/ 
		* Benchmark: 
		* This version: encode: 260ms decode: 255ms 
		* Blog version: encode: 322ms decode: 694ms 
		* as3Crypto encode: 6728ms decode: 4098ms 
		* 
		* Encode: com.sociodox.utils.Base64 is 25.8x faster than as3Crypto Base64 
		* Decode: com.sociodox.utils.Base64 is 16x faster than as3Crypto Base64 
		* 
		* Optimize & Profile any Flash content with TheMiner ( http://www.sociodox.com/theminer ) 
		*/
		public static function encode(data:ByteArray):String {
			var out:ByteArray = new ByteArray();
			//Presetting the length keep the memory smaller and optimize speed since there is no "grow" needed
			out.length = (2 + data.length - ((data.length + 2) % 3)) * 4 / 3; //Preset length //1.6 to 1.5 ms
			var i:int = 0;
			var r:int = data.length % 3;
			var len:int = data.length - r;
			var c:uint; //read (3) character AND write (4) characters
			var outPos:int = 0;
			while (i < len)	{
				//Read 3 Characters (8bit * 3 = 24 bits)
				c = data[int(i++)] << 16 | data[int(i++)] << 8 | data[int(i++)];
				
				out[int(outPos++)] = _encodeChars[int(c >>> 18)];
				out[int(outPos++)] = _encodeChars[int(c >>> 12 & 0x3f)];
				out[int(outPos++)] = _encodeChars[int(c >>> 6 & 0x3f)];
				out[int(outPos++)] = _encodeChars[int(c & 0x3f)];
			}
			
			if (r == 1) { // Need two "=" padding
				//Read one char, write two chars, write padding
				c = data[int(i)];
				
				out[int(outPos++)] = _encodeChars[int(c >>> 2)];
				out[int(outPos++)] = _encodeChars[int((c & 0x03) << 4)];
				out[int(outPos++)] = 61;
				out[int(outPos++)] = 61;
			} else if (r == 2) { //Need one "=" padding
				c = data[int(i++)] << 8 | data[int(i)];
				
				out[int(outPos++)] = _encodeChars[int(c >>> 10)];
				out[int(outPos++)] = _encodeChars[int(c >>> 4 & 0x3f)];
				out[int(outPos++)] = _encodeChars[int((c & 0x0f) << 2)];
				out[int(outPos++)] = 61;
			}
			
			return out.readUTFBytes(out.length);
		}
		
		public static function InitEncoreChar():Vector.<int> {
			var encodeChars:Vector.<int> = new Vector.<int>(64, true);
			
			// We could push the number directly
			// but I think it's nice to see the characters (with no overhead on encode/decode)
			var chars:String = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
			for (var i:int = 0; i < 64; i++) {
				encodeChars[i] = chars.charCodeAt(i);
			}
			
			return encodeChars;
		}
	}
}