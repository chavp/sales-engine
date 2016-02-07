OK = 200; // A successful GET or PUT request
CREATED = 201; // A successful POST request
NO_CONTENT = 204; // A successful DELETE request
BAD_REQUEST = 400; // An unsuccessful GET, POST, or PUT request, due to invalid content
UNAUTHORIZED = 401; // Requesting a restricted URL with incorrect credentials
FORBIDDEN = 403; // Making a request that isn’t allowed
NOT_FOUND = 404; // Unsuccessful request due to an incorrect parameter in the URL
METHOD_NOT_ALLOWED = 405; // Request method not allowed for the given URL
CONFLICT = 409; // Unsuccessful POST request when another object already exists with the same data
INTERNAL_SERVER_ERROR = 500; // Problem with your server or the database server

NOT_IMPLEMENTS = "Not implements.";