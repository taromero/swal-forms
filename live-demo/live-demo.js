window.onload = function () {
  document.querySelector('#sample1').addEventListener('click', sample1)
  document.querySelector('#complex').addEventListener('click', complex)
}

function sample1 () {
  swal.withForm({
    title: 'Cool Swal-Forms example',
    text: 'Any text that you consider useful for the form',
    showCancelButton: true,
    confirmButtonColor: '#DD6B55',
    confirmButtonText: 'Get form data!',
    closeOnConfirm: true,
    formFields: [
        { id: 'name', placeholder: 'Name Field' },
        { id: 'nickname', placeholder: 'Add a cool nickname' }
    ]
  }, function (isConfirm) {
    // do whatever you want with the form data
    console.log(this.swalForm) // { name: 'user name', nickname: 'what the user sends' }
  })
}

function complex () {
  swal.withForm({
    title: 'More complex Swal-Forms example',
    text: 'This has different types of inputs',
    showCancelButton: true,
    confirmButtonColor: '#DD6B55',
    confirmButtonText: 'Get form data!',
    closeOnConfirm: true,
    formFields: [
      { id: 'name', placeholder: 'Name Field' },
      { id: 'nickname', placeholder: 'Add a cool nickname' },
      { id: 'password', type: 'password' },

      { name: 'sex', value: 'Male', type: 'radio' },
      { name: 'sex', value: 'Female', type: 'radio' },

          { name: 'skills', value: 'JS', type: 'checkbox' },
          { name: 'skills', value: 'Ruby', type: 'checkbox' },
          { name: 'skills', value: 'Java', type: 'checkbox' },

          { id: 'select', type: 'select',options: [
            {value:"test1",text: "test1"},
            {value:"test2",text: "test2"},
            {value:"test3",text: "test3"},
            {value:"test4",text: "test4"},
            {value:"test5",text: "test5"}
          ]},
      ]
  }, function(isConfirm) {
      // do whatever you want with the form data
      console.log(this.swalForm); // { name: 'user name', nickname: 'what the user sends' }
  })
}
