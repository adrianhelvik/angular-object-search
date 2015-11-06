( function () {

    angular.module( 'objectSearch' )
        .factory( 'QueryCollection', QueryCollectionFactory );

    function QueryCollectionFactory( Query ) {

        function QueryCollection( queries ) {

            var self = this;

            if ( queries instanceof Array ) {
                self.queries = queries;
            } else if ( angular.isString( queries ) ) {
                self.queries = createQueries( queries );
            } else {
                throw new Error( 'Not a valid argument for constructor' );
            }

            self.matches = function ( haystack ) {

                var matches = [];
                var i;

                for ( i = 0; i < self.queries.length; i++ ) {
                    var query = self.queries[ i ];
                    matches[ i ] = false;

                    if ( query.matches( haystack ) ) {
                        matches[ i ] = true;
                    }
                }

                for ( i = 0; i < matches.length; i++ ) {

                    if ( !matches[ i ] ) {
                        return false;
                    }
                }

                return true;
            };

            function createQueries( str ) {

                var quotedAndPossiblyNegated = /(-?'[^']+')|(-?"[^"]+")/g;

                var quoted = str.match( quotedAndPossiblyNegated ) || [];

                // remove quoted substrings from original
                var storedRemoved = str.replace( quotedAndPossiblyNegated, '' );

                var unQuoted = storedRemoved.match( /[^\s]+/g ) || [];

                return quoted.concat( unQuoted ).map( function ( queryStr ) {
                    return new Query( queryStr );
                } );
            }
        }

        return QueryCollection;
    }
} )();
