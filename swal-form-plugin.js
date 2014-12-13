swal.withForm = function() {
  var swalForm = new SwalForm(arguments[0].formFields)
  swalForm.removeSwalForm()
  swalForm.addWayToGetFormValuesInDoneFunction(arguments)

  // forward arguments
  swal.apply({}, arguments)

  var htmlForm = swalForm.generateHtmlForm()
  swalForm.insertFormInSwalModal(htmlForm)
  swalForm.makeInputsWritable()
}

function SwalForm(formFields) {
  this.formFields = formFields
}

extend(SwalForm.prototype, {
  formClass: 'swalForm',
  generateHtmlForm: function() {
    var formInnerHtml = this.formFields.map(toFormTag).reduce(toSingleString)
    return  '<div class="' + this.formClass + '">' + formInnerHtml + '</div>'

    function toFormTag(field) {
      return '<input' +
        ' id="' + field.id + '"' +
        ' placeholder="' + field.placeholder + '"' +
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
      attr[tag.id] = tag.value
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
  makeInputsWritable: function() {
    document.querySelector('.sweet-alert').removeAttribute('tabIndex')
  },
  removeSwalForm: function() {
    var formTag = document.querySelector('.' + this.formClass)
    formTag && document.querySelector('.sweet-alert').removeChild(formTag)
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