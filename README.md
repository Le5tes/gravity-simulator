#Gravity Simulator
Perform n-body gravity simulations in 2D!

WIP - this package is still in development and may be unstable.

## Installation
npm install @gravity-simulator/gravity-simulator

## Usage
Bodies should provide the following properties:
  - mass: number
  - positionX: number
  - positionY: number
  - velocityX: number
  - velocityY: number 

The gravity simulator is created asyncronously

### Example usage
```
const GravitySimulator = require('@gravity-simulator/gravity-simulator').GravitySimulator;

GravitySimulator.create().then((simulator) => {
    const bodies = [{mass: 100, positionX: 40, positionY: 120, velocityX: 0, velocityY: 0},
                    {mass: 200, positionX: 80, positionY: 120, velocityX: 0, velocityY: 0},
                    {mass: 50, positionX: 160, positionY: 40, velocityX: 0, velocityY: 0},
                    {mass: 100, positionX: 160, positionY: 160, velocityX: 0, velocityY: 0}];

    simulator.calculateNewPositions(bodies);

    console.log(bodies) 
});

==> [
        {
            mass: 100,
            positionX: 40.132930755615234,
            positionY: 120.00064086914062,
            velocityX: 0.13292938470840454,
            velocityY: 0.00064300955273211
        },
        {
            mass: 200,
            positionX: 79.9514389038086,
            positionY: 120.0028305053711,
            velocityX: -0.048557523638010025,
            velocityY: 0.0028280343394726515
        },
        {
            mass: 50,
            positionX: 159.98495483398438,
            positionY: 40.020660400390625,
            velocityX: -0.015048785135149956,
            velocityY: 0.02065981552004814
        },
        {
            mass: 100,
            positionX: 159.97171020507812,
            positionY: 159.98336791992188,
            velocityX: -0.028289951384067535,
            velocityY: -0.016628986224532127
        }
    ]
```
## What it does
This package offers a simple interface for performing n-body calculations. It uses the barnes hut algorithm, which allows for significant performance gains for large numbers of bodies. This is implemented in two stages:
 - Quadtree built using webassembly (to improve performance over plain js implementation)
 - Tree resolved parallelly on the gpu 


## Configuration
The create function accepts an options parameter to pass in configurations.

#### Gravity constant
Pass in a gravity constant with { gravityConstant: number } (default 1)

#### Resolver
By default the simulator uses the barnes hut algorithm. To perform the calculations by direct sum, pass the option { resolver: "direct-sum" }. This will be more accurate but suffers from greater time complexity - O(n2) vs O(nlog(n)). 

#### Example Usage
```
const options = {
    gravityConstant: 0.0000000667, // 6.67 x 10^-8 m3t-1s-2
    resolver: "direct-sum"
};

GravitySimulator.create(options).then((simulator) => {
    simulator.calculateNewPositions(bodies);
});
```

## Optional arguments
In the default configuration the calculateNewPositions method accepts 3 optional parameters in addition to the array of bodies. These parameters define the area containing bodies (assumed to be a square). Any bodies falling outside this area will not be added to the quadtree and will not be included in calculations.
 - size: number - width of the area (and height - the area is assumed to be square)
 - cornerX: number - lower bound for X
 - cornerY: number - lower bound for Y

The parameters will default to the smallest square area containing all the bodies. Generally these parameters should be left blank, but if the bounds of the system are known beforehand it may give a slight performance boost to provide these. 

If configured in direct-sum mode these parameters are ignored.

#### Example Usage
```
const width = 1000;
const lowerBoundX = -500;
const lowerBoundY = -500;

GravitySimulator.create().then((simulator) => {
    simulator.calculateNewPositions(bodies, width, lowerBoundX, lowerBoundY);
});
```

## Planned updates
- Build demonstrator page and performance metrics
- add in n-body calculations in 3D

## Other notes
- This package is provides a simpler interface for using the packages @Gravity-simulator/gravity-resolver and @Gravity-simulator/barnes-hut-tree-builder. 
- For direct-sum (brute force) calculations it is possible to use @Gravity-simulator/gravity-resolver, allowing for completely synchronous implementation. For more information see the gravity-resolver documentation.