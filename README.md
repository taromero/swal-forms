### Swal-Forms

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

Plugin for the [Sweet Alert](https://github.com/t4t5/sweetalert) lib, which adds an extra method to have **forms inside the modals**.

#### Live Demo
https://cdn.rawgit.com/taromero/swal-forms/master/live-demo/live-demo.html

Check `live-demo/live-demo.js` to see example's code.

##### Screenshot

![Example](https://raw.githubusercontent.com/taromero/swal-forms/master/sample-screenshot.png)

#### Description

Being unobtrusive with regular calls to `swal`, it adds a new method `swal.withForm` that wraps `swal` and lets you send an extra parameter `formFields` where you send the field data that will be used for generating the form.

(`id` || `name`) value will be used as the key for the object that will hold the element value.

It **sends the form attributes as an object to the callback function**. 

##### Example:

```javascript
swal.withForm({
    title: 'Cool Swal-Forms example',
    text: 'Any text that you consider useful for the form',
    showCancelButton: true,
    confirmButtonColor: '#DD6B55',
    confirmButtonText: 'Get form data!',
    closeOnConfirm: true,
    formFields: [
        { id: 'name', placeholder:'Name Field', required },
        { id: 'nickname', placeholder:'Add a cool nickname' }
    ]
}, function(isConfirm) {
    // do whatever you want with the form data
    console.log(this.swalForm) // { name: 'user name', nickname: 'what the user sends' }
})
```

If no placeholder is supplied, it will be inferred from the id field. Example:

```javascript
swal.withForm({
    title: 'Cool Swal-Forms example with no explicit placeholder',
    formFields: [
        { id: 'sampleIdField'}
    ]
}, function(isConfirm) {
    // do whatever you want with the form data
    console.log(this.swalForm) // { name: 'user name', nickname: 'what the user sends' }
})
```

This will show the input with "Sample Id Field" as the placeholder. If no placeholder is wanted, you have to explicitly set it to ' ' (or any empty string).

##### Promises
In order for this to work, you need to either add a promises library, or run this on an environment which supports promises.

The `withFromAsync` wrapper is available to use, which lets you use promises to avoid nested callbacks in some cases. Example:

```javascript
swal.withFormAsync({
  // same options
}).then(function (context) {
  console.log(context._isConfirm) // isConfirm comes in this attribute
  console.log(context.swalForm) // getting context from the parameter rather than `this`, as it is difficult to bind on promises
})
```

##### Usage
Just add the css and js files after sweet alert ones.
