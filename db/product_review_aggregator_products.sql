-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: product_review_aggregator
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `image_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Sony WH-1000XM5','The Sony WH-1000XM5 delivers premium noise cancelling, crystal-clear sound, and all-day comfort in a sleek, modern design. With up to 30 hours of battery life, multipoint Bluetooth pairing, and smart ambient features, it’s an excellent choice for travel, work, and everyday listening.',349.99,'/assets/img/sony-wh1000xm5.jpg',1,'2025-11-17 02:12:22'),(2,'MacBook Air M2','Effortlessly thin and ultra-light, the MacBook Air (M2) pairs cutting-edge performance with exceptional portability. Powered by Apple’s M2 chip, it delivers swift responsiveness for everyday tasks and creative workflows, while the vibrant Liquid Retina display, all-day battery life, and fan-free design make it ideal for work or play wherever you go.',999.00,'/assets/img/apple-macbook-air-m2.jpg',2,'2025-11-17 02:12:22'),(3,'iPhone 15 Pro','The iPhone 15 Pro features a lightweight titanium design, a stunning 120Hz Super Retina XDR display, and the powerful A17 Pro chip. With a pro-grade triple-camera system, USB-C connectivity, and a customizable Action Button, it delivers top-tier performance in a compact flagship form.',1199.00,'/assets/img/iphone-15-pro.jpg',3,'2025-11-17 02:12:22'),(4,'Dell U2723QE','The Dell UltraSharp U2723QE is a 27″ 4K UHD (3840×2160) monitor built for professional workflows, featuring a high-contrast IPS Black panel, full USB-C hub with 90 W power delivery, Ethernet and daisy-chaining support, and adjustable ergonomic stand.',599.00,'/assets/img/Dell-U2723QE.jpg',4,'2025-11-17 02:12:22'),(5,'Sony WH-CH720N','The Sony WH-CH720N are lightweight wireless noise-canceling headphones designed for everyday comfort and clear, balanced sound. With long battery life, reliable Bluetooth connectivity, and effective ANC powered by Sony’s Dual Noise Sensor technology, they deliver an immersive listening experience at an affordable price.',149.00,'http://localhost:5173/assets/img/sony-wh-ch720n.jpg',1,'2025-11-19 10:05:08'),(6,'JBL Tune 760NC','Lightweight wireless over-ear headphones',129.00,'/assets/img/JBL-Tune-760NC.jpg',1,'2025-11-19 10:05:08'),(7,'Bose QuietComfort SE','Premium comfort and ANC',299.00,'/assets/img/bose-quietcomfort-se-headphones-2-3013.png',1,'2025-11-19 10:05:08'),(8,'Anker Soundcore Q30','Hybrid ANC with long battery life',89.00,'/assets/img/anker-soundcore-xr-scaled.jpg',1,'2025-11-19 10:05:08'),(9,'Sennheiser HD 450BT','Wireless headphones with deep bass',179.00,'/assets/img/Sennheiser-HD450BT-White-A.jpg',1,'2025-11-19 10:05:08'),(10,'Dell XPS 13','Ultra thin and powerful laptop',1399.00,'/assets/img/dell-xps-13-9340-ultra-7-hxrgt-638763566656439373-600x600.jpg',2,'2025-11-19 10:05:08'),(11,'MacBook Pro 14','Apple M2 Pro chip performance',1999.00,'/assets/img/text_ng_n_1__6_138.png',2,'2025-11-19 10:05:08'),(12,'HP Spectre x360','2-in-1 premium ultrabook',1599.00,'/assets/img/HP-Spectre-x360-15-01.jpg',2,'2025-11-19 10:05:08'),(13,'Asus ROG Strix G15','Gaming laptop with RTX graphics',1799.00,'/assets/img/Laptop-Asus-ROG-Strix-G15-G513RC-1.jpg',2,'2025-11-19 10:05:08'),(14,'Lenovo ThinkPad X1 Carbon','Business-class lightweight laptop',1499.00,'/assets/img/43396_laptop_lenovo_thinkpad_x1_carbon_gen_10_21cb009wvn_anphatpc_35.jpg',2,'2025-11-19 10:05:08'),(15,'iPhone 15','Apple A16 chip with dual-camera system',799.00,'/assets/img/iphone-15-1-3-750x500.jpg',3,'2025-11-19 10:05:08'),(16,'Samsung Galaxy S23','Flagship Android performance',899.00,'/assets/img/samsung-galaxy-s23-600x600.jpg',3,'2025-11-19 10:05:08'),(17,'Google Pixel 8','AI-powered photography',699.00,'/assets/img/pixel-8.jpg',3,'2025-11-19 10:05:08'),(18,'Xiaomi 13','High-performance smartphone',649.00,'/assets/img/xiaomi-13-thumb-den-600x600.jpg',3,'2025-11-19 10:05:08'),(19,'OnePlus 11','Fast performance with OxygenOS',749.00,'/assets/img/oneplus-11.jpg',3,'2025-11-19 10:05:08'),(20,'LG UltraGear 27GP850','27-inch QHD 165Hz gaming monitor',349.00,'/assets/img/19737-lg-27gp850-b-4.jpg',4,'2025-11-19 10:05:08'),(21,'Samsung Odyssey G5','144Hz curved gaming monitor',299.00,'/assets/img/49432_m__n_h__nh_gaming_samsung_odyssey_g5_g50d_ls27dg502eexxv__2_.jpg',4,'2025-11-19 10:05:08'),(22,'Acer Nitro VG271','27-inch IPS 144Hz display',259.00,'/assets/img/50190_m__n_h__nh_acer_nitro_vg1_vg271u_m3.jpg',4,'2025-11-19 10:05:08'),(23,'ASUS ProArt PA278QV','Color-accurate monitor for creators',399.00,'/assets/img/33436_asus_proart_pa278qv_upweb_1.jpg',4,'2025-11-19 10:05:08'),(24,'Dell S2721DGF','27-inch 165Hz QHD gaming monitor',389.00,'/assets/img/36185_update_image_screenfill_monitor_s2721dgf_2000x1500_v1.jpg',4,'2025-11-19 10:05:08');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-24 20:11:08
