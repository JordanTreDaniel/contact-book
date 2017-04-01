$(document).ready( function() {

  // localStorage.clear();

  // Initialize the contacts objects
  if (localStorage.getItem('myContacts')) {
    contacts = JSON.parse(localStorage.getItem('myContacts'));
    populateTable();
  } else {
    contacts = [
    ];
  }

  //push to localStorage
  function saveToStorage() {
    localStorage.setItem('myContacts', JSON.stringify(contacts));
  }


  //constructor function
  function Contact() {
    this.portrait;
    this.firstName;
    this.lastName;
    this.number;
  }

  function newContact(fn, ln, img, nbr) {
    var person = new Contact();
    person.firstName = fn;
    person.lastName = ln;
    person.portrait = img;
    person.number = nbr;
    console.log(person);
    //add to array
    contacts.push(person);
    //add to localStorage
    saveToStorage();
  }
  //clearTable
  function clearTable() {
    $('#table-body').empty();
  }
  // populateTable
  function populateTable(array) {
    for (var i in array) {
      tableAContact(array[i]);
    }
  }
  function createViewingLink() {
    var a = $(document.createElement('a'));
    a.attr('data-toggle', 'modal');
    a.attr('data-target', '#home-modal');
    a.attr('class', 'modl');
    a.attr('href', '#');
    return a;
  }
  //tableAContact
  function tableAContact(contact) {
    var table = $('#table-body');
    //create a row
    var row = $(document.createElement('tr'));
    row.appendTo(table);
    //create picture cell as link
    var picLink = createViewingLink();

    var idName = "idName";
    idName = (contact.firstName + contact.lastName);
    debugger;
    idName = idName.replace(/\b\s/g, idName);
    picLink.attr('id', idName);
    var portrait = $(document.createElement('td'));
    picLink.html('<img class="img-thumbnail" src="' + contact.portrait + '">');
    picLink.appendTo(portrait);
    portrait.appendTo(row);
    //create name cell as link
    var name = $(document.createElement('td'));
    var nameLink = createViewingLink();
    nameLink.attr('id', idName);
    nameLink.html(contact.firstName + " " + contact.lastName);
    nameLink.appendTo(name);
    name.appendTo(row);
    //create number cell
    var number = $(document.createElement('td'));
    var numLink = createViewingLink();
    numLink.attr('id', idName);
    numLink.html(contact.number);
    numLink.appendTo(number);
    number.appendTo(row);
    // I want icons that lead to https://globfone.com/
  }

  function searchByName(input) {
    //turn it to a RegExp
    var item = new RegExp(input);
    //filter contacts to create a new array with matched elements
    var matchedContacts = [];
    for (var i in contacts) {
      var named = contacts[i].firstName + ' ' + contacts[i].lastName;
      if (item.test(named)) {
        matchedContacts.push(contacts[i]);
      }
    }
    return matchedContacts;
  }


  // ********************************************************************************************
// NEW CONTACT NEW CONTACT
// *********************************************************************************************
if ('#createNewContact') {
  $('#createNewContact').click(function(e){
    // e.preventDefault();
    var expression = new RegExp(/\d{3}[\-]\d{3}[\-]\d{4}$/);
    //We only want contact to be created if first name and correct number
    if (expression.test($('#contact-number').val()) && $('#contact-first-name').val()) {
      var num = $('#contact-number').val();
      var first = $('#contact-first-name').val();
      first = first.replace(/\b\w/g, l => l.toUpperCase());
      var last = $('#contact-last-name').val();
      last = last.replace(/\b\w/g, l => l.toUpperCase());
      var pic = $('#contact-photo').val();
      newContact(first, last, pic, num);
    } else {
      e.preventDefault();
      alert('First name and valid number required');
    }
    //clear the form
    $('#createNewContact').closest('input').val('');
  });

}





// *********************************************************************************************
//HOME PAGE HOME PAGE
// *********************************************************************************************
  if ($('#home')) {
    // Initialize the contacts objects
    if (localStorage.getItem('myContacts')) {
      contacts = JSON.parse(localStorage.getItem('myContacts'));
      populateTable(contacts);
    } else {
      contacts = [];
    }
    //facilitation of search form
    var searching = $('#search');
    //Event Listener
    searching.keypress(function() {
      clearTable();
      // if (searching.val()) {
      var value = searching.val();
      value = value.replace(/\b\w/g, l => l.toUpperCase());
      var matched = searchByName(value);
      populateTable(matched);
      // }
      if ($('#search').val() === "") {
        clearTable();
        populateTable(contacts);
      }
      //clear storage button
      $('#clearStorage').click(function() {
        clearTable();
        localStorage.clear();
      });
    });
    //Eliminates issue with input value lag by loading
    //the keypress function a 2nd time for every key-stroke
    searching.keyup(function() {
      searching.keypress();
    });

    //modal event Listener
    $('.modl').click(function(e) {
      //find correct contacts
      var t = $(e.target).attr('id');
      var x = 0;
      var fountIt = false;
      while(x < contacts.length && fountIt === false) {
        var aim = (contacts[x].firstName + contacts[x].lastName);
        aim = aim.replace(/\b\s/g, aim);
        if (t == aim) {
          fountIt = true;
          x -= 1;
        } else {
          console.log("couldnt find it");
        }
        x++;
      } //while

      //prefill info into form
      $('#home-modal-header').html(contacts[x].firstName + ' ' + contacts[x].lastName);
      $('#home-modal-number').html(contacts[x].number);
      $('#home-modal-image').attr('src', contacts[x].portrait);
    });
  }//home-page




  // *********************************************************************************************
  //Editing Page
  // *********************************************************************************************
  if ($('#contact-page')) {

    //make pop up modal possible
    function createEditLink() {
      var a = $(document.createElement('a'));
      //set modal attrs
      a.attr('data-toggle', 'modal');
      a.attr('data-target', '#edit-modal');
      //set other attrs
      a.attr('href', '#');
      a.attr('class', 'targeted');
      return a;
    }
    //load table
    //tableAContactEdits
    function tableAContactEdits(contact) {
      var table = $('#editing-table');
      //create a row
      var row = $(document.createElement('tr'));
      row.appendTo(table);
      //create picture cell as link
      var picLink = createEditLink();
      var idName = (contact.firstName + contact.lastName).replace(/\b\s/g, '');
      var portrait = $(document.createElement('td'));
      picLink.html('<img id="' + idName + '" class="img-thumbnail ' + contact.firstName + '" src="' + contact.portrait + '">');
      picLink.appendTo(portrait);
      portrait.appendTo(row);
      //create name cell as link
      var name = $(document.createElement('td'));
      var nameLink = createEditLink();
      nameLink.attr('id', idName);
      nameLink.html(contact.firstName + " " + contact.lastName);
      nameLink.appendTo(name);
      name.appendTo(row);
      //create number cell
      var number = $(document.createElement('td'));
      var numLink = createEditLink();
      numLink.attr('id', idName);
      numLink.html(contact.number);
      numLink.appendTo(number);
      number.appendTo(row);
      // I want icons that lead to https://globfone.com/
    }

    for (var i in contacts) {
      tableAContactEdits(contacts[i]);
    }
    $('#editing-table a').click(function(e) {
      //find correct contacts
      var t = $(e.target).attr('id');
      var x = 0;
      var fountIt = false;
      while(x < contacts.length && fountIt === false) {
        var name = (contacts[x].firstName + contacts[x].lastName).replace(/\b\s/g, '');
        if (t == name) {
          fountIt = true;
          x -= 1;
          console.log('found it');
        } else {
          console.log("couldnt find it");
        }
        x++;
      } //while

      //prefill info into form
      $('#contact-new-first-name').val(contacts[x].firstName);
      $('#contact-new-last-name').val(contacts[x].lastName);
      $('#contact-new-number').val(contacts[x].number);
      $('#contact-new-photo').val(contacts[x].portrait);

      //Now acutally edit the contact
      $('#saveChanges').click(function () {
        var expression = new RegExp(/\d{3}[\-]\d{3}[\-]\d{4}$/);
        //We only want contact to be created if first name and correct number
        if (expression.test($('#contact-new-number').val()) && $('#contact-new-first-name').val()) {
          var first = ($('#contact-new-first-name').val());
          first = first.replace(/\b\w/g, l => l.toUpperCase());
          contacts[x].firstName = first;
          var last = ($('#contact-new-last-name').val()).replace(/\b\w/g, l => l.toUpperCase());
          contacts[x].lastName = last;
          contacts[x].number = $('#contact-new-number').val();
          contacts[x].portrait = $('#contact-new-photo').val();
          saveToStorage();
          console.log("should be changing it");
          $('#editing-table').empty();
          for (var i in contacts) {
            tableAContactEdits(contacts[i]);
          }
        }//if
      }); //saveChanges

    });//editing-table modal

    var searching = $('#search');
    //Event Listener
    searching.keypress(function() {
      $('#editing-table').empty();
      // if (searching.val()) {
      var value = searching.val();
      value = value.replace(/\b\w/g, l => l.toUpperCase());
      var matched = searchByName(value);
      for (var i in matched) {
        tableAContactEdits(matched[i]);
      };
      // }
      if ($('#search').val() === "") {
        $('#editing-table').empty();
        for (var i in contacts) {
          tableAContactEdits(contacts[i]);
        };
      }
    });
    //Eliminates issue with input value lag by loading
    //the keypress function a 2nd time for every key-stroke
    searching.keyup(function() {
      searching.keypress();
    });

  }//only on edit page




  // *********************************************************************************************
  // DELETE PAGE DELETE PAGE
  // *********************************************************************************************
  if ($('#delete-page')) {
    delPage();
  }//delet page if
  function delPage() {
      // Initialize the contacts objects
      if (localStorage.getItem('myContacts')) {
        contacts = JSON.parse(localStorage.getItem('myContacts'));
        for (var i in contacts) {
          tableAContactDeletes(contacts[i]);
        }
      } else {
        contacts = [];
      }
      //facilitation of search form
      var searching = $('#search');
      //Event Listener
      searching.keypress(function() {
        $('#deleting-table').empty();
        // if (searching.val()) {
        var value = searching.val();
        value = value.replace(/\b\w/g, l => l.toUpperCase());
        var matched = searchByName(value);
        for (var i in matched) {
          tableAContactDeletes(matched[i]);
        }
        // }
      });
        if ($('#search').val() === "") {
          $('#deleting-table').empty();
          for (var i in contacts) {
            tableAContactDeletes(contacts[i]);
          }
        }
        //Eliminates issue with input value lag by loading
        //the keypress function a 2nd time for every key-stroke
        searching.keyup(function() {
          searching.keypress();
        });
        // //tableAContact
        function tableAContactDeletes(contact) {
          var table = $('#deleting-table');
          //create a row
          var row = $(document.createElement('tr'));
          row.appendTo(table);
          //create picture cell as link
          var picLink = $(document.createElement('a'));
          var portrait = $(document.createElement('td'));
          picLink.html('<img class="img-thumbnail" src="' + contact.portrait + '">');
          picLink.appendTo(portrait);
          portrait.appendTo(row);
          //create name cell as link
          var name = $(document.createElement('td'));
          var nameLink = $(document.createElement('a'));
          nameLink.html(contact.firstName + " " + contact.lastName);
          nameLink.appendTo(name);
          name.appendTo(row);
          //create number cell
          var number = $(document.createElement('td'));
          var numLink = $(document.createElement('a'));
          numLink.html(contact.number);
          numLink.appendTo(number);
          number.appendTo(row);
          //create Delete button
          var delCol = $(document.createElement('td'));
          var del = $(document.createElement('button'));
          var joinedName = (contact.firstName + contact.lastName).replace(/\b\s/g, "");
          del.attr('id', joinedName);
          del.attr('class', 'btn btn-danger');
          del.attr('data-toggle', 'modal');
          del.attr('data-target', '#delete-modal');
          del.html('Delete');
          del.appendTo(delCol);
          delCol.appendTo(row);
          // I want icons that lead to https://globfone.com/
        }
        $('modal').focusout(function() {
          $('deleting-table').empty();
          for (var i in contacts) {
            tableAContactDeletes(contacts[i]);
          }
        })
        $('#deleting-table .btn').click(function (e) {
          id = $(e.target).attr('id');
          console.log('id changed');
          var x = 0;
          var foundIt = false;
          while (x < contacts.length && foundIt === false) {
            name = contacts[x].firstName + contacts[x].lastName;
            name = name.replace(/\b\s/g, "");
            // console.log(id);
            // console.log(name);
            if (id == name) {
              foundIt = true;
              x--;
            }
            x++;
            // console.log(x);
          }//while
          $('#name-slot').html(contacts[x].firstName + " " + contacts[x].lastName);
        });
        $('#deleteContact').click(function() {
          var x = 0;
          var foundIt = false;
          while (x < contacts.length && foundIt === false) {
            name = contacts[x].firstName + contacts[x].lastName;
            name = name.replace(/\b\s/g, "");
            console.log(id);
            console.log(name);
            if (id == name) {
              foundIt = true;
              x--;
            }
            x++;
            console.log(x);
          }//while
          //remove from contacts array
          contacts.splice(x, 1);
          //save to saveToStorage
          saveToStorage();
          //clear and repop table
          delPage();
        });
    }//delete page function

}); //document.ready
