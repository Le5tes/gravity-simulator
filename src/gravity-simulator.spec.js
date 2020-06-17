const Simulator = require('./gravity-simulator').GravitySimulator;
const getStub = require('../test-utils/test-utils').getStub;


describe('Gravity Simulator', () => {
    it('should exist', () => {
        expect(new Simulator()).toBeTruthy();
    });

    describe('by default', () => {
        let stubTreeBuilderClass;
        let stubTreeBuilder;
        let stubCalculateNewPositions;

        beforeEach(async () => {
            stubTreeBuilder = { buildToArray: getStub() }
            stubTreeBuilderClass = { create: getStub() }
            stubTreeBuilderClass.create.returnVal = new Promise(res => res(stubTreeBuilder));

            const stubInternalResolverClass = function () { }
            stubCalculateNewPositions = getStub()
            stubInternalResolverClass.prototype.resolveNewPositions = stubCalculateNewPositions;

            simulator = await Simulator.create({
                internalTreebuilder: stubTreeBuilderClass,
                internalResolver: stubInternalResolverClass
            });
        });

        it('should create a new treebuilder', () => {
            expect(stubTreeBuilderClass.create.callCount).toEqual(1);
        })

        describe('#calculateNewPositions', () => {
            it('should exist', () => {
                expect(simulator.calculateNewPositions).toBeTruthy();
            });

            it('should call the barnes hut tree builder', () => {
                const bodies = [{ mass: 10, positionX: 10, positionY: 10 }]

                simulator.calculateNewPositions(bodies);

                expect(stubTreeBuilder.buildToArray.callCount).toEqual(1);
                expect(stubTreeBuilder.buildToArray.lastCallArgs[0]).toEqual(bodies);
            });

            it('should call barnes hut resolver with the value returned from the treebuilder and return the result', () => {
                const bodies = [{ mass: 10, positionX: 10, positionY: 10 }]
                const bodiesResult = [{ mass: 10, positionX: 11, positionY: 11 }]
                const bodyTree = [{ mass: 10, positionX: 10, positionY: 10, moreProperties: 123 }]
                stubTreeBuilder.buildToArray.returnVal = bodyTree;
                stubCalculateNewPositions.returnVal = bodiesResult;

                const result = simulator.calculateNewPositions(bodies);

                expect(stubCalculateNewPositions.callCount).toEqual(1);
                expect(stubCalculateNewPositions.lastCallArgs[0]).toEqual(bodies);
                expect(stubCalculateNewPositions.lastCallArgs[1]).toEqual(bodyTree);
                expect(result).toEqual(bodiesResult);
            });

            describe('when passing in arguments for width and corner', () => {
                it('should pass those arguments to the treebuilder', () => {
                    const bodies = [{ mass: 10, positionX: 10, positionY: 10 }]

                    simulator.calculateNewPositions(bodies, 100, -50, -50);

                    expect(stubTreeBuilder.buildToArray.callCount).toEqual(1);
                    expect(stubTreeBuilder.buildToArray.lastCallArgs[0]).toEqual(bodies);
                    expect(stubTreeBuilder.buildToArray.lastCallArgs[1]).toEqual(100);
                    expect(stubTreeBuilder.buildToArray.lastCallArgs[2]).toEqual(-50);
                    expect(stubTreeBuilder.buildToArray.lastCallArgs[3]).toEqual(-50);
                });
            });

            describe('when not passing in arguments for width and corner', () => {
                it('should build those arguments using the bodies', () => {
                    const bodies = [
                        { mass: 10, positionX: 10, positionY: 10 },
                        { mass: 10, positionX: 60, positionY: 10 },
                        { mass: 10, positionX: 10, positionY: 60 },
                        { mass: 10, positionX: 30, positionY: 30 }
                    ]

                    simulator.calculateNewPositions(bodies);

                    expect(stubTreeBuilder.buildToArray.callCount).toEqual(1);
                    expect(stubTreeBuilder.buildToArray.lastCallArgs[0]).toEqual(bodies);
                    expect(stubTreeBuilder.buildToArray.lastCallArgs[1]).toEqual(50);
                    expect(stubTreeBuilder.buildToArray.lastCallArgs[2]).toEqual(10);
                    expect(stubTreeBuilder.buildToArray.lastCallArgs[3]).toEqual(10);
                });
            });
        });
    });

    describe('when used with resolver="direct-sum"', () => {
        let stubTreeBuilderClass;
        let stubCalculateNewPositions;

        beforeEach(async () => {
            stubTreeBuilderClass = { create: getStub() }

            const stubInternalResolverClass = function () { }
            stubCalculateNewPositions = getStub()
            stubInternalResolverClass.prototype.resolveNewPositions = stubCalculateNewPositions;

            simulator = await Simulator.create({
                resolver: 'direct-sum',
                internalTreebuilder: stubTreeBuilderClass,
                internalResolver: stubInternalResolverClass
            });
        });

        it('should not create a new treebuilder', () => {
            expect(stubTreeBuilderClass.create.callCount).toEqual(0);
        });

        describe('#calculateNewPositions', () => {
            it('should exist', () => {
                expect(simulator.calculateNewPositions).toBeTruthy();
            });

            it('should call the resolver with the bodies and return the value', () => {
                const bodies = [{ mass: 10, positionX: 10, positionY: 10 }];
                const bodiesResult = [{ mass: 10, positionX: 11, positionY: 11 }];
                stubCalculateNewPositions.returnVal = bodiesResult;

                const result = simulator.calculateNewPositions(bodies);

                expect(stubCalculateNewPositions.callCount).toEqual(1);
                expect(stubCalculateNewPositions.lastCallArgs[0]).toEqual(bodies);
                expect(result).toEqual(bodiesResult);
            });
        });
    });

    describe('integration', () => {
        it('should resolve with barnes hut', async () => {
            bodies = [{mass: 100, positionX: 20, positionY: 30, velocityX: 0, velocityY: 0}, {mass: 100, positionX: -100, positionY: 40, velocityX: 0, velocityY: 0}]
            const simulator = await Simulator.create();

            const result = simulator.calculateNewPositions(bodies, 1000, -500, -500);

            expect(result).toBeTruthy();
        })
    });
});
