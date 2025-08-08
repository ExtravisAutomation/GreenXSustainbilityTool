-- Create & use DB
CREATE DATABASE IF NOT EXISTS GreenX;
USE GreenX;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- == Lookups ==
CREATE TABLE IF NOT EXISTS roles (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    role_name   VARCHAR(255) NOT NULL,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS vendor (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    vendor_name  VARCHAR(255) NOT NULL,
    created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS rack (
    id               INT AUTO_INCREMENT PRIMARY KEY,
    rack_name        VARCHAR(255) NOT NULL,
    site_id          INT NOT NULL,
    manufacture_date DATE DEFAULT NULL,
    rack_model       VARCHAR(255) DEFAULT NULL,
    serial_number    VARCHAR(255) DEFAULT NULL,
    RFS              VARCHAR(255) DEFAULT NULL,
    Height           INT DEFAULT NULL,
    Width            INT DEFAULT NULL,
    Depth            INT DEFAULT NULL,
    floor            INT DEFAULT NULL,
    status           VARCHAR(255) DEFAULT NULL,
    created_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at       DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_rack_site FOREIGN KEY (site_id) REFERENCES site(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS site (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    site_name     VARCHAR(255) DEFAULT NULL,
    site_type     VARCHAR(255) DEFAULT NULL,
    region        VARCHAR(255) DEFAULT NULL,
    city          VARCHAR(255) DEFAULT NULL,
    latitude      VARCHAR(255) DEFAULT NULL,
    longitude     VARCHAR(255) DEFAULT NULL,
    status        VARCHAR(255) DEFAULT NULL,
    total_devices VARCHAR(255) DEFAULT NULL,
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE IF NOT EXISTS password_groups (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    password_group_name VARCHAR(255),
    password_group_type VARCHAR(255),
    username            VARCHAR(255),
    password            VARCHAR(255),
    created_at          DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_password_group_name (password_group_name),
    INDEX idx_password_group_type (password_group_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- == Main Tables ==
CREATE TABLE IF NOT EXISTS device_type (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    device_type VARCHAR(255) NOT NULL,
    vendor_id   INT NOT NULL,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_vendor_device_type FOREIGN KEY (vendor_id) REFERENCES vendor (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS devices (
    id                INT AUTO_INCREMENT PRIMARY KEY,
    ip_address        VARCHAR(255) NOT NULL,
    device_name       VARCHAR(200),
    OnBoardingStatus  TINYINT(1) DEFAULT 0,
    site_id           INT,
    rack_id           INT,
    created_at        DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at        DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    password_group_id INT,
    node_id           INT,
    messages          VARCHAR(1000),
    vendor_id         INT,
    device_nature     VARCHAR(200),
    collection_status TINYINT(1),
    device_type_id    INT,
    CONSTRAINT fk_devices_device_type    FOREIGN KEY (device_type_id)    REFERENCES device_type (id),
    CONSTRAINT fk_devices_rack           FOREIGN KEY (rack_id)           REFERENCES rack (id),
    CONSTRAINT fk_devices_site           FOREIGN KEY (site_id)           REFERENCES site (id),
    CONSTRAINT fk_devices_vendor         FOREIGN KEY (vendor_id)         REFERENCES vendor (id),
    CONSTRAINT fk_devices_password_group FOREIGN KEY (password_group_id) REFERENCES password_groups (id),
    INDEX ip_index (ip_address)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- === Global cap: max 50 devices (Open-Source tier) ===
-- Optional but recommended: avoid duplicate IPs eating the quota
ALTER TABLE devices
  ADD UNIQUE KEY uniq_ip (ip_address);

DELIMITER $$

DROP TRIGGER IF EXISTS trg_devices_limit $$
CREATE TRIGGER trg_devices_limit
BEFORE INSERT ON devices
FOR EACH ROW
BEGIN
  DECLARE device_count INT;
  SELECT COUNT(*) INTO device_count FROM devices;
  IF device_count >= 50 THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Device limit (50) reached for Open Source edition';
  END IF;
END $$

DELIMITER ;

-- Re-enable FKs if you had disabled them earlier
SET FOREIGN_KEY_CHECKS = 1;



CREATE TABLE IF NOT EXISTS dashboard_module (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    modules_name VARCHAR(255) NOT NULL,
    created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `user` (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    email        VARCHAR(255) NOT NULL,
    password     VARCHAR(255) NOT NULL,
    user_token   VARCHAR(255) NOT NULL,
    username     VARCHAR(255),
    is_active    TINYINT(1) NOT NULL,
    is_superuser TINYINT(1) NOT NULL,
    role_id      INT,
    name         VARCHAR(255),
    created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uq_email      UNIQUE (email),
    CONSTRAINT uq_user_token UNIQUE (user_token),
    CONSTRAINT fk_user_role  FOREIGN KEY (role_id) REFERENCES roles (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS deviceInventory (
    id                   INT AUTO_INCREMENT PRIMARY KEY,
    contract_expiry      DATE DEFAULT NULL,
    contract_number      VARCHAR(255) DEFAULT NULL,
    created_by           VARCHAR(255) DEFAULT NULL,
    device_id            INT DEFAULT NULL,
    domain               VARCHAR(255) DEFAULT NULL,
    hardware_version     VARCHAR(255) DEFAULT NULL,
    manufacturer_date    DATE DEFAULT NULL,
    manufacturer         VARCHAR(255) DEFAULT NULL,
    pn_code              VARCHAR(255) DEFAULT NULL,
    rfs_date             DATE DEFAULT NULL,
    serial_number        VARCHAR(255) DEFAULT NULL,
    software_version     VARCHAR(255) DEFAULT NULL,
    status               VARCHAR(255) DEFAULT NULL,
    stack                TINYINT(1) DEFAULT NULL,
    error_message        VARCHAR(1000) DEFAULT NULL,
    active_psu           INT DEFAULT NULL,
    non_active_psu       INT DEFAULT NULL,
    switch_topology      VARCHAR(100) DEFAULT NULL,
    switch_mode          VARCHAR(100) DEFAULT NULL,
    role                 VARCHAR(255) DEFAULT NULL,
    psu_model            VARCHAR(100) DEFAULT NULL,
    command              VARCHAR(100) DEFAULT NULL,
    psu_count            INT DEFAULT NULL,
    total_power_capacity INT DEFAULT NULL,
    total_interface      INT DEFAULT NULL,
    up_link              INT DEFAULT NULL,
    down_link            INT DEFAULT NULL,
    access_port          INT DEFAULT NULL,
    bandwidth            BIGINT DEFAULT NULL,
    up_Link_interfaces   VARCHAR(1000) DEFAULT NULL,
    interfaces_types     VARCHAR(1000) DEFAULT NULL,
    created_at           DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at           DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_deviceInventory_device FOREIGN KEY (device_id) REFERENCES devices(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS user_modules_access (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    module_id  INT,
    user_id    INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_modules_access_module FOREIGN KEY (module_id) REFERENCES dashboard_module (id),
    CONSTRAINT fk_user_modules_access_user   FOREIGN KEY (user_id)   REFERENCES `user` (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS blacklisted_token (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    token      VARCHAR(512) UNIQUE,
    email      VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS devices_sntc (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    model_name VARCHAR(200),
    hw_eol_ad  DATE,
    hw_eos     DATE,
    sw_EoSWM   DATE,
    hw_EoRFA   DATE,
    sw_EoVSS   DATE,
    hw_EoSCR   DATE,
    hw_ldos    DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS building (
    id             INT AUTO_INCREMENT PRIMARY KEY,
    building_name  VARCHAR(255),
    created_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at     DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS rack_building (
    rack_id     INT NOT NULL,
    building_id INT NOT NULL,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (rack_id, building_id),
    FOREIGN KEY (rack_id) REFERENCES rack(id),
    FOREIGN KEY (building_id) REFERENCES building(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- SEED ROLES
INSERT INTO roles (id, role_name) VALUES (1, 'Admin')
    ON DUPLICATE KEY UPDATE role_name = VALUES(role_name);

-- SEED ADMIN USER
INSERT INTO `user` (
  email, password, user_token, username, is_active, is_superuser, role_id, name, created_at, updated_at
) VALUES (
  'admin@example.com', '$2b$12$KX8lL76tZmPQkKABG030vOLsAOX0zc3F4Rmh6kezVVSaBs8iEIcTm', 'fixed-token-123', 'admin', 1, 1, 1, 'Administrator', NOW(), NOW()
)
ON DUPLICATE KEY UPDATE updated_at = VALUES(updated_at);

-- SEED MODULES
INSERT INTO dashboard_module (id, modules_name) VALUES
(1, 'Dashboard'),
(2, 'Onboarded Devices'),
(3, 'Devices Inventory'),
(4, 'Reports'),
(5, 'PUE Calculator'),
(6, 'AI Engine')
ON DUPLICATE KEY UPDATE modules_name = VALUES(modules_name);

-- SEED USER MODULE ACCESS
INSERT INTO user_modules_access (module_id, user_id)
SELECT id, (SELECT id FROM `user` WHERE email = 'admin@example.com')
FROM dashboard_module
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;
