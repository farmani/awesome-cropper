# Reference jQuery
$ = jQuery

$.awesomeCropper = (inputAttachTo, options) ->
  # Default settings
  settings =
    width: 100
    height: 100
    debug: true

  # Merge default settings with options.
  settings = $.extend settings, options

  # Simple logger.
  log = (msg) ->
    console?.log msg if settings.debug

  # Input
  $inputAttachTo = $(inputAttachTo)

  input = (type) ->
    return $("<input type = \"#{type}\" />")

  div = () ->
    return $("<div/>")

  a = (text) ->
    return $("<a href=\"#\">#{text}</a>")

  image = () ->
    return $('<img/>')

  generateImputName = (f) ->
    name = $inputAttachTo.attr('name')
    if name.match /\]$/
      name.replace /\]$/, "_#{f}]"
    else
      name + "_#{f}"


  # Main box
  $container = div().insertAfter($inputAttachTo).addClass('awesome-cropper')

  $cropSandbox = $('<canvas></canvas>')
  $cropSandbox.attr
    width: settings.width
    height: settings.height

  $container.append($cropSandbox)

  # Inputs with URL, width, height, x, y
  $input_url = input('hidden').attr('name', generateImputName('url'))
  $input_x   = input('hidden').attr('name', generateImputName('x'))
  $input_y   = input('hidden').attr('name', generateImputName('y'))
  $input_w   = input('hidden').attr('name', generateImputName('w'))
  $input_h   = input('hidden').attr('name', generateImputName('h'))
  $container.append($input_url).append($input_x).append($input_y).append($input_w).append($input_h)

  # File chooser
  $fileSelect = input('file')
  $container.append(
    div().addClass('control-group')
      .append($fileSelect)
  )

  # URL input
  $urlSelect = input('text')
  $urlSelectButton = input('button')
  $urlSelectButton.val('Upload from url')

  $container.append(
    div().addClass('control-group form-inline')
      .append($urlSelect)
      .append($urlSelectButton)
  )

  # Progress bar
  $progressBar = div().addClass('progress progress-striped active hide').append(
    div().addClass('bar').css('width', '100%')
  )
  $container.append($progressBar)

  # Modal dialog with cropping
  $sourceIm = image()
  $applyButton = a('Apply').addClass('btn btn-primary')
  $cancelButton = a('Cancel').addClass('btn').attr
    'data-dismiss': "modal"
    'aria-hidden': "true"

  $imagesContainer = div().append(
    div().addClass('modal-body row-fluid').append(
      div().addClass('span9')
        .append($sourceIm)
    ).append(
      div().addClass('span3 preview')
      .append($cropSandbox)
    )
  ).append(
    div().addClass('modal-footer').append($cancelButton).append($applyButton)
  ).addClass('modal hide fade').attr
    role: 'dialog'
  $container.append($imagesContainer)

  # Plugin UI functions
  setLoading = () ->
    $progressBar.removeClass('hide')
 
  removeLoading = () ->
    $imagesContainer.modal()
    $progressBar.addClass('hide')

  setOriginalSize = (img) ->
    tempImage = new Image()

    tempImage.onload = () ->  
      width = tempImage.width
      img.attr
        'data-original-width': tempImage.width
        'data-original-height': tempImage.height

    tempImage.src = img.attr('src')

  setImages = (uri) ->
    $sourceIm.attr('src', uri).load ->
      setOriginalSize($sourceIm)
      removeLoading()
    setAreaSelect($sourceIm)

  cleanImages = () ->
    $sourceIm.attr('src', '')

  setAreaSelect = (image) ->
    image.imgAreaSelect
      aspectRatio: '1:1' 
      handles: true 
      onSelectEnd: (img, selection) =>
        r = $sourceIm.attr('data-original-width') / $sourceIm.width()
        console.log(r)
        context = $cropSandbox.get(0).getContext('2d')

        sourceX = Math.round(selection.x1 * r)
        sourceY = Math.round(selection.y1 * r)
        sourceWidth = Math.round(selection.width * r)
        sourceHeight = Math.round(selection.height * r)
        destX = 0;
        destY = 0;
        destWidth = settings.width;
        destHeight = settings.height;

        console.log(sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight)
     
        context.drawImage($sourceIm.get(0), sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight)
        $input_x.val(selection.x1);
        $input_y.val(selection.y1);
        $input_w.val(selection.width);
        $input_h.val(selection.height);

  removeAreaSelect = (image) ->
    image.imgAreaSelect
      remove: true

  # Plugin images loading function
  readFile = (file) ->
    reader = new FileReader()

    setLoading()

    reader.onload = (e) ->
      setImages(e.target.result)

    reader.readAsDataURL(file)

  handleDropFileSelect = (evt) ->
    evt.stopPropagation()
    evt.preventDefault()

    readFile(evt.originalEvent.dataTransfer.files[0])

  handleDragOver = (e) ->
    e.originalEvent.dataTransfer.dropEffect = "copy"
    e.stopPropagation()
    e.preventDefault()

  handleFileSelect = (evt) ->
    readFile(evt.target.files[0])

  saveCrop = () ->
    cleanImages()

  # Setup the listeners
  $fileSelect.bind('change', handleFileSelect)
  $container.bind('dragover', handleDragOver)
  $container.bind('drop', handleDropFileSelect)
  $urlSelectButton.click ->
    return unless $urlSelect.val().match(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/)
    setLoading()
    setImages($urlSelect.val())

  $cancelButton.click ->
    removeAreaSelect($sourceIm)

  $applyButton.click ->
    saveCrop()
    $imagesContainer.modal('hide')
    removeAreaSelect($sourceIm)


###
# jQuery Awesome Cropper plugin
#
# Copyright 2013 8xx8, vdv73rus
#
# v0.0.2
####
$.fn.extend
  awesomeCropper: (options) ->
    return @each ()->
      # Is there already an imgAreaSelect instance bound to this element? 
      if $(this).data("awesomeCropper")

        # Yes there is -- is it supposed to be removed? 
        if options.remove

          # Remove the plugin 
          $(this).data("awesomeCropper").remove()
          $(this).removeData "awesomeCropper"

          # Reset options 
        else
          $(this).data("awesomeCropper").setOptions options
      else unless options.remove
        # No exising instance -- create a new one 
        #
        $(this).data "awesomeCropper", new $.awesomeCropper(this, options)
      return $(this).data("awesomeCropper")  if options.instance
      this
