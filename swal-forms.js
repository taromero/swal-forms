(function() {
  // extend swal with a function for adding forms
  swal.withForm = function() {
    // initialize with field values supplied on `swal.withForm` call
    var swalForm = new SwalForm(arguments[0].formFields)
    // prevent successive calls to add duplicated form fields
    swalForm.removeSwalForm()
    // make form values inserted by the user available on `doneFunction`
    swalForm.addWayToGetFormValuesInDoneFunction(arguments)

    // forward arguments
    swal.apply({}, arguments)

    var htmlForm = swalForm.generateHtmlForm()
    swalForm.insertFormInSwalModal(htmlForm)
    swalForm.allowClickingDirectlyOnInputs()
    swalForm.focusOnFirstInput()
  }

  // constructor for helper object
  function SwalForm(formFields) {
    this.formFields = formFields
  }

  // helper methods
  extend(SwalForm.prototype, {
    formClass: 'swal-form',
    generateHtmlForm: function() {
      var formInnerHtml = this.formFields.map(toFormTag).reduce(toSingleString)
      return  '<div class="' + this.formClass + '">' + formInnerHtml + '</div>'

      function toFormTag(field) {
        var id = field.id || ''
        var placeholder = getPlaceholder(field)
        var value = field.value || ''
        var type = field.type || 'text'
        var clazz = getInputClass(field)

        return '<input class="' + clazz + '" type="' + type + '"' +
          ' id="' + id + '"' +
          ' placeholder="' + placeholder + '"' +
          ' name="' + field.name + '"' +
          ' value="' + value + '"' +
        '/>' + value

        function getPlaceholder(field) {
          var placeholder = field.placeholder
          if (!placeholder) {
            placeholder = id
              // insert a space before all caps
              .replace(/([A-Z])/g, ' $1')
              // uppercase the first character
              .replace(/^./, function(str){ return str.toUpperCase(); })
          }
          return placeholder
        }

        function getInputClass(field) {
          var clazz = ''
          if (field.type != 'checkbox' && field.type != 'radio') {
            clazz = 'nice-input'
          }
          return clazz
        }
      }

      function toSingleString(tagSting1, tagSting2) {
        return tagSting1 + tagSting2
      }
    },
    addWayToGetFormValuesInDoneFunction: function(swalArgs) {
      var self = this
      var doneFunction = swalArgs[1]
      swalArgs[1] = function() {
        // make form values available at `this` variable inside doneFunction
        this.swalForm = self.getFormValues()
        doneFunction.apply(this, arguments)
      }
    },
    getFormValues: function() {
      var inputHtmlCollection = document.querySelector('div.' + this.formClass).getElementsByTagName('input')
      var inputArray = [].slice.call(inputHtmlCollection)

      return inputArray.map(toValuableAttrs).reduce(toSingleObject)

      function toValuableAttrs(tag) {
        var attr = {}
        attr[tag.id || tag.name] = tag.value
        return attr
      }

      function toSingleObject(obj1, obj2) {
        return extend(obj1, obj2)
      }
    },
    insertFormInSwalModal: function(htmlFormString) {
      var formTag = stringToTag(htmlFormString)
      var sweetAlertModal = document.querySelector('.sweet-alert')
      var cancelButtonTag = sweetAlertModal.querySelector('.cancel')
      sweetAlertModal.insertBefore(formTag, cancelButtonTag)

      function stringToTag(string) {
        var div = document.createElement('div')
        div.innerHTML = string
        return div.firstChild
      }
    },
    removeSwalForm: function() {
      var formTag = document.querySelector('.' + this.formClass)
      formTag && document.querySelector('.sweet-alert').removeChild(formTag)
    },
    allowClickingDirectlyOnInputs: function() {
      // sweet-alert attaches an onblur handler which prevents clicks on of non
      // button elements until click is made on the modal
      document.querySelector('.sweet-alert button.confirm').onblur = function() {}
      document.querySelector('.sweet-alert button.cancel').onblur = function() {}
    },
    focusOnFirstInput: function() {
      var self = this
      setTimeout(function() {
        document.querySelector(getSelector()).focus();

        function getSelector() {
          return (self.formFields[0].id ? '#' + self.formFields[0].id : '[name="' + self.formFields[0].name + '"]')
        }
      })
    }
  })

  function extend(a, b){
    for (var key in b) {
      if (b.hasOwnProperty(key)) {
        a[key] = b[key]
      }
    }

    return a
  }
})()
