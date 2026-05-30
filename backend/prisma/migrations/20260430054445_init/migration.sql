-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(36) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `role` VARCHAR(50) NOT NULL DEFAULT 'GUEST_NEW',
    `firstName` VARCHAR(100) NOT NULL,
    `lastName` VARCHAR(100) NOT NULL,
    `phone` VARCHAR(25) NULL,
    `idNumber` VARCHAR(50) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    UNIQUE INDEX `users_idNumber_key`(`idNumber`),
    INDEX `users_email_idx`(`email`),
    INDEX `users_role_idx`(`role`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `guest_profiles` (
    `id` VARCHAR(36) NOT NULL,
    `userId` VARCHAR(36) NOT NULL,
    `isFirstVisit` BOOLEAN NOT NULL DEFAULT true,
    `totalStays` INTEGER NOT NULL DEFAULT 0,
    `totalSpent` DOUBLE NOT NULL DEFAULT 0,
    `discountRate` DOUBLE NOT NULL DEFAULT 0,
    `preferences` TEXT NULL,
    `specialNeeds` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `guest_profiles_userId_key`(`userId`),
    INDEX `guest_profiles_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `staff_profiles` (
    `id` VARCHAR(36) NOT NULL,
    `userId` VARCHAR(36) NOT NULL,
    `department` VARCHAR(100) NOT NULL,
    `position` VARCHAR(100) NOT NULL,
    `hireDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `salary` DOUBLE NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `staff_profiles_userId_key`(`userId`),
    INDEX `staff_profiles_userId_idx`(`userId`),
    INDEX `staff_profiles_department_idx`(`department`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `floors` (
    `id` VARCHAR(36) NOT NULL,
    `floorNumber` INTEGER NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `image` VARCHAR(500) NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `floors_floorNumber_key`(`floorNumber`),
    INDEX `floors_floorNumber_idx`(`floorNumber`),
    INDEX `floors_order_idx`(`order`),
    INDEX `floors_isActive_idx`(`isActive`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `features` (
    `id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `icon` VARCHAR(100) NULL,
    `image` VARCHAR(500) NULL,
    `category` VARCHAR(50) NOT NULL DEFAULT 'room',
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `order` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `features_name_key`(`name`),
    INDEX `features_category_idx`(`category`),
    INDEX `features_order_idx`(`order`),
    INDEX `features_isActive_idx`(`isActive`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rooms` (
    `id` VARCHAR(36) NOT NULL,
    `roomNumber` VARCHAR(20) NOT NULL,
    `floor` INTEGER NOT NULL,
    `floorId` VARCHAR(36) NULL,
    `section` VARCHAR(50) NOT NULL DEFAULT 'A',
    `type` VARCHAR(50) NOT NULL DEFAULT 'STANDARD',
    `status` VARCHAR(50) NOT NULL DEFAULT 'AVAILABLE',
    `capacity` INTEGER NOT NULL,
    `size` DOUBLE NULL,
    `basePrice` DOUBLE NOT NULL,
    `currentPrice` DOUBLE NOT NULL,
    `features` LONGTEXT NOT NULL DEFAULT ('[]'),
    `amenities` LONGTEXT NOT NULL DEFAULT ('[]'),
    `images` TEXT NULL,
    `description` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `rooms_roomNumber_key`(`roomNumber`),
    INDEX `rooms_status_idx`(`status`),
    INDEX `rooms_floor_idx`(`floor`),
    INDEX `rooms_floorId_idx`(`floorId`),
    INDEX `rooms_type_idx`(`type`),
    INDEX `rooms_roomNumber_idx`(`roomNumber`),
    INDEX `rooms_currentPrice_idx`(`currentPrice`),
    INDEX `rooms_capacity_idx`(`capacity`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bookings` (
    `id` VARCHAR(36) NOT NULL,
    `bookingNumber` VARCHAR(50) NOT NULL,
    `userId` VARCHAR(36) NOT NULL,
    `roomId` VARCHAR(36) NOT NULL,
    `checkInDate` DATETIME(3) NOT NULL,
    `checkOutDate` DATETIME(3) NOT NULL,
    `numberOfGuests` INTEGER NOT NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    `totalPrice` DOUBLE NOT NULL,
    `discountApplied` DOUBLE NOT NULL DEFAULT 0,
    `finalPrice` DOUBLE NOT NULL,
    `specialRequests` TEXT NULL,
    `guestPreferences` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `bookings_bookingNumber_key`(`bookingNumber`),
    INDEX `bookings_userId_idx`(`userId`),
    INDEX `bookings_roomId_idx`(`roomId`),
    INDEX `bookings_status_idx`(`status`),
    INDEX `bookings_bookingNumber_idx`(`bookingNumber`),
    INDEX `bookings_checkInDate_idx`(`checkInDate`),
    INDEX `bookings_checkOutDate_idx`(`checkOutDate`),
    INDEX `bookings_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chat_sessions` (
    `id` VARCHAR(36) NOT NULL,
    `guestId` VARCHAR(36) NOT NULL,
    `staffId` VARCHAR(36) NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'active',
    `guestData` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `chat_sessions_guestId_idx`(`guestId`),
    INDEX `chat_sessions_staffId_idx`(`staffId`),
    INDEX `chat_sessions_status_idx`(`status`),
    INDEX `chat_sessions_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chat_messages` (
    `id` VARCHAR(36) NOT NULL,
    `sessionId` VARCHAR(36) NOT NULL,
    `senderId` VARCHAR(36) NOT NULL,
    `message` TEXT NOT NULL,
    `messageType` VARCHAR(50) NOT NULL DEFAULT 'text',
    `metadata` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `chat_messages_sessionId_idx`(`sessionId`),
    INDEX `chat_messages_senderId_idx`(`senderId`),
    INDEX `chat_messages_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `parking_spots` (
    `id` VARCHAR(36) NOT NULL,
    `spotNumber` VARCHAR(20) NOT NULL,
    `floor` INTEGER NOT NULL,
    `floorId` VARCHAR(36) NULL,
    `type` VARCHAR(50) NOT NULL DEFAULT 'STANDARD',
    `status` VARCHAR(50) NOT NULL DEFAULT 'AVAILABLE',
    `description` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `parking_spots_spotNumber_key`(`spotNumber`),
    INDEX `parking_spots_floor_idx`(`floor`),
    INDEX `parking_spots_status_idx`(`status`),
    INDEX `parking_spots_type_idx`(`type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `parking_reservations` (
    `id` VARCHAR(36) NOT NULL,
    `reservationNumber` VARCHAR(50) NOT NULL,
    `userId` VARCHAR(36) NULL,
    `roomBookingId` VARCHAR(36) NULL,
    `guestName` VARCHAR(191) NOT NULL,
    `guestEmail` VARCHAR(191) NOT NULL,
    `spotNumber` VARCHAR(20) NOT NULL,
    `parkingType` VARCHAR(50) NOT NULL DEFAULT 'self',
    `reservationDate` DATETIME(3) NOT NULL,
    `startTime` VARCHAR(50) NULL,
    `endTime` VARCHAR(50) NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'CONFIRMED',
    `price` DOUBLE NOT NULL DEFAULT 0,
    `notes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `parking_reservations_reservationNumber_key`(`reservationNumber`),
    INDEX `parking_reservations_userId_idx`(`userId`),
    INDEX `parking_reservations_roomBookingId_idx`(`roomBookingId`),
    INDEX `parking_reservations_guestEmail_idx`(`guestEmail`),
    INDEX `parking_reservations_reservationDate_idx`(`reservationDate`),
    INDEX `parking_reservations_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `admins` (
    `id` VARCHAR(36) NOT NULL,
    `username` VARCHAR(100) NOT NULL DEFAULT 'admin',
    `passwordHash` VARCHAR(255) NOT NULL,
    `passwordHint` VARCHAR(255) NOT NULL DEFAULT 'amar',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `admins_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `food_items` (
    `id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `category` VARCHAR(100) NOT NULL,
    `price` DOUBLE NOT NULL,
    `image` VARCHAR(500) NULL,
    `isAvailable` BOOLEAN NOT NULL DEFAULT true,
    `order` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `food_items_category_idx`(`category`),
    INDEX `food_items_order_idx`(`order`),
    INDEX `food_items_isAvailable_idx`(`isAvailable`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `store_items` (
    `id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `nameAr` VARCHAR(255) NULL,
    `description` TEXT NULL,
    `category` VARCHAR(100) NOT NULL,
    `price` DOUBLE NOT NULL,
    `quantity` INTEGER NOT NULL DEFAULT 0,
    `image` VARCHAR(500) NULL,
    `isAvailable` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `store_items_category_idx`(`category`),
    INDEX `store_items_isAvailable_idx`(`isAvailable`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `orders` (
    `id` VARCHAR(36) NOT NULL,
    `orderNumber` VARCHAR(50) NOT NULL,
    `userId` VARCHAR(36) NULL,
    `roomBookingId` VARCHAR(36) NULL,
    `clientName` VARCHAR(191) NOT NULL,
    `roomNumber` VARCHAR(20) NOT NULL,
    `orderType` VARCHAR(50) NOT NULL DEFAULT 'MARKET',
    `status` VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    `totalPrice` DOUBLE NOT NULL,
    `notes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `orders_orderNumber_key`(`orderNumber`),
    INDEX `orders_status_idx`(`status`),
    INDEX `orders_roomNumber_idx`(`roomNumber`),
    INDEX `orders_userId_idx`(`userId`),
    INDEX `orders_roomBookingId_idx`(`roomBookingId`),
    INDEX `orders_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `order_items` (
    `id` VARCHAR(36) NOT NULL,
    `orderId` VARCHAR(36) NOT NULL,
    `itemId` VARCHAR(36) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `price` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `order_items_orderId_idx`(`orderId`),
    INDEX `order_items_itemId_idx`(`itemId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `concierge_sessions` (
    `id` VARCHAR(36) NOT NULL,
    `sessionToken` VARCHAR(100) NOT NULL,
    `language` VARCHAR(5) NOT NULL DEFAULT 'en',
    `totalMessages` INTEGER NOT NULL DEFAULT 0,
    `detectedGuests` INTEGER NULL,
    `detectedBudget` DOUBLE NULL,
    `detectedDuration` INTEGER NULL,
    `detectedPurpose` VARCHAR(50) NULL,
    `prefSpa` BOOLEAN NOT NULL DEFAULT false,
    `prefView` BOOLEAN NOT NULL DEFAULT false,
    `prefButler` BOOLEAN NOT NULL DEFAULT false,
    `prefQuiet` BOOLEAN NOT NULL DEFAULT false,
    `prefBalcony` BOOLEAN NOT NULL DEFAULT false,
    `prefPool` BOOLEAN NOT NULL DEFAULT false,
    `prefSuite` BOOLEAN NOT NULL DEFAULT false,
    `recommendedRoomId` VARCHAR(36) NULL,
    `recommendedRoomNum` VARCHAR(20) NULL,
    `recommendedRoomType` VARCHAR(50) NULL,
    `recommendedScore` INTEGER NULL,
    `recommendationShown` BOOLEAN NOT NULL DEFAULT false,
    `bookingInitiated` BOOLEAN NOT NULL DEFAULT false,
    `startedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `lastActiveAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `concierge_sessions_sessionToken_key`(`sessionToken`),
    INDEX `concierge_sessions_language_idx`(`language`),
    INDEX `concierge_sessions_detectedPurpose_idx`(`detectedPurpose`),
    INDEX `concierge_sessions_recommendedRoomType_idx`(`recommendedRoomType`),
    INDEX `concierge_sessions_bookingInitiated_idx`(`bookingInitiated`),
    INDEX `concierge_sessions_recommendationShown_idx`(`recommendationShown`),
    INDEX `concierge_sessions_startedAt_idx`(`startedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `concierge_events` (
    `id` VARCHAR(36) NOT NULL,
    `sessionId` VARCHAR(36) NOT NULL,
    `eventType` VARCHAR(50) NOT NULL,
    `eventData` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `concierge_events_sessionId_idx`(`sessionId`),
    INDEX `concierge_events_eventType_idx`(`eventType`),
    INDEX `concierge_events_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `service_bookings` (
    `id` VARCHAR(36) NOT NULL,
    `bookingNumber` VARCHAR(50) NOT NULL,
    `serviceType` VARCHAR(100) NOT NULL,
    `userId` VARCHAR(36) NULL,
    `roomBookingId` VARCHAR(36) NULL,
    `guestName` VARCHAR(191) NOT NULL,
    `guestEmail` VARCHAR(191) NOT NULL,
    `guestPhone` VARCHAR(25) NULL,
    `roomNumber` VARCHAR(20) NULL,
    `bookingDate` DATETIME(3) NOT NULL,
    `startTime` VARCHAR(50) NULL,
    `duration` VARCHAR(50) NULL,
    `totalPrice` DOUBLE NOT NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    `formData` LONGTEXT NOT NULL,
    `notes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `service_bookings_bookingNumber_key`(`bookingNumber`),
    INDEX `service_bookings_serviceType_idx`(`serviceType`),
    INDEX `service_bookings_status_idx`(`status`),
    INDEX `service_bookings_guestEmail_idx`(`guestEmail`),
    INDEX `service_bookings_bookingDate_idx`(`bookingDate`),
    INDEX `service_bookings_roomBookingId_idx`(`roomBookingId`),
    INDEX `service_bookings_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `guest_profiles` ADD CONSTRAINT `guest_profiles_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `staff_profiles` ADD CONSTRAINT `staff_profiles_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rooms` ADD CONSTRAINT `rooms_floorId_fkey` FOREIGN KEY (`floorId`) REFERENCES `floors`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bookings` ADD CONSTRAINT `bookings_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `rooms`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bookings` ADD CONSTRAINT `bookings_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat_sessions` ADD CONSTRAINT `chat_sessions_guestId_fkey` FOREIGN KEY (`guestId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat_sessions` ADD CONSTRAINT `chat_sessions_staffId_fkey` FOREIGN KEY (`staffId`) REFERENCES `staff_profiles`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat_messages` ADD CONSTRAINT `chat_messages_senderId_fkey` FOREIGN KEY (`senderId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat_messages` ADD CONSTRAINT `chat_messages_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `chat_sessions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `parking_reservations` ADD CONSTRAINT `parking_reservations_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `parking_reservations` ADD CONSTRAINT `parking_reservations_roomBookingId_fkey` FOREIGN KEY (`roomBookingId`) REFERENCES `bookings`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_roomBookingId_fkey` FOREIGN KEY (`roomBookingId`) REFERENCES `bookings`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `orders`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `store_items`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `concierge_events` ADD CONSTRAINT `concierge_events_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `concierge_sessions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `service_bookings` ADD CONSTRAINT `service_bookings_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `service_bookings` ADD CONSTRAINT `service_bookings_roomBookingId_fkey` FOREIGN KEY (`roomBookingId`) REFERENCES `bookings`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

