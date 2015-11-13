( function () {
    
    angular.module( 'objectSearch', [] );

    angular.module( 'objectSearch' )
        .filter( 'objectSearch', searchProvider );

    var util = (function () {
        
        return {
            isQuoted: isQuoted,
            unquote: unquote,
            isStringOrNumber: isStringOrNumber
        };

        function isQuoted( str ) {
            if ( str.length === 0 ) {
                return false;
            }

            var first = str.charAt( 0 );
            var last = str.charAt( str.length - 1 );

            return first === last && ( first === '"' || first === '\'' );
        }

        function unquote( str ) {

            if ( str.length === 1 ) {
                return str;
            }

            if ( isQuoted( str ) ) {
                return str.substr( 1, str.length - 2 );
            }

            return str;
        }

        function isStringOrNumber( something ) {
            return angular.isString( something ) || angular.isNumber( something );
        }
    })();

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
    
    function QueryCollection( queries ) {

        var self = this;

        if ( queries instanceof Array ) {
            self.queries = queries;
        } else if ( angular.isString( queries ) ) {
            self.queries = createQueries( queries );
        } else if ( angular.isUndefined( queries ) ) {
            console.log( 'Warning: queries in objectSearch was undefined' );
            self.queries = [];
        } else {
            throw new Error( queries + ' is not a valid argument for constructor' );
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
    
    function searchProvider( ) {

        /**
         * Recursive object search.
         *
         * Will recursively search for a query in any
         * string within any object supplied.
         *
         * @param args.haystack object to search within
         * @param args.query string containing search queries. 
         */
        function search( haystack, needle ) {

            if ( ! needle ) {
                return haystack;
            }

            var queryCollection = new QueryCollection( needle );

            var matches = [];
            
            for (var i = 0; i < haystack.length; i++) {
                if ( queryCollection.matches( haystack[ i ] ) ) {
                    matches.push( haystack[ i ] );
                }
            }

            return matches;
        }

        return search;
    }

} )();
