DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS carts;
DROP TABLE IF EXISTS customer_info;
DROP TABLE IF EXISTS dishes;
DROP TABLE IF EXISTS restaurants;
DROP TABLE IF EXISTS users;

-- Таблица пользователей
CREATE TABLE users (
                       id BIGINT AUTO_INCREMENT PRIMARY KEY,
                       name VARCHAR(50) NOT NULL UNIQUE,
                       email VARCHAR(50) NOT NULL UNIQUE,
                       password VARCHAR(255) NOT NULL,
                       role VARCHAR(10) DEFAULT 'USER',
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Таблица ресторанов
CREATE TABLE restaurants (
                             id BIGINT AUTO_INCREMENT PRIMARY KEY,
                             name VARCHAR(255) NOT NULL UNIQUE,
                             url VARCHAR(255) NOT NULL UNIQUE,
                             address VARCHAR(255) NOT NULL,
                             phone VARCHAR(20),
                             description TEXT
);

-- Таблица блюд
CREATE TABLE dishes (
                        id BIGINT AUTO_INCREMENT PRIMARY KEY,
                        restaurant_id BIGINT NOT NULL,
                        name VARCHAR(255) NOT NULL,
                        description VARCHAR(500) NOT NULL,
                        price DECIMAL(10, 2) NOT NULL,
                        weight INT NOT NULL,
                        url VARCHAR(255) NOT NULL UNIQUE,
                        FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
);

-- Таблица информации о доставке
CREATE TABLE customer_info (
                               id BIGINT AUTO_INCREMENT PRIMARY KEY,
                               user_id BIGINT NOT NULL UNIQUE,
                               phone VARCHAR(20) NOT NULL UNIQUE,
                               address VARCHAR(100) NOT NULL,
                               FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Таблица корзин
CREATE TABLE carts (
                       id BIGINT AUTO_INCREMENT PRIMARY KEY,
                       user_id BIGINT NOT NULL UNIQUE,
                       total DECIMAL(10, 2),
                       FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Таблица товаров в корзине
CREATE TABLE cart_items (
                            id BIGINT AUTO_INCREMENT PRIMARY KEY,
                            cart_id BIGINT NOT NULL,
                            dish_id BIGINT NOT NULL,
                            quantity INT NOT NULL,
                            price DECIMAL(10, 2) NOT NULL,
                            FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
                            FOREIGN KEY (dish_id) REFERENCES dishes(id) ON DELETE CASCADE
);

-- Таблица заказов
CREATE TABLE orders (
                        id BIGINT AUTO_INCREMENT PRIMARY KEY,
                        user_id BIGINT NOT NULL,
                        order_time TIMESTAMP NOT NULL,
                        update_time TIMESTAMP NOT NULL,
                        status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
                        total DECIMAL(10, 2),
                        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Таблица товаров в заказе
CREATE TABLE order_items (
                             id BIGINT AUTO_INCREMENT PRIMARY KEY,
                             order_id BIGINT NOT NULL,
                             dish_id BIGINT NOT NULL,
                             quantity INT NOT NULL,
                             price_at_order DECIMAL(10, 2) NOT NULL,
                             FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
                             FOREIGN KEY (dish_id) REFERENCES dishes(id) ON DELETE CASCADE
);

-- Индексы для оптимизации запросов
CREATE INDEX idx_restaurants_name ON restaurants(name);
CREATE INDEX idx_dishes_restaurant ON dishes(restaurant_id);
CREATE INDEX idx_dishes_name ON dishes(name);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_cart_items_cart ON cart_items(cart_id);
CREATE INDEX idx_order_items_order ON order_items(order_id);
