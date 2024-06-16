

## Intro

"We dont see the forest because of all the trees." (german saying, roughly translated)

In frontend, its the other way around, we stray through the forest of frameworks and dont see the big mother Redwoodtree - the DOM.

We deal with lots of data flows, from the backend to the user and back. These flows can be trivial, but most of the time, they are not, 
so they need an elaborated architecture and testing. The question is, where do we put the logic if a table in the ui shows 
joined data from several API calls? How to orchestrate a filter composition? Where to put form display logic? We will 
address these questions, and propose a solution at least for the simplest one. 

On the example of a form with input fields, we will compare a view and controller approach with a tree based approach. 
Next we will write tests for both. There will be proof of concept code, and also one real world example. 
Later comes some discussion about other architecture styles, and a glimpse on more complicated architectural questions. 

Disclaimer: You wont see any new ideas in this article. Programming is old enough to have solved every possible problem, 
and also old enough for having forgotten these solutions. So we just write a reminder. 😉

## Example form

Lets say we have a filter form for shoes, with two input fields, one for the size and one for eco label. Both of them are selects, 
we offer the sizes 2, 8 and 15 and the labels ANAB, Grassfield and Bio. The form has a submit button with the number of results in
its text. 

## View and Controller

For this article, we simplify MVC/MVVM and use instead only a view and a controller. The model we consider to be part of the controller logic.  

We have some html for the form, the two inputs and the submit button, this is our view. And we have some js gathering the users choices and
calling backend to get the number of results. Of course, there are bindings between html and js, but the concrete type of binding does not matter, 
you can imagine React/Svelte/jQuery, as you like. The controller has functions that are called on changes of the input fields, it also holds the 
lists of possible choices and provides them to the inputs.

Here is the proof of concept code: 

And here are our tests: 


## Tree based

Here we consider the data representation to be part of the logic, too, and any binding framework is also assumed.

We have three components, one for the form, one for the size input and one for the eco label input. Each of the components cares about 
everything in their scope. SizeInput component encapsulates the `<input>` and its values, same for EcoLabelInput component, and the FilterForm
arranges the input components and calls backend for results number.

Here is the proof of concept code:

And here are our tests:

Testing with nullables

## Real world example code

This code we made to compare the two approaches in an ongoing project. Users want to build a schedule for a semester at university. The dates and
rooms are already done, now teachers have to be chosen for every lesson. In our form, one input field is for a teacher, one is for the teacher´s 
institute. The institute choice is important for the accounting when semester ends. The form and inputs assists the user to make optimal choices.

The code can be found here: 

## Pros and cons

| View and Controller                                                                                             | Tree based                                                                               |
|-----------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------|
| 👍  general use, very similar to backend, full stack devs apply same way of abstraction in frontend and backend | 👍 logic structure fits DOM structure                                                     | 
|       👎 passt weder model noch prop (https://git.bihealth.org/llp/llp/-/merge_requests/674#note_285461)                                                                                                            | 👍 debugging with browser dev tools leads directly to right component                     |
|                                                                                                                 | 👍 logic scales gracefully, its clear, where to put the logic for new features            |
|                                                                                                                 | 👍 fits concepts of frontend frameworks focussing on components like React/Vue/Svelte/... |
|                                                                                                                 | 👍 fits specific frontend testing concepts like recommended by Playwright/...             |


## Misunderstood MVC and frameworks

WHERE is MVC? not globally, but locally in every component.

bei zentraler logik passt weder model noch prop (https://git.bihealth.org/llp/llp/-/merge_requests/674#note_285461)


dont split view and logic

## @todos .... 

never stateless

- forms
- filters
- copy&paste -> decorators

different types of nodes
layout, inner node, root, leaf


