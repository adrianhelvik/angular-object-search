( function () {

    angular.module( 'objectSearch' )
        .filter( 'objectSearch', rosProvider );

    function rosProvider( Query, QueryCollection ) {

        /**
         * Recursive object search.
         *
         * Will recursively search for a query in any
         * string within any object supplied.
         *
         * @param args.haystack object to search within
         * @param args.query string containing search queries. 
         */
        function ros( queries, haystack ) {

            var queryCollection = new QueryCollection( queries );

            var matches = queryCollection.matches( haystack );

            return matches;
        }

        return ros;
    }
} )();
