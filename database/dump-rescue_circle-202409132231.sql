-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: rescue_circle
-- ------------------------------------------------------
-- Server version	8.0.20

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `announcement`
--

DROP TABLE IF EXISTS `announcement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `announcement` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `announcement_date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `announcement`
--

LOCK TABLES `announcement` WRITE;
/*!40000 ALTER TABLE `announcement` DISABLE KEYS */;
INSERT INTO `announcement` VALUES (1,'Bakery:Teaching&Feeding','This charity event will sell baked good to raise money for the people of Patras in need. Any baking supply you can provide is helping this cause!','2024-09-13 18:30:12'),(2,'MEDICAL SUPPLIES IN NEED: HELP NOW','There is great need for medical supplies since the hurricanes. If you can spare it please provide for those in need.','2024-09-13 18:37:55');
/*!40000 ALTER TABLE `announcement` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `announcements_needs`
--

DROP TABLE IF EXISTS `announcements_needs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `announcements_needs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `announcement_id` int NOT NULL,
  `item_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `announcement_id` (`announcement_id`),
  KEY `item_id` (`item_id`),
  CONSTRAINT `announcements_needs_ibfk_1` FOREIGN KEY (`announcement_id`) REFERENCES `announcement` (`id`),
  CONSTRAINT `announcements_needs_ibfk_2` FOREIGN KEY (`item_id`) REFERENCES `item` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `announcements_needs`
--

LOCK TABLES `announcements_needs` WRITE;
/*!40000 ALTER TABLE `announcements_needs` DISABLE KEYS */;
INSERT INTO `announcements_needs` VALUES (1,1,17),(2,1,8),(3,1,1),(4,1,3),(5,2,32),(6,2,33),(7,2,31);
/*!40000 ALTER TABLE `announcements_needs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `item`
--

DROP TABLE IF EXISTS `item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `item` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `quantity` int NOT NULL DEFAULT '0',
  `offer_quantity` int NOT NULL DEFAULT '2',
  `category_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `item_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `item_category` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `item`
--

LOCK TABLES `item` WRITE;
/*!40000 ALTER TABLE `item` DISABLE KEYS */;
INSERT INTO `item` VALUES (1,'Milk','Fresh cow milk',100,10,1),(2,'Cheddar Cheese','Aged cheddar cheese',50,5,1),(3,'Butter','Unsalted butter',80,8,1),(4,'Yogurt','Greek yogurt',120,12,1),(5,'Cottage Cheese','Low-fat cottage cheese',60,6,1),(6,'Sour Cream','Natural sour cream',40,4,1),(7,'Ice Cream','Vanilla ice cream',70,7,1),(8,'Whipping Cream','Heavy whipping cream',30,3,1),(9,'Parmesan','Grated Parmesan cheese',55,5,1),(10,'Gouda','Smoked Gouda cheese',45,4,1),(11,'Apple','Red delicious apples',200,20,2),(12,'Banana','Fresh ripe bananas',150,15,2),(13,'Orange','Juicy oranges',180,18,2),(14,'Pear','Green pears',160,16,2),(15,'Grapes','Seedless grapes',140,14,2),(16,'Blueberries','Fresh blueberries',120,12,2),(17,'Strawberries','Organic strawberries',130,13,2),(18,'Pineapple','Tropical pineapple',110,11,2),(19,'Mango','Ripe mangoes',100,10,2),(20,'Cherries','Sweet cherries',90,9,2),(21,'Bread','Whole grain bread loaf',80,8,3),(22,'Croissant','Buttery croissants',60,6,3),(23,'Bagel','Plain bagels',70,7,3),(24,'Muffin','Blueberry muffins',50,5,3),(25,'Cake','Chocolate cake',40,4,3),(26,'Donut','Glazed donuts',90,9,3),(27,'Scone','Cheese scones',75,7,3),(28,'Tart','Lemon tarts',65,6,3),(29,'Pie','Apple pie',55,5,3),(30,'Brownie','Fudge brownies',85,8,3),(31,'Bandages','Bandages for the sick',100,3,4),(32,'Alcohol 98%','Sterilization required for tools and wounds',80,2,4),(33,'Painkillers','Will be distributed to citizens and pharmacies',70,1,4);
/*!40000 ALTER TABLE `item` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`%`*/ /*!50003 TRIGGER `before_insert_item` BEFORE INSERT ON `item` FOR EACH ROW BEGIN

    IF NEW.quantity IS NULL THEN

        SET NEW.quantity = 0;

    END IF;

    IF NEW.offer_quantity IS NULL THEN

        SET NEW.offer_quantity = 2;

    END IF;

END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `item_category`
--

DROP TABLE IF EXISTS `item_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `item_category` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `item_category`
--

LOCK TABLES `item_category` WRITE;
/*!40000 ALTER TABLE `item_category` DISABLE KEYS */;
INSERT INTO `item_category` VALUES (3,'Bakery'),(1,'Dairy'),(2,'Fruits'),(4,'Medicine');
/*!40000 ALTER TABLE `item_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `item_details`
--

DROP TABLE IF EXISTS `item_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `item_details` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `value` varchar(255) NOT NULL,
  `item_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `item_id` (`item_id`),
  CONSTRAINT `item_details_ibfk_1` FOREIGN KEY (`item_id`) REFERENCES `item` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `item_details`
--

LOCK TABLES `item_details` WRITE;
/*!40000 ALTER TABLE `item_details` DISABLE KEYS */;
INSERT INTO `item_details` VALUES (1,'Fat Content','3.5%',1),(2,'Package','1L Carton',1),(3,'Type','Red Delicious',11),(4,'Organic','Yes',11),(5,'Weight','500g',21),(6,'Grain','Whole Wheat',21);
/*!40000 ALTER TABLE `item_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `location`
--

DROP TABLE IF EXISTS `location`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `location` (
  `id` int NOT NULL AUTO_INCREMENT,
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  `distance_to_base` double DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `location`
--

LOCK TABLES `location` WRITE;
/*!40000 ALTER TABLE `location` DISABLE KEYS */;
INSERT INTO `location` VALUES (1,38.24289851714071,21.727808051916337,0),(2,38.24398743109073,21.73397363123221,NULL),(3,38.23885426509278,21.733536596353886,NULL),(4,38.240749344846655,21.734823114351897,NULL),(5,38.24289851714071,21.727808051916337,NULL),(6,38.24585662521322,21.73385205782291,NULL),(7,38.24299640651311,21.7427081869717,NULL),(8,38.22389417378349,21.726066865450704,NULL),(9,38.25493649679805,21.744663477639637,NULL);
/*!40000 ALTER TABLE `location` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `offer`
--

DROP TABLE IF EXISTS `offer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `offer` (
  `id` int NOT NULL AUTO_INCREMENT,
  `citizen_id` int DEFAULT NULL,
  `rescuer_id` int DEFAULT NULL,
  `item_id` int DEFAULT NULL,
  `announcement_id` int DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `status` enum('PENDING','ASSUMED','COMPLETED') DEFAULT 'PENDING',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `assumed_at` datetime DEFAULT NULL,
  `completed_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `citizen_id` (`citizen_id`),
  KEY `item_id` (`item_id`),
  KEY `rescuer_id` (`rescuer_id`),
  KEY `announcement_id` (`announcement_id`),
  CONSTRAINT `offer_ibfk_1` FOREIGN KEY (`citizen_id`) REFERENCES `user` (`id`),
  CONSTRAINT `offer_ibfk_2` FOREIGN KEY (`item_id`) REFERENCES `item` (`id`),
  CONSTRAINT `offer_ibfk_3` FOREIGN KEY (`rescuer_id`) REFERENCES `user` (`id`),
  CONSTRAINT `offer_ibfk_4` FOREIGN KEY (`announcement_id`) REFERENCES `announcement` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `offer`
--

LOCK TABLES `offer` WRITE;
/*!40000 ALTER TABLE `offer` DISABLE KEYS */;
INSERT INTO `offer` VALUES (1,9,3,31,1,7,'ASSUMED','2024-09-13 18:52:11','2024-09-13 19:00:09',NULL),(2,9,3,33,1,7,'ASSUMED','2024-09-13 18:52:14','2024-09-13 19:01:06',NULL),(5,9,3,32,1,1,'ASSUMED','2024-09-13 18:54:00','2024-09-13 19:00:13',NULL),(6,6,NULL,3,1,200,'PENDING','2024-09-13 19:11:59',NULL,NULL),(7,6,NULL,1,1,200,'PENDING','2024-09-13 19:12:01',NULL,NULL),(8,6,NULL,17,1,200,'PENDING','2024-09-13 19:12:03',NULL,NULL);
/*!40000 ALTER TABLE `offer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `request`
--

DROP TABLE IF EXISTS `request`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `request` (
  `id` int NOT NULL AUTO_INCREMENT,
  `citizen_id` int DEFAULT NULL,
  `rescuer_id` int DEFAULT NULL,
  `item_id` int DEFAULT NULL,
  `number_of_people` int NOT NULL,
  `quantity` int DEFAULT NULL,
  `status` enum('PENDING','ASSUMED','COMPLETED') DEFAULT 'PENDING',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `assumed_at` datetime DEFAULT NULL,
  `completed_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `citizen_id` (`citizen_id`),
  KEY `item_id` (`item_id`),
  KEY `rescuer_id` (`rescuer_id`),
  CONSTRAINT `request_ibfk_1` FOREIGN KEY (`citizen_id`) REFERENCES `user` (`id`),
  CONSTRAINT `request_ibfk_2` FOREIGN KEY (`item_id`) REFERENCES `item` (`id`),
  CONSTRAINT `request_ibfk_3` FOREIGN KEY (`rescuer_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `request`
--

LOCK TABLES `request` WRITE;
/*!40000 ALTER TABLE `request` DISABLE KEYS */;
INSERT INTO `request` VALUES (1,2,NULL,19,4,40,'PENDING','2024-09-13 18:10:54',NULL,NULL),(2,2,NULL,28,2,12,'PENDING','2024-09-13 18:16:26',NULL,NULL),(3,2,NULL,2,1,5,'PENDING','2024-09-13 18:16:39',NULL,NULL),(4,8,3,31,1,3,'ASSUMED','2024-09-13 18:54:38','2024-09-13 19:06:31',NULL),(5,8,NULL,33,1,1,'PENDING','2024-09-13 18:54:50',NULL,NULL),(6,7,NULL,1,4,40,'PENDING','2024-09-13 19:08:53',NULL,NULL),(7,7,NULL,3,2,16,'PENDING','2024-09-13 19:09:35',NULL,NULL);
/*!40000 ALTER TABLE `request` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rescue_vehicle`
--

DROP TABLE IF EXISTS `rescue_vehicle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rescue_vehicle` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` enum('PERSONAL USE','VAN','PICKUP TRUCK') NOT NULL,
  `status` enum('WAITING','ACTIVE','UNAVAILABLE') DEFAULT 'WAITING',
  `active_tasks` int DEFAULT '0',
  `rescuer_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `rescuer_id` (`rescuer_id`),
  CONSTRAINT `rescue_vehicle_ibfk_1` FOREIGN KEY (`rescuer_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rescue_vehicle`
--

LOCK TABLES `rescue_vehicle` WRITE;
/*!40000 ALTER TABLE `rescue_vehicle` DISABLE KEYS */;
INSERT INTO `rescue_vehicle` VALUES (1,'PICKUP TRUCK','ACTIVE',4,3),(2,'VAN','WAITING',0,4),(3,'PERSONAL USE','WAITING',0,5);
/*!40000 ALTER TABLE `rescue_vehicle` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`%`*/ /*!50003 TRIGGER `before_update_rescue_vehicle` BEFORE UPDATE ON `rescue_vehicle` FOR EACH ROW BEGIN

    IF NEW.active_tasks > 0 THEN

        SET NEW.status = 'ACTIVE';

    END IF;

    IF NEW.active_tasks <= 0 THEN

        SET NEW.status = 'WAITING';

        SET NEW.active_tasks = 0;

    END IF;

END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `rescuer_inventory`
--

DROP TABLE IF EXISTS `rescuer_inventory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rescuer_inventory` (
  `id` int NOT NULL AUTO_INCREMENT,
  `rescuer_id` int NOT NULL,
  `item_id` int NOT NULL,
  `amount` int DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_rescuer_item` (`rescuer_id`,`item_id`),
  KEY `item_id` (`item_id`),
  CONSTRAINT `rescuer_inventory_ibfk_1` FOREIGN KEY (`rescuer_id`) REFERENCES `user` (`id`),
  CONSTRAINT `rescuer_inventory_ibfk_2` FOREIGN KEY (`item_id`) REFERENCES `item` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rescuer_inventory`
--

LOCK TABLES `rescuer_inventory` WRITE;
/*!40000 ALTER TABLE `rescuer_inventory` DISABLE KEYS */;
INSERT INTO `rescuer_inventory` VALUES (1,3,31,0),(2,3,32,0),(3,3,33,0);
/*!40000 ALTER TABLE `rescuer_inventory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('ADMIN','RESCUER','CITIZEN') NOT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `location_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `location_id` (`location_id`),
  CONSTRAINT `user_ibfk_1` FOREIGN KEY (`location_id`) REFERENCES `location` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'admin','$2b$10$Df9RoH2d8BwWUWGIsAJ74er5Dvjpr8snpLnBizrJPaAcQc4UGDxty','ADMIN','','admin.base0@system.gov','',1),(2,'NickInNeed','$2b$10$Df9RoH2d8BwWUWGIsAJ74er5Dvjpr8snpLnBizrJPaAcQc4UGDxty','CITIZEN','Nick Ned','nickinneed@gmail.com','6973351234',2),(3,'an_htrooper','$2b$10$Df9RoH2d8BwWUWGIsAJ74er5Dvjpr8snpLnBizrJPaAcQc4UGDxty','RESCUER','Antonios Nikolioudis','heavytrooper@rescuer.rc','6957384201',3),(4,'red_cross','$2b$10$Rsg9RzDukpFflKAKvtOAPejWlWsIVbSY4/Y/1ch4QajKOqbL34nsO','RESCUER','Stavroula Kokkinh','redstavroula@rescuer.rc','6957383399',4),(5,'kogiman','$2b$10$L6kftWz1juIt1/qsYAUb7.HubUbRvAOi/t3f0zfZsgDUs9JseZ.j6','RESCUER','Manos Kogiannakis','kogiman@rescuer.rc','6957384214',5),(6,'HLGA','$2b$10$OmLTvfWkpHRVV4mMfhwzEujlHrD3NvFu0mO2pAzY5UGIXXn7i3Idq','CITIZEN','Hlias Galanopoulos','hlga@gmail.com','6987143256',6),(7,'ElenaMark','$2b$10$x.vSSnmdW8E9YtWuIzhEzuqU.UlE7FLQKTWHFFaHX9dKLFYNjcchW','CITIZEN','Elena Markou','elenamarkou@gmail.com','6897874847',7),(8,'AngelApost','$2b$10$74lTRb.ctc5YHTYzKkhRh.F.Gfvhc..BOe8BzWlbaAnLNoT86vbcS','CITIZEN','Angelos Apostolos','angelapost@gmail.com','6978478293',8),(9,'GeitonikiAlilegii','$2b$10$4rX/j05l.hIbRosmiUkOK.wJem/OJ6wwS82B81tcyrxYOpRYKts/2','CITIZEN','Agellikh Tzanou','ageltzan@gmail.com','6909876542',9);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'rescue_circle'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-09-13 22:31:49
