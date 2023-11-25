CREATE TABLE location (
    id INT AUTO_INCREMENT PRIMARY KEY,
    latitude DOUBLE,
    longitude DOUBLE,
    distance_to_base DOUBLE
);

CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'RESCUER', 'CITIZEN') NOT NULL,
    full_name VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    location_id INT,
    FOREIGN KEY (location_id) REFERENCES location(id)
);

CREATE TABLE item (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    quantity INT, 
    offer_quantity INT NOT NULL DEFAULT 2,
    category_id INT NOT NULL,
    FOREIGN KEY (category_id) REFERENCES item_category(id)
);

CREATE TABLE item_category (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE item_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    value VARCHAR(255) NOT NULL,
    item_id INT,
    FOREIGN KEY (item_id) REFERENCES item(id)
);

CREATE TABLE request (
    id INT AUTO_INCREMENT PRIMARY KEY,
    citizen_id INT,
    rescuer_id INT,
    item_id INT,
    number_of_people INT NOT NULL,
    quantity INT, -- TRIGGER: BEFORE INSERT quantity = number_of_people * item.offer_quantity
    status ENUM('PENDING', 'COMPLETED') DEFAULT 'PENDING',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    assumed_at DATETIME,
    completed_at DATETIME,
    FOREIGN KEY (citizen_id) REFERENCES user(id),
    FOREIGN KEY (item_id) REFERENCES item(id),
    FOREIGN KEY (rescuer_id) REFERENCES user(id)
);

CREATE TABLE offer (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    item_id INT,
    announcement_id INT,
    quantity INT,
    status ENUM('PENDING', 'COMPLETED') DEFAULT 'PENDING',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    assumed_at DATETIME,
    completed_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (item_id) REFERENCES item(id),
    FOREIGN KEY (announcement_id) REFERENCES announcement(id)
);


CREATE TABLE rescue_vehicle (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(255) NOT NULL,
    capacity INT,
    status ENUM('AVAILABLE', 'UNAVAILABLE') DEFAULT 'AVAILABLE',
    rescuer_id INT,
    FOREIGN KEY (rescuer_id) REFERENCES user(id)
);

CREATE TABLE announcement (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    announcement_date DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE announcements_needs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    annoucment_id INT NOT NULL,
    item_id INT NOT NULL,
    FOREIGN KEY (annoucment_id) REFERENCES announcement(id),
    FOREIGN KEY (item_id) REFERENCES item(id)
);