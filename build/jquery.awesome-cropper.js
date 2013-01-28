// Generated by CoffeeScript 1.4.0
(function() {
  var $;

  $ = jQuery;

  $.awesomeCropper = function(inputAttachTo, options) {
    var $applyButton, $cancelButton, $container, $cropSandbox, $fileSelect, $imagesContainer, $inputAttachTo, $progressBar, $resultIm, $sourceIm, $urlSelect, $urlSelectButton, a, cleanImages, div, handleDragOver, handleDropFileSelect, handleFileSelect, image, input, log, readFile, removeAreaSelect, removeLoading, saveCrop, setAreaSelect, setImages, setLoading, setOriginalSize, settings;
    settings = {
      width: 100,
      height: 100,
      debug: true
    };
    settings = $.extend(settings, options);
    log = function(msg) {
      if (settings.debug) {
        return typeof console !== "undefined" && console !== null ? console.log(msg) : void 0;
      }
    };
    $inputAttachTo = $(inputAttachTo);
    input = function(type) {
      return $("<input type = \"" + type + "\" />");
    };
    div = function() {
      return $("<div/>");
    };
    a = function(text) {
      return $("<a href=\"#\">" + text + "</a>");
    };
    image = function() {
      return $('<img/>');
    };
    $container = div().insertAfter($inputAttachTo).addClass('awesome-cropper');
    $cropSandbox = $('<canvas></canvas>');
    $cropSandbox.attr({
      width: settings.width,
      height: settings.height
    });
    $container.append($cropSandbox);
    $fileSelect = input('file');
    $container.append(div().addClass('control-group').append($fileSelect));
    $urlSelect = input('text');
    $urlSelectButton = input('button');
    $urlSelectButton.val('Upload from url');
    $container.append(div().addClass('control-group form-inline').append($urlSelect).append($urlSelectButton));
    $progressBar = div().addClass('progress progress-striped active hide').append(div().addClass('bar').css('width', '100%'));
    $container.append($progressBar);
    $resultIm = image();
    $container.append($resultIm);
    $sourceIm = image();
    $applyButton = a('Apply').addClass('btn btn-primary');
    $cancelButton = a('Cancel').addClass('btn').attr({
      'data-dismiss': "modal",
      'aria-hidden': "true"
    });
    $imagesContainer = div().append(div().addClass('modal-body row-fluid').append(div().addClass('span9').append($sourceIm)).append(div().addClass('span3 preview').append($cropSandbox))).append(div().addClass('modal-footer').append($cancelButton).append($applyButton)).addClass('modal hide fade').attr({
      role: 'dialog'
    });
    $container.append($imagesContainer);
    setLoading = function() {
      return $progressBar.removeClass('hide');
    };
    removeLoading = function() {
      $imagesContainer.modal();
      return $progressBar.addClass('hide');
    };
    setOriginalSize = function(img) {
      var tempImage;
      tempImage = new Image();
      tempImage.onload = function() {
        var width;
        width = tempImage.width;
        return img.attr({
          'data-original-width': tempImage.width,
          'data-original-height': tempImage.height
        });
      };
      return tempImage.src = img.attr('src');
    };
    setImages = function(uri) {
      $sourceIm.attr('src', uri).load(function() {
        setOriginalSize($sourceIm);
        return removeLoading();
      });
      return setAreaSelect($sourceIm);
    };
    cleanImages = function() {
      return $sourceIm.attr('src', '');
    };
    setAreaSelect = function(image) {
      var _this = this;
      return image.imgAreaSelect({
        aspectRatio: '1:1',
        handles: true,
        onSelectEnd: function(img, selection) {
          var context, destHeight, destWidth, destX, destY, r, sourceHeight, sourceWidth, sourceX, sourceY;
          r = $sourceIm.attr('data-original-width') / $sourceIm.width();
          console.log(r);
          context = $cropSandbox.get(0).getContext('2d');
          sourceX = Math.round(selection.x1 * r);
          sourceY = Math.round(selection.y1 * r);
          sourceWidth = Math.round(selection.width * r);
          sourceHeight = Math.round(selection.height * r);
          destX = 0;
          destY = 0;
          destWidth = settings.width;
          destHeight = settings.height;
          console.log(sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
          return context.drawImage($sourceIm.get(0), sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
        }
      });
    };
    removeAreaSelect = function(image) {
      return image.imgAreaSelect({
        remove: true
      });
    };
    readFile = function(file) {
      var reader;
      reader = new FileReader();
      setLoading();
      reader.onload = function(e) {
        return setImages(e.target.result);
      };
      return reader.readAsDataURL(file);
    };
    handleDropFileSelect = function(evt) {
      evt.stopPropagation();
      evt.preventDefault();
      return readFile(evt.originalEvent.dataTransfer.files[0]);
    };
    handleDragOver = function(e) {
      e.originalEvent.dataTransfer.dropEffect = "copy";
      e.stopPropagation();
      return e.preventDefault();
    };
    handleFileSelect = function(evt) {
      return readFile(evt.target.files[0]);
    };
    saveCrop = function() {
      var result;
      result = $cropSandbox.get(0).toDataURL();
      $resultIm.attr('src', result);
      $inputAttachTo.val(result);
      return cleanImages();
    };
    $fileSelect.bind('change', handleFileSelect);
    $container.bind('dragover', handleDragOver);
    $container.bind('drop', handleDropFileSelect);
    $urlSelectButton.click(function() {
      if (!$urlSelect.val().match(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/)) {
        return;
      }
      setLoading();
      return setImages($urlSelect.val());
    });
    $cancelButton.click(function() {
      return removeAreaSelect($sourceIm);
    });
    return $applyButton.click(function() {
      saveCrop();
      $imagesContainer.modal('hide');
      return removeAreaSelect($sourceIm);
    });
  };

  /*
  # jQuery Awesome Cropper plugin
  #
  # Copyright 2013 8xx8, vdv73rus
  #
  # v0.0.2
  */


  $.fn.extend({
    awesomeCropper: function(options) {
      return this.each(function() {
        if ($(this).data("awesomeCropper")) {
          if (options.remove) {
            $(this).data("awesomeCropper").remove();
            $(this).removeData("awesomeCropper");
          } else {
            $(this).data("awesomeCropper").setOptions(options);
          }
        } else if (!options.remove) {
          $(this).data("awesomeCropper", new $.awesomeCropper(this, options));
        }
        if (options.instance) {
          return $(this).data("awesomeCropper");
        }
        return this;
      });
    }
  });

}).call(this);
