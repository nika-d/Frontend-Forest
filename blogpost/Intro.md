

## Intro

In Germany we say: "Wir sehen den Wald vor lauter Bäumen nicht." - "We dont see the forest because of all the trees."

In Frontend, its the other way around, we stray through the forest of frameworks and dont see the big mother mamuth tree - the DOM.

This article is about the DOM, which may guide us on the right path towards a frontend architecture independent of the framework.

On the example of a form with input fields, we will compare a very common pattern of logic abstraction with a tree based approach. 
Next we will write tests for both. There will be proof of concept code, and also one real world example. 
Later comes some discussion about other architecture styles, and a glimpse on other use cases, for which the tree based 
approach is not verified yet. 

Disclaimer: You wont see any new ideas in this article. Programming is old enough to have solved every possible problem, 
and also old enough for having forgotten these solutions. So we just write a reminder. 😉

## Example form

We have a form with two input fields I1 and I2, both of them are select fields. There are constraints: 
- I1 can only have values following the rules of C1. 
- I2 can only have values following the rules of C2.
- The form is valid if both fields are valid and the combination of both fields is valid, that is described by C12.

@todo concrete funny example.... two pets? clothes? two dishes for dinner?    

## The common way: Logic abstraction

We put the html for the form and the two inputs into one file, have bindings for the input fields, 
and we have another file with the logic. The logic file has functions that are called on every change of the input fields.

Lets see how both of them work together:

![logicAbstraction.png](..%2Fnotes%2FlogicAbstraction.png)

## The natural way: Tree based

We have three components, one for the form, one for I1 and one for I2. Each of them cares about everything 
in their scope. compI1 encapsulates I1 and C1, compI2 encapsulates I2 and C2, and compForm encapsulates compI1 and compI2 and C12.

Sounds complicated? Well, thats what frontend frameworks are for. They give us the possibility to put html, js and css 
together in one file, and to have senseful bindings between components, not only between a single DOM element and js.  

Here is their talk:

![treeBased.png](..%2Fnotes%2FtreeBased.png)


## @todos .... 

Why should I care? 

Different architekture patterns applied to frontend. 

Testing with nullables

DOM

dont split view and logic

never stateless

component based arch

- forms
- filters
- copy&paste -> decorators

debugging with dev tools leads directly to right component

bei zentraler logik passt weger model noch prop (https://git.bihealth.org/llp/llp/-/merge_requests/674#note_285461)

different types of nodes
layout, inner node, root, leaf

Skaliert automatisch