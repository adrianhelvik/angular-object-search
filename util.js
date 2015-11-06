( function () {

    angular.module( 'objectSearch' )
        .factory( 'util', util );

    function util() {
        
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
    }

} )();
