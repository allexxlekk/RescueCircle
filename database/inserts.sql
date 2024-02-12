/* Inserts for initialization of the rescue_circle database */
-- CATEGORIES

INSERT INTO item_category (name) VALUES ('Dairy');
INSERT INTO item_category (name) VALUES ('Fruits');
INSERT INTO item_category (name) VALUES ('Bakery');

-- ITEMS
-- IDs 1-10
INSERT INTO item (name, description, quantity, offer_quantity, category_id) VALUES ('Milk', 'Fresh cow milk', 100, 10, 1);
INSERT INTO item (name, description, quantity, offer_quantity, category_id) VALUES ('Cheddar Cheese', 'Aged cheddar cheese', 50, 5, 1);
INSERT INTO item (name, description, quantity, offer_quantity, category_id) VALUES ('Butter', 'Unsalted butter', 80, 8, 1);
INSERT INTO item (name, description, quantity, offer_quantity, category_id) VALUES ('Yogurt', 'Greek yogurt', 120, 12, 1);
INSERT INTO item (name, description, quantity, offer_quantity, category_id) VALUES ('Cottage Cheese', 'Low-fat cottage cheese', 60, 6, 1);
INSERT INTO item (name, description, quantity, offer_quantity, category_id) VALUES ('Sour Cream', 'Natural sour cream', 40, 4, 1);
INSERT INTO item (name, description, quantity, offer_quantity, category_id) VALUES ('Ice Cream', 'Vanilla ice cream', 70, 7, 1);
INSERT INTO item (name, description, quantity, offer_quantity, category_id) VALUES ('Whipping Cream', 'Heavy whipping cream', 30, 3, 1);
INSERT INTO item (name, description, quantity, offer_quantity, category_id) VALUES ('Parmesan', 'Grated Parmesan cheese', 55, 5, 1);
INSERT INTO item (name, description, quantity, offer_quantity, category_id) VALUES ('Gouda', 'Smoked Gouda cheese', 45, 4, 1);

-- IDs 11-20
INSERT INTO item (name, description, quantity, offer_quantity, category_id) VALUES ('Apple', 'Red delicious apples', 200, 20, 2);
INSERT INTO item (name, description, quantity, offer_quantity, category_id) VALUES ('Banana', 'Fresh ripe bananas', 150, 15, 2);
INSERT INTO item (name, description, quantity, offer_quantity, category_id) VALUES ('Orange', 'Juicy oranges', 180, 18, 2);
INSERT INTO item (name, description, quantity, offer_quantity, category_id) VALUES ('Pear', 'Green pears', 160, 16, 2);
INSERT INTO item (name, description, quantity, offer_quantity, category_id) VALUES ('Grapes', 'Seedless grapes', 140, 14, 2);
INSERT INTO item (name, description, quantity, offer_quantity, category_id) VALUES ('Blueberries', 'Fresh blueberries', 120, 12, 2);
INSERT INTO item (name, description, quantity, offer_quantity, category_id) VALUES ('Strawberries', 'Organic strawberries', 130, 13, 2);
INSERT INTO item (name, description, quantity, offer_quantity, category_id) VALUES ('Pineapple', 'Tropical pineapple', 110, 11, 2);
INSERT INTO item (name, description, quantity, offer_quantity, category_id) VALUES ('Mango', 'Ripe mangoes', 100, 10, 2);
INSERT INTO item (name, description, quantity, offer_quantity, category_id) VALUES ('Cherries', 'Sweet cherries', 90, 9, 2);

-- IDs 21-30
INSERT INTO item (name, description, quantity, offer_quantity, category_id) VALUES ('Bread', 'Whole grain bread loaf', 80, 8, 3);
INSERT INTO item (name, description, quantity, offer_quantity, category_id) VALUES ('Croissant', 'Buttery croissants', 60, 6, 3);
INSERT INTO item (name, description, quantity, offer_quantity, category_id) VALUES ('Bagel', 'Plain bagels', 70, 7, 3);
INSERT INTO item (name, description, quantity, offer_quantity, category_id) VALUES ('Muffin', 'Blueberry muffins', 50, 5, 3);
INSERT INTO item (name, description, quantity, offer_quantity, category_id) VALUES ('Cake', 'Chocolate cake', 40, 4, 3);
INSERT INTO item (name, description, quantity, offer_quantity, category_id) VALUES ('Donut', 'Glazed donuts', 90, 9, 3);
INSERT INTO item (name, description, quantity, offer_quantity, category_id) VALUES ('Scone', 'Cheese scones', 75, 7, 3);
INSERT INTO item (name, description, quantity, offer_quantity, category_id) VALUES ('Tart', 'Lemon tarts', 65, 6, 3);
INSERT INTO item (name, description, quantity, offer_quantity, category_id) VALUES ('Pie', 'Apple pie', 55, 5, 3);
INSERT INTO item (name, description, quantity, offer_quantity, category_id) VALUES ('Brownie', 'Fudge brownies', 85, 8, 3);

-- 'Milk' has ID 1
INSERT INTO item_details (name, value, item_id) VALUES ('Fat Content', '3.5%', 1);
INSERT INTO item_details (name, value, item_id) VALUES ('Package', '1L Carton', 1);

-- 'Apple' has ID 11
INSERT INTO item_details (name, value, item_id) VALUES ('Type', 'Red Delicious', 11);
INSERT INTO item_details (name, value, item_id) VALUES ('Organic', 'Yes', 11);

-- 'Bread' has ID 21
INSERT INTO item_details (name, value, item_id) VALUES ('Weight', '500g', 21);
INSERT INTO item_details (name, value, item_id) VALUES ('Grain', 'Whole Wheat', 21);


INSERT INTO location (id, latitude, longitude, distance_to_base) VALUES(1, 38.24289851714071, 21.727808051916337, 0);

INSERT INTO user (id, username, password, role, full_name, email, phone, location_id)
VALUES(1, 'admin', 'admin', 'ADMIN', '', 'admin.base0@system.gov', '', 1);

INSERT INTO user (username, password, role, full_name, email, phone, location_id)
VALUES ('citizen1', 'password123', 'CITIZEN', 'John Doe', 'john@example.com', '1234567890', null);
