CREATE TABLE jbh_travel.permissions(
	id INT AUTO_INCREMENT PRIMARY KEY,
    permission CHAR(25) NOT NULL
) ENGINE=INNODB;

CREATE TABLE jbh_travel.users(
	id INT AUTO_INCREMENT PRIMARY KEY,
    first_name CHAR(35) NOT NULL,
    last_name CHAR(35) NOT NULL,
    user_name CHAR(32) NOT NULL UNIQUE,
    password CHAR(255) NOT NULL,
    permission INT NOT NULL,
    FOREIGN KEY (permission) REFERENCES permissions(id)
) ENGINE=INNODB;

CREATE TABLE jbh_travel.vacations(
	id INT AUTO_INCREMENT PRIMARY KEY,
    destination CHAR(25) NOT NULL,
    slogan CHAR(120) NOT NULL,
    image CHAR(255) NOT NULL,
	description TEXT,
    date_from DATE NOT NULL,
    date_to DATE NOT NULL,
    price DECIMAL(7,2) NOT NULL,
    create_time DATETIME NOT NULL DEFAULT NOW(),
    update_time DATETIME NOT NULL ON UPDATE NOW() DEFAULT NOW()
) ENGINE=INNODB;

CREATE TABLE jbh_travel.follow(
    id INT AUTO_INCREMENT PRIMARY KEY,
    vacation INT,
    user INT,
    CONSTRAINT fk
    FOREIGN KEY (vacation) REFERENCES vacations(id) ON UPDATE CASCADE ON DELETE CASCADE,
        FOREIGN KEY (user) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=INNODB;


ALTER TABLE jbh_travel.follow ADD UNIQUE (
vacation, user
);