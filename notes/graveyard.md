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