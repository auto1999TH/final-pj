-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- ホスト: 127.0.0.1
-- 生成日時: 2025-02-26 00:41:31
-- サーバのバージョン： 10.4.32-MariaDB
-- PHP のバージョン: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- データベース: `shoptar`
--

-- --------------------------------------------------------

--
-- テーブルの構造 `customer`
--

CREATE TABLE `customer` (
  `CustomerID` int(11) NOT NULL,
  `FullName` varchar(255) DEFAULT NULL,
  `Email` varchar(255) DEFAULT NULL,
  `Address` varchar(50) NOT NULL,
  `Phone` varchar(11) NOT NULL,
  `Password` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- テーブルのデータのダンプ `customer`
--

INSERT INTO `customer` (`CustomerID`, `FullName`, `Email`, `Address`, `Phone`, `Password`) VALUES
(1, 'admin', 'admin@gmail.com', 'เชียงใหม่', '0811111111', '$2b$08$N9mINuYhOJt9iScmc8F5iOB6W8WZz53DYWA6f0RuPYOnaEiQliOQe'),
(2, 'test', 'chikanokotantan@gmail.com', '', '', '$2b$08$MfcOb9yMMEmpXZefYb7Zee0P3zWo0INfECuIS.MvgCPwsO9CcwWly');

-- --------------------------------------------------------

--
-- テーブルの構造 `list`
--

CREATE TABLE `list` (
  `ListID` int(11) NOT NULL,
  `CustomerID` int(11) NOT NULL,
  `ProductID` int(11) NOT NULL,
  `Quantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- テーブルのデータのダンプ `list`
--

INSERT INTO `list` (`ListID`, `CustomerID`, `ProductID`, `Quantity`) VALUES
(1, 1, 1, 3);

-- --------------------------------------------------------

--
-- テーブルの構造 `oder`
--

CREATE TABLE `oder` (
  `OderID` int(11) NOT NULL,
  `CustomerID` int(11) NOT NULL,
  `Payment` varchar(50) NOT NULL,
  `Orders_day` date NOT NULL,
  `Status` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- テーブルの構造 `product`
--

CREATE TABLE `product` (
  `ProductID` int(11) NOT NULL,
  `ProductName` varchar(255) DEFAULT NULL,
  `Description` varchar(250) NOT NULL,
  `Type` varchar(10) NOT NULL,
  `Img` varchar(20) NOT NULL,
  `Sale` varchar(20) NOT NULL,
  `Price` decimal(10,2) DEFAULT NULL,
  `Stock` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- テーブルのデータのダンプ `product`
--

INSERT INTO `product` (`ProductID`, `ProductName`, `Description`, `Type`, `Img`, `Sale`, `Price`, `Stock`) VALUES
(1, 'PlayStation 5 (PS5)', 'เครื่องเล่นเกมที่ทรงพลัง...', 'game', 'ps5', 'sale', 500.00, 500000),
(2, 'PlayStation 1 (PS1)', 'จุดเริ่มต้นของเกม 3D สุดคลาสสิก เกมระดับตำนานเยอะ เล่นได้แบบนอสตัลเจีย', 'game', 'ps1', '', 4000.00, 26),
(3, 'PlayStation 2 (PS2)', 'คอนโซลขายดีที่สุดตลอดกาล มีเกมหลากหลาย กราฟิกพัฒนาแบบก้าวกระโดด', 'game', 'ps2', 'sale', 5000.00, 56600),
(4, 'PlayStation 3 (PS3)', 'รองรับ Blu-ray กราฟิกเริ่มเข้าสู่ HD เกมดังเพียบ เช่น The Last of Us และ Uncharted', 'game', 'ps3', '', 7000.00, 130),
(5, 'PlayStation 4 (PS4)', 'เล่นเกมยุคใหม่ได้ลื่นไหล ภาพสวย รองรับเกม AAA คุณภาพสูงมากมาย', 'game', 'ps4', '', 20000.00, 34),
(6, 'เสื้อโอเวอร์ไซซ์ (Oversized Shirt)', 'สไตล์ชิล ๆ ใส่สบาย ดูเท่และมีความสตรีทแฟชั่น', 'shirt', 't-1', 'sale', 399.00, 100),
(7, 'เสื้อเชิ้ตลินิน (Linen Shirt)', 'ให้ลุคเรียบหรู ใส่แล้วดูแพง เหมาะกับอากาศร้อน', 'shirt', 't-2', '', 599.00, 25),
(8, 'เสื้อครอป (Crop Top)', 'เพิ่มความชิคและเซ็กซี่เบา ๆ เหมาะกับลุคสาวมั่น', 'shirt', 't-3', 'sale', 299.00, 68),
(9, 'เสื้อคอปกโปโล (Polo Shirt)', 'ลุคกึ่งทางการ ดูสุภาพแต่ยังมีสไตล์', 'shirt', 't-4', '', 259.00, 70),
(10, 'เสื้อแขนกุด/เสื้อกล้าม (Sleeveless Shirt)', 'สไตล์สตรีทหรือแนวสปอร์ต ใส่แล้วดูคล่องตัว', 'shirt', 't-5', '', 90.00, 1500);

--
-- ダンプしたテーブルのインデックス
--

--
-- テーブルのインデックス `customer`
--
ALTER TABLE `customer`
  ADD PRIMARY KEY (`CustomerID`);

--
-- テーブルのインデックス `list`
--
ALTER TABLE `list`
  ADD PRIMARY KEY (`ListID`),
  ADD KEY `cus_get` (`CustomerID`),
  ADD KEY `pro_get` (`ProductID`);

--
-- テーブルのインデックス `oder`
--
ALTER TABLE `oder`
  ADD PRIMARY KEY (`OderID`);

--
-- テーブルのインデックス `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`ProductID`);

--
-- ダンプしたテーブルの AUTO_INCREMENT
--

--
-- テーブルの AUTO_INCREMENT `customer`
--
ALTER TABLE `customer`
  MODIFY `CustomerID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- テーブルの AUTO_INCREMENT `list`
--
ALTER TABLE `list`
  MODIFY `ListID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- テーブルの AUTO_INCREMENT `oder`
--
ALTER TABLE `oder`
  MODIFY `OderID` int(11) NOT NULL AUTO_INCREMENT;

--
-- テーブルの AUTO_INCREMENT `product`
--
ALTER TABLE `product`
  MODIFY `ProductID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- ダンプしたテーブルの制約
--

--
-- テーブルの制約 `list`
--
ALTER TABLE `list`
  ADD CONSTRAINT `cus_get` FOREIGN KEY (`CustomerID`) REFERENCES `customer` (`CustomerID`),
  ADD CONSTRAINT `pro_get` FOREIGN KEY (`ProductID`) REFERENCES `product` (`ProductID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
