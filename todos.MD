1) Citizen Request
- Add Request
    a) Endpoint to add the request to
        JSON for endpoint request (Add Request JSON)
        {
            itemId, -->dropdown
            numberOfPeople, --> number input
            citizenId
        }
    b) What are the fields for the Frontend
        - Item Dropdown (endpoints used: /items or /items/search)
        - Category Dorpdown (endpoints used: /category /items/category)
        - Number of people (number input field)
        - Submit Request Button

- Get Request Of Citizen -- DONE
    a) Endpoint to fetch the requests
        JSON for endpoint response
    [
        {
            status,
            itemId,
            numberOfPeople,
            quantity,
            created_at,
            completed_at,
            assumed_at
        },
        .
        .
    ]
    b) Frontend List to show the requests

2) Create Rescuers
   
   {
   
    fullname,
    email,
    password,
    phone,
    role,
   }
3) Create Announcements
    POST /api/announcements
    Request Body{
        name,
        description,
        items: [itemId1, itemId2, ...]
    }