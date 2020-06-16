function GravitySimulator (resolver, treeBuilder) {
    this.resolver = resolver;
    this.treeBuilder = treeBuilder
}

const chooseResolver = (option) => {
    const ResolverModule = require('@gravity-simulator/gravity-resolver')
    if (option == 'barnes-hut') {
        return ResolverModule.BarnesHutTreeResolver
    } else if (option == 'direct-sum') {
        return ResolverModule.GravityResolver
    } else {
        console.warn('Resolver option does not match any value, using default')
        return ResolverModule.BarnesHutTreeResolver
    }
}

GravitySimulator.create = function (options = {}) {
    return new Promise((res) => {
        options['gravityConstant'] = options['gravityConstant'] || 1;
        options['resolver'] = options['resolver'] || 'barnes-hut';
        options['internalTreebuilder'] = options['internalTreebuilder'] || require('@gravity-simulator/barnes-hut-tree-builder').BarnesHutTreeBuilder;
        options['internalResolver'] = options['internalResolver'] || chooseResolver(options.resolver);

        
        if (options.resolver == 'direct-sum') {
            GravitySimulator.prototype.calculateNewPositions = function(bodies) { 
                return this.resolver.resolveNewPositions(bodies)
            }
        
            res(new GravitySimulator(new options.internalResolver(options.gravityConstant)))
        } else {
            GravitySimulator.prototype.calculateNewPositions = function(bodies,  size, cornerX, cornerY) { 
                return this.resolver.resolveNewPositions(bodies, this.treeBuilder.buildToArray(bodies, size, cornerX, cornerY));
            }

            options.internalTreebuilder.create().then((treebuilder) => {
                res(new GravitySimulator(new options.internalResolver(options.gravityConstant), treebuilder));
            }); 
        }
    });
}

module.exports.GravitySimulator = GravitySimulator;