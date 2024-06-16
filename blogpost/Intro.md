

## Intro

In Germany they say: "Wir sehen den Wald vor lauter Bäumen nicht." - "We dont see the forest because of all the trees."

In Frontend, its the other way around, we stray through the forest of frameworks and dont see the big mother Redwoodtree - the DOM.

The Problem: 
- Your intro needs to more directly link into a problem solution. You're talking about a specific problem, which is the flow state of variable form inputs on a form, so it would help by clarifying, as early as possible, the problem we're trying to solve in this particular blog post (We want to decide where to put form display logic). Let the blog post be what it's about, a specific thing, and don't force it to be about web development in general

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
- To illlustrate the actual form example, it would help to present it as an actual example rather than I1, C1, etc. If it's "If the user selects cat, we want to know what kind of cat it is", or something, because that's going to be easier for the reader to grasp than a diagrammed flow chart.

## View and Controller

## Tree based

## Pros and cons


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
