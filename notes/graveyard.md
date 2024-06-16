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


## Example form

We have a form with two input fields I1 and I2, both of them are select fields. There are constraints:
- I1 can only have values following the rules of C1.
- I2 can only have values following the rules of C2.
- The form is valid if both fields are valid and the combination of both fields is valid, that is described by C12.

@todo concrete funny example.... two pets? clothes? two dishes for dinner?
- To illlustrate the actual form example, it would help to present it as an actual example rather than I1, C1, etc.
- If it's "If the user selects cat, we want to know what kind of cat it is", or something, because that's going to be easier
- for the reader to grasp than a diagrammed flow chart.