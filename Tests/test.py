import requests

# Define the base URL for the GraphQL API
queryUrl = "http://localhost:3000/graphql"
commandUrl = "http://localhost:8080/graphql"

# Define a function to make GraphQL requests
def graphql_request(query, url, variables={}):
    payload = {
        "query": query,
        "variables": variables
    }
    print(payload)
    try:
        response = requests.post(url, json=payload)
        response_json = response.json()
        if "errors" in response_json:
            raise Exception(response_json["errors"])
        return response_json["data"]
    except ConnectionError:
        print("Error while connecting to the Server")



# Test the createUser resolver
query = """
    mutation CreateUser($input: UserInput!) {
        createUser(input: $input)
    }
"""
variables = {
    "input": {
        "name": "Barbs",
        "email": "Barbs@example.com"
    }
}
result = graphql_request(query, commandUrl, variables)
print("createUser result:", result)

sampleID = result["createUser"]

#Test the getUsers resolver
query = '''
        query {
            users {
                _id
                name
                email
            }
        }
    '''
result = graphql_request(query, queryUrl)
print("Users result: ", result)

# Test the getUser resolver
query = """
    query GetUser($_id: String!) {
        getUser(id: $_id) {
            _id
            name
            email
        }
    }
"""
variables = {
    "_id": sampleID
}
result = graphql_request(query, queryUrl, variables)
print("getUser result:", result)

# Test the updateUser resolver
query = """
    mutation UpdateUser($_id: String!, $input: UserInput!) {
        updateUser(id: $_id, input: $input) 
    }
"""
variables = {
    "_id": sampleID,
    "input": {
        "name": "Jane",
        "email": "jane@example.com"
    }
}
result = graphql_request(query, commandUrl, variables)
print("updateUser result:", result)


# Test the deleteUser resolver
query = """
    mutation DeleteUser($id: String!) {
        deleteUser(id: $id)
    }
"""
variables = {
    "id": sampleID
}
result = graphql_request(query, commandUrl, variables)
print("deleteUser result:", result)

