
INSERT INTO customer VALUES (1, 'วิโรจน์-มาลี', 'หนูเหมือน', NULL, '0831714805', NULL, 1, 1446171911402, NULL, NULL);
INSERT INTO customer VALUES (2, 'เสน่ห์', 'ช่วยรอด', NULL, '0805454978', NULL, 1, 1446172025755, NULL, NULL);
INSERT INTO customer VALUES (3, 'ปรียา', 'พงศ์ทอง', NULL, '0899754161', NULL, 1, 1446172093909, NULL, NULL);
INSERT INTO customer VALUES (4, 'บัณฑิต', 'รักชาติ', NULL, '0950327792', NULL, 1, 1446172254862, NULL, NULL);
INSERT INTO customer VALUES (5, 'ทัศนีย์', 'ปานแดง', NULL, NULL, NULL, 1, 1446172308330, NULL, NULL);
INSERT INTO customer VALUES (6, 'นิพล', 'จันทร์นุ้ย', NULL, NULL, NULL, 1, 1446172337597, NULL, NULL);
INSERT INTO customer VALUES (7, 'จุฑาภรณ์', 'คงชู', NULL, NULL, NULL, 1, 1446172372341, NULL, NULL);
INSERT INTO customer VALUES (8, 'สมคิด', 'พรหมจันทร์', NULL, '0899754161', NULL, 1, 1446172417506, NULL, NULL);
INSERT INTO customer VALUES (9, 'นพา', 'สีแก้ว', NULL, NULL, NULL, 1, 1446172446198, NULL, NULL);
INSERT INTO customer VALUES (10, 'สมใจ', 'คงชู', NULL, NULL, NULL, 1, 1446172461994, NULL, NULL);
INSERT INTO customer VALUES (11, 'สุวิทย์', 'ปานแดง', NULL, NULL, NULL, 1, 1446172480808, NULL, NULL);
INSERT INTO customer VALUES (14, 'เทวี', 'สุวรรณ', NULL, NULL, NULL, 1, 1446172634444, NULL, NULL);
INSERT INTO customer VALUES (15, 'ฉลองชัย', 'จารุสิริรังษี', NULL, '0812694018', NULL, 1, 1446172695856, NULL, NULL);
INSERT INTO customer VALUES (16, 'ยงยุทธ', 'เิอี่ยมบริบูรณ์', NULL, '0819594598', NULL, 1, 1446173328441, NULL, NULL);
INSERT INTO customer VALUES (17, 'อภินันท์', 'ชลสุวรรณ', NULL, '0896587162', NULL, 1, 1446173372932, NULL, NULL);
INSERT INTO customer VALUES (18, 'สุธีมนต์', 'รัมมะมิตร', NULL, '0817665946', NULL, 1, 1446173420904, NULL, NULL);
INSERT INTO customer VALUES (19, 'กานต์สิรี', 'ศรีสุนาราชวัลลภ', NULL, '0918498266', NULL, 1, 1446173756143, NULL, NULL);
INSERT INTO customer VALUES (21, 'สุวภัทร', 'แก้วประกอบ', NULL, '0815428976', NULL, 1, 1446174370473, NULL, NULL);
INSERT INTO customer VALUES (23, 'ณัฐนิชร์', 'นพรัตนวกิจ', NULL, '0898733155', NULL, 1, 1446174464306, NULL, NULL);
INSERT INTO customer VALUES (24, 'ณีรณุช', 'จิรพันธ์ุ', NULL, '0869137125', NULL, 1, 1446174526170, NULL, NULL);
INSERT INTO customer VALUES (25, 'สิรญา', 'ศรีโภคา', NULL, '0815983022', NULL, 1, 1446174633214, NULL, NULL);
INSERT INTO customer VALUES (26, 'ประยุธ', 'ชลสุวรรณ', NULL, '0814784506', NULL, 1, 1446174683329, NULL, NULL);
INSERT INTO customer VALUES (30, 'ประคอง', 'เจนอนุศาสตร์', NULL, '0831839890', NULL, 1, 1446175847732, NULL, NULL);
INSERT INTO customer VALUES (31, 'จุฬาลักษณ์', 'ยางทอง', NULL, '0869657016', NULL, 1, 1446175906564, NULL, NULL);
INSERT INTO customer VALUES (32, 'พีรณัฐ', 'ฟูพงศ์ศิริพันธ์', NULL, '0972511267', NULL, 1, 1446175963702, NULL, NULL);
INSERT INTO customer VALUES (33, 'พรรณิพา - รัชนี', 'มีบุญ', NULL, '.0899753323', NULL, 1, 1446176030610, NULL, NULL);
INSERT INTO customer VALUES (36, 'ชัญญรัช', 'หังสพฤก', NULL, '0897764721', NULL, 1, 1449224713585, NULL, NULL);
INSERT INTO customer VALUES (37, 'สุวัฒชัย', 'หมัดสมัน', NULL, NULL, NULL, 1, 1451547938943, NULL, NULL);
INSERT INTO customer VALUES (13, 'นิลวรรณ', 'ฟูเฟื่องสิน', NULL, '0850778600', NULL, 1, 1446172580971, 1, 1453902247262);
INSERT INTO customer VALUES (39, 'แวหามะ', 'ประดู่', NULL, NULL, NULL, 1, 1478421761916, NULL, NULL);
INSERT INTO customer VALUES (22, 'ณนณ', 'สุวรรณมณี', NULL, NULL, NULL, 1, 1446174399489, 1, 1480063635151);
INSERT INTO customer VALUES (40, 'ยินดี', 'มณีมัย', NULL, NULL, NULL, 1, 1482457007398, NULL, NULL);
INSERT INTO customer VALUES (41, 'วัลภา', 'คำแสนโต', '55ซอย4 ถ.หลังวัดเมือง อ.เมืองจ.ยะลา', '0812766393', 'จ่ายสด950000', 1, 1484364181349, NULL, NULL);
INSERT INTO customer VALUES (42, 'นส.กันต์กมน', 'นวลแก้ว', '71 ต.หาดใหญ่ อ.หาดใหญ่ จ.สงขลา', NULL, NULL, 1, 1484480688045, NULL, NULL);


