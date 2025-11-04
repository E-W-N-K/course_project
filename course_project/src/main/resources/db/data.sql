-- Вставка пользователей
INSERT INTO users (name, email, password, role, created_at, updated_at)
VALUES ('admin', 'admin@example.com', '$2a$10$WH4KiyhnNB2GFTivlClaPef9R428N/TOhsvVImjDEbR9TWgmBhBQa', 'ADMIN',
        NOW(), NOW()),
       ('john_user', 'john@example.com', '$2a$10$WH4KiyhnNB2GFTivlClaPef9R428N/TOhsvVImjDEbR9TWgmBhBQa', 'USER',
        NOW(), NOW()),
       ('jane_user', 'jane@example.com', '$2a$10$WH4KiyhnNB2GFTivlClaPef9R428N/TOhsvVImjDEbR9TWgmBhBQa', 'USER',
        NOW(), NOW());

-- Вставка ресторанов
INSERT INTO restaurants (name, url, address, phone, description)
VALUES ('Пиццерия Маргарита', '/pizzeria-margarita', 'ул. Ленина, 1', '+7-999-123-45-67',
        'Лучшая пиццерия в городе с доставкой'),
       ('Суши-бар Токио', '/sushi-tokyo', 'пр. Независимости, 45', '+7-999-987-65-43', 'Аутентичные суши и рамены');

-- Вставка блюд для ресторана 1 (Пиццерия)
INSERT INTO dishes (restaurant_id, name, description, price, weight, url)
VALUES (1, 'Маргарита', 'Классическая пицца с моцареллой и помидорами', 450.00, 400, '/pizza-margarita'),
       (1, 'Пепперони', 'Пицца с колбасой пепперони и сыром', 550.00, 450, '/pizza-pepperoni'),
       (1, 'Четыре сыра', 'Пицца с четырьмя видами сыра', 650.00, 500, '/pizza-four-cheese');

-- Вставка блюд для ресторана 2 (Суши-бар)
INSERT INTO dishes (restaurant_id, name, description, price, weight, url)
VALUES (2, 'Филадельфия', 'Суши-ролл с лососем и сливочным сыром', 380.00, 250, '/sushi-philadelphia'),
       (2, 'Калифорния', 'Суши-ролл с крабом и авокадо', 350.00, 240, '/sushi-california'),
       (2, 'Острый тунец', 'Суши-ролл с острым тунцом', 420.00, 260, '/sushi-spicy-tuna');

-- Вставка корзины для user 2 (john_user)
INSERT INTO carts (user_id, total) VALUES
    (2, 0.00);

-- Вставка корзины для user 3 (jane_user)
INSERT INTO carts (user_id, total) VALUES
    (3, 0.00);

-- Вставка информации о доставке для user 2
INSERT INTO customer_info (user_id, phone, address) VALUES
    (2, '+7-999-111-11-11', 'ул. Пушкина, 10, кв. 25');

-- Вставка информации о доставке для user 3
INSERT INTO customer_info (user_id, phone, address) VALUES
    (3, '+7-999-222-22-22', 'пр. Мира, 50, кв. 100');

-- Вставка первого заказа для user 2 (john_user)
INSERT INTO orders (user_id, order_time, update_time, status, total) VALUES
    (2, NOW(), NOW(), 'COMPLETED', 1000.00);

-- Вставка товаров в первый заказ
INSERT INTO order_items (order_id, dish_id, quantity, price_at_order)
VALUES (1, 1, 2, 450.00),
       (1, 2, 1, 550.00);

-- Вставка второго заказа для user 2 (john_user)
INSERT INTO orders (user_id, order_time, update_time, status, total) VALUES
    (2, DATEADD('DAY', -2, NOW()), DATEADD('DAY', -2, NOW()), 'PENDING', 1130.00);

-- Вставка товаров во второй заказ
INSERT INTO order_items (order_id, dish_id, quantity, price_at_order)
VALUES (2, 4, 2, 380.00),
       (2, 5, 1, 350.00);
