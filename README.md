### Pre-requisites

1. Docker
2. Semi-colon seperated CSV File
3. MySQL WorkBench to accesss the Database
4. Postman to send requests and test the API

### Running

1. Clone the project - `git@github.com:iamyxsh/csv-reader.git`
2. Navigate to the project dir - `cd csv-reader`
3. Run docker compose up (if on an M1 device, first do `docker pull --platform linux/x86_64 mysql`)

The project is now running on your localhost at port 3000.

### Interaction with the API

1. Load the following code in your postman

```
   curl -X POST \
    http://localhost:3000/csv \
    -H 'cache-control: no-cache' \
    -H 'content-type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' \
    -H 'postman-token: 17aa5432-6e71-a2ea-c0e4-a85f9ac244e6' \
    -F csv-file=@code_challenge.csv
```

```
  Basically a post request to localhost:3000/csv with body as form-data.
```

2. Add the csv file (seperated with semi-colon) in form-data body with the key "csv-file".
3. Hopefully the response will be OK ;).
4. Open MySQL Workbench with following options:

```
  (i). User - root
  (ii). Password - password
  (iii). Port - 3306
  (iv). Host: 127.0.0.1
```

5. Navigate to the revenue db and check the table starting with CSV*data*.

### What I could have dne better with more time

1. I could have written some unit tests with jest.
2. I could have implemented some "Get" routes to fetch the data.
3. I could have made it more dynamic by taking inputs from the user such as csv file seperator (semi-colon or a comma), name of the table you want to save the data in, etc.
4. I could have written some of the SQL queries on my own rather that taking the help of a library.
