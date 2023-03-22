import requests

# Set the API endpoint URL
url = 'http://localhost:8080/graphql'

# Define the GraphQL query to fetch all books
query = '''
query {
  shoppingList(id: "6417856c79178c177f528273") {
    id
    name
    description
    value
  }
}
'''

mutation = """
mutation {
  createShoppingList(id: "6417856c79178c177f528273", name: "Groceries", description: "Weekly grocery shopping list", value: 100.0) {
    id
    name
    description
    value
  }
}
"""
response = requests.post(url, json={'query': mutation})

# Check if the response was successful
if response.status_code == 200:
    # Print the response data
    data = response.json()['data']
    print("R1: ", data)
else:
    # Print the error message if the response was not successful
    error = response.json()['errors'][0]['message']
    print(f'Error: {error}')

# Send the GraphQL query to the API endpoint
response = requests.post(url, json={'query': query})


# Check if the response was successful
if response.status_code == 200:
    # Print the response data
    data = response.json()['data']
    print("R2: ", data)
else:
    # Print the error message if the response was not successful
    error = response.json()['errors'][0]['message']
    print(f'Error: {error}')