(function() {
  // extend swal with a function for adding forms
  swal.withForm = function() {
    // initialize with field values supplied on `swal.withForm` call
    var swalForm = new SwalForm(arguments[0].formFields)
    // prevent successive calls to add duplicated form fields
    swalForm.removeSwalForm()
    // make form values inserted by the user available at `doneFunction`
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
      var form = {
        clazz: this.formClass,
        innerHtml: this.formFields.map(toFormTag.bind(this)).reduce(toSingleString)
      }

      return t("<div class='{clazz}'>{innerHtml}</div>", form)

      function toFormTag(field) {
        var input = Input(field)
        // to separate groups of checkboxes and radiobuttons in different lines
        var conditionalLineBreak = (input.isRadioOrCheckbox() && this.lastFieldName != field.name) ? '<br>' : ''
        this.lastFieldName = field.name

        return conditionalLineBreak + input.toHtml()
      }
    },
    addWayToGetFormValuesInDoneFunction: function(swalArgs) {
      var swalFormInstance = this
      var doneFunction = swalArgs[1]
      swalArgs[1] = function() {
        // make form values available at `this` variable inside doneFunction
        this.swalForm = swalFormInstance.getFormValues()
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
      }

      function toValuableAttrs(tag) {
        var attr = {}
        attr[tag.id || tag.name] = tag.value
        return attr
      }

      function toSingleObject(obj1, obj2) {
        return extendPreventingOverrides(obj1, obj2)

        // for checkboxes we want to obtain all selected values in an array
        function extendPreventingOverrides(a, b) {
          Object.keys(b).forEach(addContentFromBtoA)
          return a

          function addContentFromBtoA(key) {
            if (a.hasOwnProperty(key)) {
              mergeIntoAnArray(a, b, key)
            } else {
              a[key] = b[key]
            }
          }
        }

        function mergeIntoAnArray(a, b, key) {
          if (Array.isArray(a[key])) {
            a[key].push(b[key])
          } else {
            a[key] = [a[key], b[key]]
          }
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
      var firstField = this.formFields[0]
      return (firstField.id ? t('#{id}', firstField) : t("[name='{name}']", firstField))
    },
    focusOnFirstInput: function() {
      setTimeout(focus.bind(this))

      function focus() {
        document.querySelector(this.getSelector()).focus();
      }
    },
    markFirstRadioButtons: function() {
      setTimeout(markAsChecked.bind(this))

      function markAsChecked() {
        document.querySelector(this.getSelector()).checked = true
      }
    }
  })

  function isRadioOrCheckbox(tag) {
    return tag.type == 'radio' || tag.type == 'checkbox'
  }

  function extend(o1, o2){
    for (var key in o2) {
      if (o2.hasOwnProperty(key)) {
        o1[key] = o2[key]
      }
    }
    return o1
  }

  function Input(field) {
    var input = {
      id: field.id || '',
      name: field.name || '',
      placeholder: field.placeholder || camelCaseToHuman(field.id),
      value: field.value || '',
      type: field.type || 'text',
      isRadioOrCheckbox: function() {
        return isRadioOrCheckbox(input)
      },
      toHtml: function() {
        return t("<input id='{id}' class='{clazz}' type='{type}' name='{name}'" +
                  " value='{value}' title='{placeholder}' placeholder='{placeholder}'>" +
                "<label for='{name}'>{label}</label>", input)
      }
    }
    input.label = input.isRadioOrCheckbox() ? input.value : ''
    input.clazz = !input.isRadioOrCheckbox() ? 'nice-input' : ''

    return input

    function camelCaseToHuman(arg) {
      if (arg) {
        return arg
          .replace(/([A-Z])/g, ' $1') // insert a space before all caps
          .replace(/^./, function(str){ return str.toUpperCase() }) // uppercase the first character
      } else {
        return ''
      }
    }
  }

  // string interpolation hack
  function t(template, data) {
    for (var key in data) {
      template = template.replace(new RegExp('{' + key + '}', 'g'), data[key])
    }
    return template
  }

  function toSingleString(s1, s2) {
    return s1 + s2
  }
})()
