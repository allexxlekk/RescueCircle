CREATE TABLE location
(
    id               INT AUTO_INCREMENT PRIMARY KEY,
    latitude         DOUBLE,
    longitude        DOUBLE,
    distance_to_base DOUBLE
);

CREATE TABLE user
(
    id          INT AUTO_INCREMENT PRIMARY KEY,
    username    VARCHAR(255)                         NOT NULL,
    password    VARCHAR(255)                         NOT NULL,
    role        ENUM ('ADMIN', 'RESCUER', 'CITIZEN') NOT NULL,
    full_name   VARCHAR(255),
    email       VARCHAR(255)                         NOT NULL,
    phone       VARCHAR(20)                          NOT NULL,
    location_id INT,
    FOREIGN KEY (location_id) REFERENCES location (id)
);

CREATE TABLE item_category
(
    id   INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE item
(
    id             INT AUTO_INCREMENT PRIMARY KEY,
    name           VARCHAR(255) NOT NULL,
    description    TEXT,
    quantity       INT          NOT NULL DEFAULT 0,
    offer_quantity INT          NOT NULL DEFAULT 2,
    category_id    INT          NOT NULL,
    FOREIGN KEY (category_id) REFERENCES item_category (id)
);

CREATE TABLE item_details
(
    id      INT AUTO_INCREMENT PRIMARY KEY,
    name    VARCHAR(255) NOT NULL,
    value   VARCHAR(255) NOT NULL,
    item_id INT,
    FOREIGN KEY (item_id) REFERENCES item (id)
);

CREATE TABLE request
(
    id               INT AUTO_INCREMENT PRIMARY KEY,
    citizen_id       INT,
    rescuer_id       INT,
    item_id          INT,
    number_of_people INT NOT NULL,
    quantity         INT, -- TRIGGER: BEFORE INSERT quantity = number_of_people * item.offer_quantity
    status           ENUM ('PENDING','ASSUMED', 'COMPLETED') DEFAULT 'PENDING',
    created_at       DATETIME                      DEFAULT CURRENT_TIMESTAMP,
    assumed_at       DATETIME,
    completed_at     DATETIME,
    FOREIGN KEY (citizen_id) REFERENCES user (id),
    FOREIGN KEY (item_id) REFERENCES item (id),
    FOREIGN KEY (rescuer_id) REFERENCES user (id)
);


CREATE TABLE announcement
(
    id                INT AUTO_INCREMENT PRIMARY KEY,
    name              VARCHAR(255) NOT NULL,
    description       TEXT,
    announcement_date DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE announcements_needs
(
    id              INT AUTO_INCREMENT PRIMARY KEY,
    announcement_id INT NOT NULL,
    item_id         INT NOT NULL,
    FOREIGN KEY (announcement_id) REFERENCES announcement (id),
    FOREIGN KEY (item_id) REFERENCES item (id)
);

CREATE TABLE offer
(
    id              INT AUTO_INCREMENT PRIMARY KEY,
    citizen_id       INT,
    rescuer_id       INT,
    item_id         INT,
    announcement_id INT,
    quantity        INT,
    status          ENUM ('PENDING','ASSUMED', 'COMPLETED') DEFAULT 'PENDING',
    created_at      DATETIME                      DEFAULT CURRENT_TIMESTAMP,
    assumed_at      DATETIME,
    completed_at    DATETIME,
    FOREIGN KEY (citizen_id) REFERENCES user (id),
    FOREIGN KEY (item_id) REFERENCES item (id),
    FOREIGN KEY (rescuer_id) REFERENCES user (id),
    FOREIGN KEY (announcement_id) REFERENCES announcement (id)
);


CREATE TABLE rescue_vehicle
(
    id         INT AUTO_INCREMENT PRIMARY KEY,
    type       ENUM('PERSONAL USE','VAN','PICKUP TRUCK') NOT NULL,
    status     ENUM ('WAITING', 'ACTIVE' ,'UNAVAILABLE') DEFAULT 'WAITING',
    active_tasks INT DEFAULT 0,
    rescuer_id INT,
    FOREIGN KEY (rescuer_id) REFERENCES user (id)
);

CREATE TABLE rescuer_inventory
(
    id              INT AUTO_INCREMENT PRIMARY KEY,
    rescuer_id      INT NOT NULL,
    item_id         INT NOT NULL,
    amount          INT DEFAULT 0,
    UNIQUE INDEX idx_rescuer_item (rescuer_id, item_id), -- Add composite unique index
    FOREIGN KEY (rescuer_id) REFERENCES user (id),
    FOREIGN KEY (item_id) REFERENCES item (id)
);


CREATE TRIGGER before_insert_item
    BEFORE INSERT ON item
    FOR EACH ROW
BEGIN
    IF NEW.quantity IS NULL THEN
        SET NEW.quantity = 0;
    END IF;
    IF NEW.offer_quantity IS NULL THEN
        SET NEW.offer_quantity = 2;
    END IF;
END;