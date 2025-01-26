CREATE TABLE dailytasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    dataAndHour DATETIME NOT NULL,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(500),
    isFinished TINYINT(1) NOT NULL DEFAULT 0
);