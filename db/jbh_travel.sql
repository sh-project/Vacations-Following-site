-- MySQL dump 10.13  Distrib 8.0.20, for Win64 (x86_64)
--
-- Host: localhost    Database: jbh_travel
-- ------------------------------------------------------
-- Server version	5.7.19

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
-- Table structure for table `follow`
--

DROP TABLE IF EXISTS `follow`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `follow` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `vacation` int(11) DEFAULT NULL,
  `user` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `vacation` (`vacation`,`user`),
  KEY `user` (`user`),
  CONSTRAINT `fk` FOREIGN KEY (`vacation`) REFERENCES `vacations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `follow_ibfk_1` FOREIGN KEY (`user`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=533 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `follow`
--

LOCK TABLES `follow` WRITE;
/*!40000 ALTER TABLE `follow` DISABLE KEYS */;
INSERT INTO `follow` VALUES (518,77,2),(520,77,3),(529,77,5),(531,78,2),(530,79,5),(526,80,5);
/*!40000 ALTER TABLE `follow` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `permission` char(25) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissions`
--

LOCK TABLES `permissions` WRITE;
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
INSERT INTO `permissions` VALUES (1,'user'),(2,'admin');
/*!40000 ALTER TABLE `permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `security_questions`
--

DROP TABLE IF EXISTS `security_questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `security_questions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `question` char(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `security_questions`
--

LOCK TABLES `security_questions` WRITE;
/*!40000 ALTER TABLE `security_questions` DISABLE KEYS */;
/*!40000 ALTER TABLE `security_questions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` char(35) NOT NULL,
  `last_name` char(35) NOT NULL,
  `user_name` char(32) NOT NULL,
  `password` char(255) NOT NULL,
  `permission` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_name` (`user_name`),
  KEY `permission` (`permission`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`permission`) REFERENCES `permissions` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','adminov','admin','$2b$10$UI/LvXOO6Tuqz5w8a/nM1.wLCSyMsR6BSUsM13u7vvvvF7XXFfiDK',2),(2,'John','Doe','JohnDoe','$2b$10$UI/LvXOO6Tuqz5w8a/nM1.wLCSyMsR6BSUsM13u7vvvvF7XXFfiDK',1),(3,'ploni','almoni','ploni','$2b$10$ty.dgWAe2VoUMoGsT7FxLuaokpCJFt.8g1n0jgArWml6A3O455Geu',1),(5,'yosi','yosef','yosef','$2b$10$blZ7rpoLULrwF6vJDXT1nOh6nJLCZrBzpnvYHa8oPgcMx2qw8pzFC',1);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vacations`
--

DROP TABLE IF EXISTS `vacations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vacations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `destination` char(25) NOT NULL,
  `slogan` char(120) NOT NULL,
  `image` char(255) NOT NULL,
  `description` text,
  `date_from` date NOT NULL,
  `date_to` date NOT NULL,
  `price` decimal(7,2) NOT NULL,
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=93 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vacations`
--

LOCK TABLES `vacations` WRITE;
/*!40000 ALTER TABLE `vacations` DISABLE KEYS */;
INSERT INTO `vacations` VALUES (77,'London','A perfect vacation in the capital of England','edf86ce6-e086-416e-920c-596deddf0caf.jpg','the destination is full of pageantry and tradition, and nowhere else is that on display so vividly than in the destination. Yet is hardly living in the past, continually courting innovation and growth in its art, architecture, restaurants, and hotels.','2020-10-26','2020-10-28',2500.00,'2020-09-02 02:08:00','2020-09-02 03:49:39'),(78,'Barcelona','Football or antiques? Just enjoy','Barcelona.jpg','the destination is full of pageantry and tradition, and nowhere else is that on display so vividly than in the destination. Yet is hardly living in the past, continually courting innovation and growth in its art, architecture, restaurants, and hotels.','2020-10-26','2020-11-07',2555.00,'2020-09-02 02:08:00','2020-09-02 03:49:54'),(79,'Europe','Conquering Europe from side to side','Europe.jpg','the destination is full of pageantry and tradition, and nowhere else is that on display so vividly than in the destination. Yet is hardly living in the past, continually courting innovation and growth in its art, architecture, restaurants, and hotels.','2020-10-26','2020-10-28',3500.00,'2020-09-02 02:08:00','2020-09-02 02:08:03'),(80,'Hong Kong','Hong Kong from top to bottom','HongKong.jpg','the destination is full of pageantry and tradition, and nowhere else is that on display so vividly than in the destination. Yet is hardly living in the past, continually courting innovation and growth in its art, architecture, restaurants, and hotels.','2020-10-26','2020-10-28',1500.00,'2020-09-02 02:08:00','2020-09-02 02:08:03'),(81,'Jaffa','Old Jaffa, with an innovative look','Jaffa.jpg','the destination is full of pageantry and tradition, and nowhere else is that on display so vividly than in the destination. Yet is hardly living in the past, continually courting innovation and growth in its art, architecture, restaurants, and hotels.','2020-10-26','2020-10-28',10000.00,'2020-09-02 02:08:00','2020-09-02 02:08:03'),(82,'paris','From the heights of the Eiffel Tower, to the depths of honey','paris.jpg','the destination is full of pageantry and tradition, and nowhere else is that on display so vividly than in the destination. Yet is hardly living in the past, continually courting innovation and growth in its art, architecture, restaurants, and hotels.','2020-10-26','2020-10-28',8000.00,'2020-09-02 02:08:00','2020-09-02 02:08:03'),(83,'toronto','Toronto, the city and the legend','toronto.jpg','the destination is full of pageantry and tradition, and nowhere else is that on display so vividly than in the destination. Yet is hardly living in the past, continually courting innovation and growth in its art, architecture, restaurants, and hotels.','2020-10-26','2020-10-28',780.00,'2020-09-02 02:08:00','2020-09-02 02:08:03'),(84,'Venice','Sail across your dreams','Venice.jpg','the destination is full of pageantry and tradition, and nowhere else is that on display so vividly than in the destination. Yet is hardly living in the past, continually courting innovation and growth in its art, architecture, restaurants, and hotels.','2020-10-26','2020-10-28',1200.00,'2020-09-02 02:08:00','2020-09-02 02:08:03');
/*!40000 ALTER TABLE `vacations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'jbh_travel'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-09-02  3:56:00
