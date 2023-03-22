import requests

# Define the base URL for the GraphQL API
url = "http://localhost:8080/graphql"

# Define a function to make GraphQL requests
def graphql_request(query, variables={}):
    payload = {
        "query": query,
        "variables": variables
    }
    response = requests.post(url, json=payload)
    response_json = response.json()
    if "errors" in response_json:
        raise Exception(response_json["errors"])
    return response_json["data"]



# Test the createUser resolver
query = """
    mutation CreateUser($input: UserInput!) {
        createUser(input: $input) {
            _id
            name
            email
        }
    }
"""
variables = {
    "input": {
        "name": "John",
        "email": "john@example.com"
    }
}
result = graphql_request(query, variables)
print("createUser result:", result)

createdId = result['createUser']['_id']

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
    "_id": createdId
}
result = graphql_request(query, variables)
print("getUser result:", result)

# Test the updateUser resolver
query = """
    mutation UpdateUser($_id: String!, $input: UserInput!) {
        updateUser(id: $_id, input: $input) {
            _id
            name
            email
        }
    }
"""
variables = {
    "_id": createdId,
    "input": {
        "name": "Jane",
        "email": "jane@example.com"
    }
}
result = graphql_request(query, variables)
print("updateUser result:", result)


# Test the deleteUser resolver
query = """
    mutation DeleteUser($id: String!) {
        deleteUser(id: $id)
    }
"""
variables = {
    "id": createdId
}
result = graphql_request(query, variables)
print("deleteUser result:", result)