SELECT pg_catalog.setval('customer_id_seq', 42, true);


INSERT INTO land VALUES (1, 'บีพี พร็อพเพอร์ตี้', 'ต.ท่าช้าง อ.บางกล่ำ จ.สงขลา', NULL, 42, 3, 61, 1, 1446170302937, NULL, NULL);
INSERT INTO land VALUES (2, 'บีพี พร็อพเพอร์ตี้ เฟส 2', 'ต.ท่าช้าง อ.บางกล่ำ จ.สงขลา', NULL, 28, 0, 0, 1, 1478421602675, NULL, NULL);



INSERT INTO land_buy_detail (id, land_id, customer_id, buy_type, buy_price, annual_interest, installment_months, rai, yarn, tarangwa, description, created_by, created_time, updated_by, updated_time) VALUES (1, 1, 1, 'C', 625000, NULL, NULL, 0, 0, 125, NULL, 1, 1446183913864, NULL, NULL);
INSERT INTO land_buy_detail (id, land_id, customer_id, buy_type, buy_price, annual_interest, installment_months, rai, yarn, tarangwa, description, created_by, created_time, updated_by, updated_time) VALUES (2, 1, 2, 'C', 725000, NULL, NULL, 0, 0, 145, NULL, 1, 1446185470514, NULL, NULL);
INSERT INTO land_buy_detail (id, land_id, customer_id, buy_type, buy_price, annual_interest, installment_months, rai, yarn, tarangwa, description, created_by, created_time, updated_by, updated_time) VALUES (3, 1, 3, 'C', 1110000, NULL, NULL, 0, 0, 222, NULL, 1, 1446185527910, NULL, NULL);
INSERT INTO land_buy_detail (id, land_id, customer_id, buy_type, buy_price, annual_interest, installment_months, rai, yarn, tarangwa, description, created_by, created_time, updated_by, updated_time) VALUES (4, 1, 4, 'I', 370000, NULL, NULL, 0, 0, 74, NULL, 1, 1446185636459, NULL, NULL);
INSERT INTO land_buy_detail (id, land_id, customer_id, buy_type, buy_price, annual_interest, installment_months, rai, yarn, tarangwa, description, created_by, created_time, updated_by, updated_time) VALUES (5, 1, 5, 'I', 125000, NULL, NULL, 0, 0, 25, NULL, 1, 1446185674942, NULL, NULL);
INSERT INTO land_buy_detail (id, land_id, customer_id, buy_type, buy_price, annual_interest, installment_months, rai, yarn, tarangwa, description, created_by, created_time, updated_by, updated_time) VALUES (6, 1, 6, 'I', 125000, NULL, NULL, 0, 0, 25, NULL, 1, 1446185713723, NULL, NULL);
INSERT INTO land_buy_detail (id, land_id, customer_id, buy_type, buy_price, annual_interest, installment_months, rai, yarn, tarangwa, description, created_by, created_time, updated_by, updated_time) VALUES (7, 1, 7, 'I', 250000, NULL, NULL, 0, 0, 50, NULL, 1, 1446185760650, NULL, NULL);
INSERT INTO land_buy_detail (id, land_id, customer_id, buy_type, buy_price, annual_interest, installment_months, rai, yarn, tarangwa, description, created_by, created_time, updated_by, updated_time) VALUES (8, 1, 8, 'C', 650000, NULL, NULL, 0, 0, 130, NULL, 1, 1446186366220, NULL, NULL);
INSERT INTO land_buy_detail (id, land_id, customer_id, buy_type, buy_price, annual_interest, installment_months, rai, yarn, tarangwa, description, created_by, created_time, updated_by, updated_time) VALUES (9, 1, 9, 'I', 250000, NULL, NULL, 0, 0, 50, NULL, 1, 1446186412818, NULL, NULL);
INSERT INTO land_buy_detail (id, land_id, customer_id, buy_type, buy_price, annual_interest, installment_months, rai, yarn, tarangwa, description, created_by, created_time, updated_by, updated_time) VALUES (10, 1, 10, 'I', 125000, NULL, NULL, 0, 0, 25, NULL, 1, 1446186449970, NULL, NULL);
INSERT INTO land_buy_detail (id, land_id, customer_id, buy_type, buy_price, annual_interest, installment_months, rai, yarn, tarangwa, description, created_by, created_time, updated_by, updated_time) VALUES (11, 1, 11, 'I', 125000, NULL, NULL, 0, 0, 25, NULL, 1, 1446186507338, NULL, NULL);
INSERT INTO land_buy_detail (id, land_id, customer_id, buy_type, buy_price, annual_interest, installment_months, rai, yarn, tarangwa, description, created_by, created_time, updated_by, updated_time) VALUES (12, 1, 1, 'I', 790000, NULL, NULL, 0, 0, 158, NULL, 1, 1446186602496, NULL, NULL);
INSERT INTO land_buy_detail (id, land_id, customer_id, buy_type, buy_price, annual_interest, installment_months, rai, yarn, tarangwa, description, created_by, created_time, updated_by, updated_time) VALUES (13, 1, 13, 'I', 600000, NULL, NULL, 0, 0, 100, NULL, 1, 1446186645238, NULL, NULL);
INSERT INTO land_buy_detail (id, land_id, customer_id, buy_type, buy_price, annual_interest, installment_months, rai, yarn, tarangwa, description, created_by, created_time, updated_by, updated_time) VALUES (14, 1, 14, 'C', 500000, NULL, NULL, 0, 0, 100, NULL, 1, 1446186707078, 1, 1446186711511);
INSERT INTO land_buy_detail (id, land_id, customer_id, buy_type, buy_price, annual_interest, installment_months, rai, yarn, tarangwa, description, created_by, created_time, updated_by, updated_time) VALUES (16, 1, 16, 'I', 250000, NULL, NULL, 0, 0, 50, NULL, 1, 1446186847825, NULL, NULL);
INSERT INTO land_buy_detail (id, land_id, customer_id, buy_type, buy_price, annual_interest, installment_months, rai, yarn, tarangwa, description, created_by, created_time, updated_by, updated_time) VALUES (18, 1, 18, 'C', 2390000, NULL, NULL, 0, 3, 70, NULL, 1, 1446188280978, NULL, NULL);
INSERT INTO land_buy_detail (id, land_id, customer_id, buy_type, buy_price, annual_interest, installment_months, rai, yarn, tarangwa, description, created_by, created_time, updated_by, updated_time) VALUES (20, 1, 21, 'I', 500000, NULL, NULL, 0, 0, 100, NULL, 1, 1446188397497, NULL, NULL);
INSERT INTO land_buy_detail (id, land_id, customer_id, buy_type, buy_price, annual_interest, installment_months, rai, yarn, tarangwa, description, created_by, created_time, updated_by, updated_time) VALUES (22, 1, 23, 'C', 250000, NULL, NULL, 0, 0, 50, NULL, 1, 1446188496453, NULL, NULL);
INSERT INTO land_buy_detail (id, land_id, customer_id, buy_type, buy_price, annual_interest, installment_months, rai, yarn, tarangwa, description, created_by, created_time, updated_by, updated_time) VALUES (23, 1, 24, 'C', 500000, NULL, NULL, 0, 0, 100, NULL, 1, 1446188541154, NULL, NULL);
INSERT INTO land_buy_detail (id, land_id, customer_id, buy_type, buy_price, annual_interest, installment_months, rai, yarn, tarangwa, description, created_by, created_time, updated_by, updated_time) VALUES (24, 1, 25, 'I', 2460000, NULL, NULL, 0, 2, 5, NULL, 1, 1446188620341, NULL, NULL);
INSERT INTO land_buy_detail (id, land_id, customer_id, buy_type, buy_price, annual_interest, installment_months, rai, yarn, tarangwa, description, created_by, created_time, updated_by, updated_time) VALUES (25, 1, 26, 'I', 1260000, NULL, NULL, 0, 1, 80, NULL, 1, 1446188789628, NULL, NULL);
INSERT INTO land_buy_detail (id, land_id, customer_id, buy_type, buy_price, annual_interest, installment_months, rai, yarn, tarangwa, description, created_by, created_time, updated_by, updated_time) VALUES (27, 1, 31, 'C', 750000, NULL, NULL, 0, 1, 50, NULL, 1, 1446189027856, NULL, NULL);
INSERT INTO land_buy_detail (id, land_id, customer_id, buy_type, buy_price, annual_interest, installment_months, rai, yarn, tarangwa, description, created_by, created_time, updated_by, updated_time) VALUES (29, 1, 33, 'I', 250000, NULL, NULL, 0, 0, 50, NULL, 1, 1446189342805, NULL, NULL);
INSERT INTO land_buy_detail (id, land_id, customer_id, buy_type, buy_price, annual_interest, installment_months, rai, yarn, tarangwa, description, created_by, created_time, updated_by, updated_time) VALUES (30, 1, 21, 'I', 250000, NULL, NULL, 0, 0, 50, NULL, 1, 1446194664429, NULL, NULL);
INSERT INTO land_buy_detail (id, land_id, customer_id, buy_type, buy_price, annual_interest, installment_months, rai, yarn, tarangwa, description, created_by, created_time, updated_by, updated_time) VALUES (31, 1, 14, 'I', 250000, NULL, NULL, 0, 0, 50, NULL, 1, 1446194882499, NULL, NULL);
INSERT INTO land_buy_detail (id, land_id, customer_id, buy_type, buy_price, annual_interest, installment_months, rai, yarn, tarangwa, description, created_by, created_time, updated_by, updated_time) VALUES (32, 1, 14, 'I', 250000, NULL, NULL, 0, 0, 50, NULL, 1, 1446194973407, NULL, NULL);
INSERT INTO land_buy_detail (id, land_id, customer_id, buy_type, buy_price, annual_interest, installment_months, rai, yarn, tarangwa, description, created_by, created_time, updated_by, updated_time) VALUES (33, 1, 15, 'C', 250000, NULL, NULL, 0, 0, 50, NULL, 1, 1448347486422, 1, 1448347501857);
INSERT INTO land_buy_detail (id, land_id, customer_id, buy_type, buy_price, annual_interest, installment_months, rai, yarn, tarangwa, description, created_by, created_time, updated_by, updated_time) VALUES (26, 1, 30, 'I', 581600, 8, 3, 0, 0, 100, 'ผ่อนทุกเดือนเดือนละ10000 บาทเป็นเวลา 45 เดือน เริ่มจาก 15 เมษายน  2559  - 15มกราคม  2563', 1, 1446188934124, 1, 1461653916844);
INSERT INTO land_buy_detail (id, land_id, customer_id, buy_type, buy_price, annual_interest, installment_months, rai, yarn, tarangwa, description, created_by, created_time, updated_by, updated_time) VALUES (17, 1, 17, 'I', 1470000, NULL, NULL, 0, 0, 210, NULL, 1, 1446186965091, 1, 1451544520237);
INSERT INTO land_buy_detail (id, land_id, customer_id, buy_type, buy_price, annual_interest, installment_months, rai, yarn, tarangwa, description, created_by, created_time, updated_by, updated_time) VALUES (36, 1, 36, 'I', 250000, NULL, NULL, 0, 0, 50, NULL, 1, 1451548211982, NULL, NULL);
INSERT INTO land_buy_detail (id, land_id, customer_id, buy_type, buy_price, annual_interest, installment_months, rai, yarn, tarangwa, description, created_by, created_time, updated_by, updated_time) VALUES (37, 1, 13, 'I', 688000, NULL, NULL, 0, 0, 86, NULL, 1, 1453902139403, NULL, NULL);
INSERT INTO land_buy_detail (id, land_id, customer_id, buy_type, buy_price, annual_interest, installment_months, rai, yarn, tarangwa, description, created_by, created_time, updated_by, updated_time) VALUES (28, 1, 32, 'I', 290320, 8, 3, 0, 0, 50, 'ยอดซื้อ 250000 บาท ดาวน์ 82000 บาท ผ่อน 168000 บาท อัตราดอกเบี้ย 8 %/ปีเริ่มคิดดอกเบี้ย 4/2559', 1, 1446189172568, 1, 1464342800728);
INSERT INTO land_buy_detail (id, land_id, customer_id, buy_type, buy_price, annual_interest, installment_months, rai, yarn, tarangwa, description, created_by, created_time, updated_by, updated_time) VALUES (19, 1, 19, 'I', 370000, 8, 4, 0, 0, 50, 'เริ่มผ่อนเดือนมิถุนายน2559', 1, 1446188334274, 1, 1465361323287);
INSERT INTO land_buy_detail (id, land_id, customer_id, buy_type, buy_price, annual_interest, installment_months, rai, yarn, tarangwa, description, created_by, created_time, updated_by, updated_time) VALUES (38, 2, 39, 'C', 950000, NULL, NULL, 1, 0, 0, NULL, 1, 1478421850699, NULL, NULL);
INSERT INTO land_buy_detail (id, land_id, customer_id, buy_type, buy_price, annual_interest, installment_months, rai, yarn, tarangwa, description, created_by, created_time, updated_by, updated_time) VALUES (39, 2, 40, 'I', 900000, 8, 5, 1, 0, 0, NULL, 1, 1482542498474, NULL, NULL);
INSERT INTO land_buy_detail (id, land_id, customer_id, buy_type, buy_price, annual_interest, installment_months, rai, yarn, tarangwa, description, created_by, created_time, updated_by, updated_time) VALUES (40, 2, 41, 'C', 950000, NULL, NULL, 1, 0, 0, NULL, 1, 1484364299345, NULL, NULL);
INSERT INTO land_buy_detail (id, land_id, customer_id, buy_type, buy_price, annual_interest, installment_months, rai, yarn, tarangwa, description, created_by, created_time, updated_by, updated_time) VALUES (21, 1, 22, 'I', 290800, 8, NULL, 0, 0, 50, NULL, 1, 1446188456817, 1, 1461584713883);
INSERT INTO land_buy_detail (id, land_id, customer_id, buy_type, buy_price, annual_interest, installment_months, rai, yarn, tarangwa, description, created_by, created_time, updated_by, updated_time) VALUES (41, 2, 42, 'I', 938800, 8, 3, 1, 0, 0, NULL, 1, 1484480902769, 1, 1486609368812);


