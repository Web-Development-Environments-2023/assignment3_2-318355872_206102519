import requests

user_paramas = [('john_doe', 'John', 'Doe', 'United States', 'password1', 'john.doe@example.com', 'profile_picture1.jpg'),
                    ('jane_smith', 'Jane', 'Smith', 'United Kingdom', 'password2', 'jane.smith@example.com', 'profile_picture2.jpg'),
                    ('sam_jones', 'Sam', 'Jones', 'Canada', 'password3', 'sam.jones@example.com', 'profile_picture3.jpg'),
                    ('emma_wilson', 'Emma', 'Wilson', 'Australia', 'password4', 'emma.wilson@example.com', 'profile_picture4.jpg'),
                    ('david_smith', 'David', 'Smith', 'United States', 'password5', 'david.smith@example.com', 'profile_picture5.jpg'),
                    ('olivia_brown', 'Olivia', 'Brown', 'United States', 'password6', 'olivia.brown@example.com', 'profile_picture6.jpg'),
                    ('jacob_wilson', 'Jacob', 'Wilson', 'United States', 'password7', 'jacob.wilson@example.com', 'profile_picture7.jpg'),
                    ('emily_johnson', 'Emily', 'Johnson', 'United Kingdom', 'password8', 'emily.johnson@example.com', 'profile_picture8.jpg'),
                    ('michael_thompson', 'Michael', 'Thompson', 'Australia', 'password9', 'michael.thompson@example.com', 'profile_picture9.jpg'),
                    ('sophia_rodriguez', 'Sophia', 'Rodriguez', 'United States', 'password10', 'sophia.rodriguez@example.com', 'profile_picture10.jpg'),
                    ('alexander_garcia', 'Alexander', 'Garcia', 'United States', 'password11', 'alexander.garcia@example.com', 'profile_picture11.jpg'),
                    ('isabella_martinez', 'Isabella', 'Martinez', 'United States', 'password12', 'isabella.martinez@example.com', 'profile_picture12.jpg'),
                    ('daniel_rodriguez', 'Daniel', 'Rodriguez', 'United States', 'password13', 'daniel.rodriguez@example.com', 'profile_picture13.jpg'),
                    ('sophie_miller', 'Sophie', 'Miller', 'United Kingdom', 'password14', 'sophie.miller@example.com', 'profile_picture14.jpg'),
                    ('william_wilson', 'William', 'Wilson', 'United States', 'password15', 'william.wilson@example.com', 'profile_picture15.jpg'),
                    ('mia_gonzalez', 'Mia', 'Gonzalez', 'United States', 'password16', 'mia.gonzalez@example.com', 'profile_picture16.jpg'),
                    ('oliver_martin', 'Oliver', 'Martin', 'United Kingdom', 'password17', 'oliver.martin@example.com', 'profile_picture17.jpg'),
                    ('lily_roberts', 'Lily', 'Roberts', 'United States', 'password18', 'lily.roberts@example.com', 'profile_picture18.jpg'),
                    ('ethan_thomas', 'Ethan', 'Thomas', 'United States', 'password19', 'ethan.thomas@example.com', 'profile_picture19.jpg'),
                    ('harper_anderson', 'Harper', 'Anderson', 'United States', 'password20', 'harper.anderson@example.com', 'profile_picture20.jpg')]


for user in user_paramas:
    url = "http://127.0.0.1:3000/register"
    headers = {
        "Content-Type": "application/json"  # Assuming you're sending JSON data
    }
    data = {
             "username": user[0],
             "firstname": user[1],
             "lastname": user[2],
             "country": user[3],
             "password": user[4],
             "email": user[5],
             "profilePic": user[6]
           }
    response = requests.post(url, headers=headers, json=data)
    if response.status_code == 201:
        print("User created : " + user[0])
    else:
        print(f"Error creating user: {response.text}")