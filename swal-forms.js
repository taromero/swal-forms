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
    swalForm.markFirstRadioButtons()
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
        var placeholder = field.placeholder || camelCaseToHuman(id)
        var value = field.label || field.value || ''
        var type = field.label || field.type || 'text'
        var clazz = (field.type != 'checkbox' && field.type != 'radio' ? 'nice-input' : '')

        return value + '<input class="' + clazz + '" type="' + type + '"' +
          ' id="' + id + '"' +
          ' placeholder="' + placeholder + '"' +
          ' name="' + field.name + '"' +
          ' value="' + value + '"' +
          ' title="' + placeholder + '"' +
        '/>'
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

      return inputArray
              .filter(uncheckedRadiosAndCheckboxes)
              .map(toValuableAttrs)
              .reduce(toSingleObject)

      function uncheckedRadiosAndCheckboxes(tag) {
        return (isRadioOrCheckbox(tag) ? tag.checked : true)

        function isRadioOrCheckbox(tag) {
          return tag.type == 'radio' || tag.type == 'checkbox'
        }
      }

      function toValuableAttrs(tag) {
        var attr = {}
        attr[tag.id || tag.name] = tag.value
        return attr
      }

      function toSingleObject(obj1, obj2) {
        return extendPreventingOverrides(obj1, obj2)

        function extendPreventingOverrides(a, b) {
          for (var key in b) {
            if (b.hasOwnProperty(key)) {
              if (a.hasOwnProperty(key)) {
                if (Array.isArray(a[key])) {
                  a[key] = a[key].push(b[key])
                } else {
                  a[key] = [a[key], b[key]]
                }
              } else {
                a[key] = b[key]
              }
            }
          }
          return a
        }
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
    getSelector: function() {
      return (this.formFields[0].id ? '#' + this.formFields[0].id : '[name="' + this.formFields[0].name + '"]')
    },
    focusOnFirstInput: function() {
      var self = this
      setTimeout(function() {
        document.querySelector(self.getSelector()).focus();
      })
    },
    markFirstRadioButtons: function() {
      var self = this
      setTimeout(function() {
        document.querySelector(self.getSelector()).checked = true
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

  function camelCaseToHuman(arg) {
    if (arg) {
      return arg
        // insert a space before all caps
        .replace(/([A-Z])/g, ' $1')
        // uppercase the first character
        .replace(/^./, function(str){ return str.toUpperCase() })
    } else {
      return ''
    }
  }
})()