SELECT pg_catalog.setval('land_buy_detail_id_seq', 41, true);


SELECT pg_catalog.setval('land_id_seq', 2, true);



INSERT INTO payment VALUES (2, 1, NULL, 625000, NULL, 1, 1451485939661, NULL, NULL, false);
INSERT INTO payment VALUES (3, 2, NULL, 725000, NULL, 1, 1451485995058, NULL, NULL, false);
INSERT INTO payment VALUES (4, 3, NULL, 1110000, NULL, 1, 1451486038852, 1, 1451486064350, false);
INSERT INTO payment VALUES (6, 5, 1448902800000, 95000, NULL, 1, 1451486142522, NULL, NULL, false);
INSERT INTO payment VALUES (7, 6, 1427821200000, 30000, NULL, 1, 1451486202859, NULL, NULL, false);
INSERT INTO payment VALUES (8, 6, 1448902800000, 95000, NULL, 1, 1451486216995, NULL, NULL, false);
INSERT INTO payment VALUES (9, 7, 1427821200000, 60000, NULL, 1, 1451486240762, NULL, NULL, false);
INSERT INTO payment VALUES (10, 7, 1448902800000, 190000, NULL, 1, 1451486250327, NULL, NULL, false);
INSERT INTO payment VALUES (11, 8, NULL, 650000, NULL, 1, 1451486272875, NULL, NULL, false);
INSERT INTO payment VALUES (12, 9, 1427821200000, 60000, NULL, 1, 1451486292742, NULL, NULL, false);
INSERT INTO payment VALUES (13, 9, 1448902800000, 190000, NULL, 1, 1451486300719, NULL, NULL, false);
INSERT INTO payment VALUES (14, 10, 1427821200000, 30000, NULL, 1, 1451486329148, 1, 1451486349421, false);
INSERT INTO payment VALUES (15, 10, 1448902800000, 95000, NULL, 1, 1451486357820, NULL, NULL, false);
INSERT INTO payment VALUES (16, 11, 1427821200000, 30000, NULL, 1, 1451486398438, NULL, NULL, false);
INSERT INTO payment VALUES (17, 11, 1448902800000, 95000, NULL, 1, 1451486407623, NULL, NULL, false);
INSERT INTO payment VALUES (18, 12, 1448902800000, 645000, NULL, 1, 1451486491440, NULL, NULL, false);
INSERT INTO payment VALUES (19, 13, 1441040400000, 300000, NULL, 1, 1451486552842, NULL, NULL, false);
INSERT INTO payment VALUES (20, 13, 1448902800000, 300000, NULL, 1, 1451486563664, NULL, NULL, false);
INSERT INTO payment VALUES (21, 14, NULL, 500000, NULL, 1, 1451486643161, NULL, NULL, false);
INSERT INTO payment VALUES (22, 16, 1441040400000, 73000, NULL, 1, 1451486694467, NULL, NULL, false);
INSERT INTO payment VALUES (23, 16, 1448902800000, 177000, NULL, 1, 1451486702363, NULL, NULL, false);
INSERT INTO payment VALUES (24, 17, 1448902800000, 1297000, NULL, 1, 1451544639262, NULL, NULL, false);
INSERT INTO payment VALUES (25, 26, 1446310800000, 120000, NULL, 1, 1451544854774, NULL, NULL, false);
INSERT INTO payment VALUES (27, 27, NULL, 750000, NULL, 1, 1451545281852, NULL, NULL, false);
INSERT INTO payment VALUES (28, 25, 1441040400000, 1038000, NULL, 1, 1451545399586, NULL, NULL, false);
INSERT INTO payment VALUES (29, 25, 1448902800000, 90000, NULL, 1, 1451545410529, NULL, NULL, false);
INSERT INTO payment VALUES (30, 28, 1446310800000, 52000, NULL, 1, 1451545446390, NULL, NULL, false);
INSERT INTO payment VALUES (31, 28, 1448902800000, 18000, NULL, 1, 1451545486861, NULL, NULL, false);
INSERT INTO payment VALUES (32, 29, 1446310800000, 113000, NULL, 1, 1451545586031, 1, 1451545764442, false);
INSERT INTO payment VALUES (33, 29, 1448902800000, 8000, NULL, 1, 1451545772493, NULL, NULL, false);
INSERT INTO payment VALUES (34, 30, 1427821200000, 25000, NULL, 1, 1451545851548, NULL, NULL, false);
INSERT INTO payment VALUES (35, 30, 1448902800000, 225000, NULL, 1, 1451545860756, NULL, NULL, false);
INSERT INTO payment VALUES (36, 31, 1427821200000, 25000, NULL, 1, 1451545891776, NULL, NULL, false);
INSERT INTO payment VALUES (37, 31, 1448902800000, 225000, NULL, 1, 1451545901796, NULL, NULL, false);
INSERT INTO payment VALUES (38, 32, 1427821200000, 25000, NULL, 1, 1451545923366, NULL, NULL, false);
INSERT INTO payment VALUES (39, 32, 1448902800000, 225000, NULL, 1, 1451545930486, NULL, NULL, false);
INSERT INTO payment VALUES (40, 33, NULL, 250000, NULL, 1, 1451545959681, NULL, NULL, false);
INSERT INTO payment VALUES (44, 4, 1451581200000, 80000, NULL, 1, 1451884628570, 1, 1451936101894, false);
INSERT INTO payment VALUES (45, 28, 1451581200000, 6000, NULL, 1, 1451975392633, NULL, NULL, false);
INSERT INTO payment VALUES (46, 12, 1451581200000, 30000, NULL, 1, 1452075664648, NULL, NULL, false);
INSERT INTO payment VALUES (1, 4, 1441040400000, 204000, NULL, 1, 1451459998800, 1, 1452420951475, true);
INSERT INTO payment VALUES (5, 5, 1427821200000, 30000, NULL, 1, 1451486123318, 1, 1452421059538, true);
INSERT INTO payment VALUES (47, 29, 1451581200000, 129000, NULL, 1, 1453178491494, NULL, NULL, false);
INSERT INTO payment VALUES (48, 37, 1451581200000, 60000, NULL, 1, 1453902156707, NULL, NULL, true);
INSERT INTO payment VALUES (49, 26, 1451581200000, 10000, NULL, 1, 1454131426453, NULL, NULL, false);
INSERT INTO payment VALUES (50, 17, 1451581200000, 46000, NULL, 1, 1455678400585, NULL, NULL, false);
INSERT INTO payment VALUES (51, 4, 1454259600000, 46000, NULL, 1, 1456298282464, NULL, NULL, false);
INSERT INTO payment VALUES (52, 26, 1454259600000, 10000, NULL, 1, 1457325491861, NULL, NULL, false);
INSERT INTO payment VALUES (26, 26, 1448902800000, 10000, NULL, 1, 1451544883889, 1, 1457325737899, false);
INSERT INTO payment VALUES (53, 26, 1456765200000, 10000, NULL, 1, 1459151320972, NULL, NULL, false);
INSERT INTO payment VALUES (54, 28, 1454259600000, 6000, NULL, 1, 1459153665744, NULL, NULL, false);
INSERT INTO payment VALUES (55, 26, 1459443600000, 10000, NULL, 1, 1461550721431, NULL, NULL, false);
INSERT INTO payment VALUES (56, 21, 1451581200000, 65000, NULL, 1, 1461584423200, NULL, NULL, false);
INSERT INTO payment VALUES (57, 21, 1454259600000, 5000, NULL, 1, 1461584451693, NULL, NULL, false);
INSERT INTO payment VALUES (58, 21, 1456765200000, 5000, NULL, 1, 1461584466474, NULL, NULL, false);
INSERT INTO payment VALUES (59, 21, 1459443600000, 5000, NULL, 1, 1461584478580, NULL, NULL, false);
INSERT INTO payment VALUES (61, 4, 1462035600000, 40000, NULL, 1, 1462875158440, NULL, NULL, false);
INSERT INTO payment VALUES (62, 28, 1462035600000, 6000, NULL, 1, 1464342821902, NULL, NULL, false);
INSERT INTO payment VALUES (63, 21, 1462035600000, 6000, NULL, 1, 1464342988570, NULL, NULL, false);
INSERT INTO payment VALUES (64, 26, 1462035600000, 10000, NULL, 1, 1464343093144, NULL, NULL, false);
INSERT INTO payment VALUES (65, 28, 1464714000000, 6000, NULL, 1, 1464838377667, NULL, NULL, false);
INSERT INTO payment VALUES (66, 19, 1464714000000, 80000, NULL, 1, 1465361356485, NULL, NULL, true);
INSERT INTO payment VALUES (67, 37, 1464714000000, 628000, NULL, 1, 1466042546323, NULL, NULL, false);
INSERT INTO payment VALUES (68, 12, 1464714000000, 115000, NULL, 1, 1466042714437, NULL, NULL, false);
INSERT INTO payment VALUES (69, 17, 1464714000000, 127000, NULL, 1, 1466042764856, NULL, NULL, false);
INSERT INTO payment VALUES (70, 18, NULL, 2390000, NULL, 1, 1466042827110, NULL, NULL, false);
INSERT INTO payment VALUES (71, 19, 1464714000000, 6000, NULL, 1, 1466042888535, NULL, NULL, false);
INSERT INTO payment VALUES (72, 20, 1464714000000, 50000, NULL, 1, 1466043062041, NULL, NULL, true);
INSERT INTO payment VALUES (73, 22, NULL, 250000, NULL, 1, 1466043157919, NULL, NULL, false);
INSERT INTO payment VALUES (74, 23, NULL, 500000, NULL, 1, 1466043189513, NULL, NULL, false);
INSERT INTO payment VALUES (75, 25, 1464714000000, 132000, NULL, 1, 1466043259196, NULL, NULL, false);
INSERT INTO payment VALUES (76, 36, 1464714000000, 250000, NULL, 1, 1466043446026, NULL, NULL, false);
INSERT INTO payment VALUES (77, 26, 1464714000000, 10000, NULL, 1, 1467028896227, NULL, NULL, false);
INSERT INTO payment VALUES (78, 21, 1464714000000, 6000, NULL, 1, 1467028993716, 1, 1467029210511, false);
INSERT INTO payment VALUES (79, 28, 1467306000000, 6000, NULL, 1, 1469243697880, NULL, NULL, false);
INSERT INTO payment VALUES (80, 19, 1467306000000, 6000, NULL, 1, 1469243827420, NULL, NULL, false);
INSERT INTO payment VALUES (81, 21, 1467306000000, 6000, NULL, 1, 1469682806286, NULL, NULL, false);
INSERT INTO payment VALUES (82, 28, 1469984400000, 6000, NULL, 1, 1471600844131, NULL, NULL, false);
INSERT INTO payment VALUES (84, 21, 1469984400000, 6000, NULL, 1, 1472104846169, NULL, NULL, false);
INSERT INTO payment VALUES (83, 26, 1467306000000, 10000, NULL, 1, 1472104778459, 1, 1472104902944, false);
INSERT INTO payment VALUES (85, 26, 1469984400000, 10000, NULL, 1, 1472206619254, NULL, NULL, false);
INSERT INTO payment VALUES (86, 19, 1469984400000, 6000, NULL, 1, 1473580884995, NULL, NULL, false);
INSERT INTO payment VALUES (87, 28, 1472662800000, 6000, NULL, 1, 1473580990622, NULL, NULL, false);
INSERT INTO payment VALUES (88, 21, 1472662800000, 6000, NULL, 1, 1475036146199, NULL, NULL, false);
INSERT INTO payment VALUES (89, 26, 1472662800000, 10000, NULL, 1, 1475036267416, NULL, NULL, false);
INSERT INTO payment VALUES (93, 28, 1475254800000, 6000, NULL, 1, 1476080311195, NULL, NULL, false);
INSERT INTO payment VALUES (94, 19, 1472662800000, 6000, NULL, 1, 1477128310107, NULL, NULL, false);
INSERT INTO payment VALUES (95, 21, 1475254800000, 6000, NULL, 1, 1477648186883, NULL, NULL, false);
INSERT INTO payment VALUES (96, 28, 1477933200000, 6000, '', 1, 1478420307172, NULL, NULL, false);
INSERT INTO payment VALUES (97, 38, NULL, 10000, NULL, 1, 1478421865407, NULL, NULL, true);
INSERT INTO payment VALUES (98, 26, 1475254800000, 10000, NULL, 1, 1478686078234, NULL, NULL, false);
INSERT INTO payment VALUES (99, 21, 1477933200000, 6000, NULL, 1, 1480055195260, NULL, NULL, false);
INSERT INTO payment VALUES (100, 26, 1477933200000, 10000, NULL, 1, 1480559418560, NULL, NULL, false);
INSERT INTO payment VALUES (101, 19, 1475254800000, 6000, NULL, 1, 1481016767818, NULL, NULL, false);
INSERT INTO payment VALUES (102, 28, 1480525200000, 6000, NULL, 1, 1481542018952, NULL, NULL, false);
INSERT INTO payment VALUES (103, 38, NULL, 50000, NULL, 1, 1481542097300, NULL, NULL, false);
INSERT INTO payment VALUES (104, 39, 1480525200000, 280000, NULL, 1, 1482542630376, NULL, NULL, true);
INSERT INTO payment VALUES (105, 21, 1480525200000, 6000, NULL, 1, 1482574655394, NULL, NULL, false);
INSERT INTO payment VALUES (106, 26, 1480525200000, 10000, NULL, 1, 1483493436753, NULL, NULL, false);
INSERT INTO payment VALUES (107, 28, 1483203600000, 6000, NULL, 1, 1483493730652, NULL, NULL, false);
INSERT INTO payment VALUES (108, 19, 1477933200000, 6000, NULL, 1, 1483586287954, NULL, NULL, false);
INSERT INTO payment VALUES (109, 40, NULL, 20000, NULL, 1, 1484364397001, NULL, NULL, true);
INSERT INTO payment VALUES (110, 40, NULL, 930000, NULL, 1, 1484364415846, NULL, NULL, false);
INSERT INTO payment VALUES (113, 21, 1483203600000, 6000, NULL, 1, 1485345818752, NULL, NULL, false);
INSERT INTO payment VALUES (114, 28, 1485882000000, 6000, NULL, 1, 1486088926882, NULL, NULL, false);
INSERT INTO payment VALUES (115, 26, 1483203600000, 10000, NULL, 1, 1486088962670, NULL, NULL, false);
INSERT INTO payment VALUES (111, 41, 1480525200000, 480000, NULL, 1, 1484480965402, 1, 1486608961523, true);
INSERT INTO payment VALUES (112, 41, 1483203600000, 0, NULL, 1, 1484480985549, 1, 1486608987495, false);
INSERT INTO payment VALUES (116, 41, 1485882000000, 15000, NULL, 1, 1486609176949, NULL, NULL, false);


SELECT pg_catalog.setval('payment_id_seq', 116, true);



INSERT INTO user_login VALUES (1, 'admin', 'admin', 0, 0, NULL, NULL);



SELECT pg_catalog.setval('user_login_id_seq', 1, true);