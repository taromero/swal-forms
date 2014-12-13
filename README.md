#### Swal-Forms

Plugin for the Sweet Alert lib that adds an extra method to have **forms inside the modals**.

It's totally unobtrusive with regular calls to `swal`, but it adds it a new method `swal.withForm` that wraps `swal` and lets you send an extra parameter `formFields` where you send the field data that will be use for generating the form.

For the time being, the only 2 accepted attributes are `id` and `placeholder`. `id` value will be used as the key for the object that will hold the element value.

It **sends the form attributes as an object to the callback function**. This values are added to `this.swalForm` as it seemed like a better option for preventing compatibility issues with other plugins (the other options I considered was sending it as the second argument).

### Example:

```javascript
swal.withForm({
    title: 'Cool Swal-Forms example',
    text: 'Any text that you consider useful for the form',
    showCancelButton: true,
    confirmButtonColor: '#DD6B55',
    confirmButtonText: 'Get form data!',
    closeOnConfirm: true,
    formFields: [
        { id: 'name', placeholder:'Name Field' },
        { id: 'nickname', placeholder:'Add a cool nickname' }
    ]
}, function(isConfirm) {
    // do whatever you want with the form data
    console.log(this.swalForm); // { name: 'user name', nickname: 'what the user sends' }
})
```

I need to add css to beautify the form :).

It's written without semicolons because that's the way we roll (and IMHO they are unnecessary if you now the cases where they are needed).