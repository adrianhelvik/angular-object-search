( function () {
    
    angular.module( 'objectSearch' )
        .factory( 'Query', QueryFactory );

    function QueryFactory( util ) {

        function Query( original ) {

            var self = this;

            // if string is surrounded by quotes, remove them
            self.query = util.unquote( original ).trim();

            self.matches = function ( other ) {
                
                if ( angular.isNumber( other ) || angular.isString( other ) ) {

                    // magic number rule

                    /* eslint-disable */
                    var result = ( other + '' ).toLowerCase().indexOf( self.query.toLowerCase() ) !== -1;
                    /* eslint-enable */

                    return result;
                }

                if ( !other ) {
                    return false;
                } else if ( other.constructor === Array ) {
                    for ( var i = 0; i < other.length; i++ ) {
                        if ( self.matches( other[ i ] ) ) {
                            return true;
                        }
                    }
                } else {
                    for ( var prop in other ) {
                        if ( other.hasOwnProperty( prop ) ) {
                            if ( self.matches( other[ prop ] ) ) {
                                return true;
                            }
                        }
                    }

                }

                return false;
            };
        }

        return Query;
    }
} )();
