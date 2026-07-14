-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: May 19, 2026 at 12:26 PM
-- Server version: 9.7.0
-- PHP Version: 8.3.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `betterx`
--
CREATE DATABASE IF NOT EXISTS `betterx` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE `betterx`;

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `post_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `user_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `body` text NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `comments`
--


-- --------------------------------------------------------

--
-- Table structure for table `follows`
--

CREATE TABLE `follows` (
  `follower_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `followee_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `follows`
--


-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `user_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `title` varchar(255) NOT NULL,
  `body` text NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `posts`
--


-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(30) NOT NULL,
  `username` varchar(30) NOT NULL,
  `password` varchar(255) NOT NULL,
  `profile_pic` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

--
-- Indexes for dumped tables
--

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `post_id` (`post_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `follows`
--
ALTER TABLE `follows`
  ADD PRIMARY KEY (`follower_id`,`followee_id`),
  ADD UNIQUE KEY `follows_followerId_followeeId_unique` (`follower_id`,`followee_id`),
  ADD KEY `followee_id` (`followee_id`);

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_username` (`username`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `follows`
--
ALTER TABLE `follows`
  ADD CONSTRAINT `follows_ibfk_1` FOREIGN KEY (`follower_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `follows_ibfk_2` FOREIGN KEY (`followee_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- Insert users (Keeping original UUIDs, Usernames, and Passwords)
INSERT INTO users (id, name, username, password, created_at, updated_at) VALUES ('4b1193cc-7ba1-462c-99c5-2e3ea4ab6d14', 'Alice', 'alice0', '7f7737fddd2842bc2afdbf1868aaa8e986b83133a1f010fe96535c15e4584628', now(), now());
INSERT INTO users (id, name, username, password, created_at, updated_at) VALUES ('1230ae30-dc4f-4752-bd84-092956f5c633', 'Bob', 'bob000', '7f7737fddd2842bc2afdbf1868aaa8e986b83133a1f010fe96535c15e4584628', now(), now());
INSERT INTO users (id, name, username, password, created_at, updated_at) VALUES ('034485be-cfd2-48a7-b80d-f54773eab18c', 'Diana', 'diana0', '7f7737fddd2842bc2afdbf1868aaa8e986b83133a1f010fe96535c15e4584628', now(), now());
INSERT INTO users (id, name, username, password, created_at, updated_at) VALUES ('57ca1e6a-fc89-4d28-ad45-a1f351862cfc', 'Charlie', 'charlie', '7f7737fddd2842bc2afdbf1868aaa8e986b83133a1f010fe96535c15e4584628', now(), now());
INSERT INTO users (id, name, username, password, created_at, updated_at) VALUES ('bff2018c-b130-4de4-b645-3246b6e4dbb6', 'Gustav', 'gustav', '7f7737fddd2842bc2afdbf1868aaa8e986b83133a1f010fe96535c15e4584628', now(), now());

-- Insert posts (Updated to match specific interests)
-- Alice's Posts (Tech, Coffee, Sci-Fi)
INSERT INTO posts (id, user_id, title, body, image_url, created_at, updated_at) VALUES ('b36cbf8c-b16c-41a2-92eb-e25a09229c48', '4b1193cc-7ba1-462c-99c5-2e3ea4ab6d14', 'Finally mastered React Hooks!', 'It took me a few weeks, but understanding state and effect hooks has completely changed how I build web apps. No more messy class components!', 'https://picsum.photos/400/600', now(), now());
INSERT INTO posts (id, user_id, title, body, image_url, created_at, updated_at) VALUES ('53f1d881-bb94-4dad-bffb-01fcc561537c', '4b1193cc-7ba1-462c-99c5-2e3ea4ab6d14', 'Best espresso beans in the city?', 'I just ran out of my usual light roast. Anyone have recommendations for local roasters that sell beans with strong floral or fruity notes?', 'https://picsum.photos/300/300', now(), now());
INSERT INTO posts (id, user_id, title, body, image_url, created_at, updated_at) VALUES ('9dadf7cd-59ed-4d2d-817c-d9dca835823d', '4b1193cc-7ba1-462c-99c5-2e3ea4ab6d14', 'Just watched Dune Part 2 again', 'Villeneuve is a genius. The way he adapted Herbert''s sci-fi world to the screen is breathtaking. The sound design alone is worth the ticket price.', 'https://picsum.photos/200/300', now(), now());
INSERT INTO posts (id, user_id, title, body, image_url, created_at, updated_at) VALUES ('c6e5ea19-cd7e-43ec-9619-739cf587f211', '4b1193cc-7ba1-462c-99c5-2e3ea4ab6d14', 'The future of AI in web dev', 'Been experimenting with AI coding assistants lately. They are great for generating boilerplate, but they definitely hallucinate logic sometimes.', 'https://picsum.photos/300/300', now(), now());
INSERT INTO posts (id, user_id, title, body, image_url, created_at, updated_at) VALUES ('59624e96-6167-411a-9846-06e5bddd17fe', '4b1193cc-7ba1-462c-99c5-2e3ea4ab6d14', 'Coding fueled by 4 shots of espresso', 'Currently debugging a production issue at 2 AM. My heart is racing, but the code is finally starting to compile. Wish me luck.', 'https://picsum.photos/600/400', now(), now());

-- Bob's Posts (Astronomy, Board Games, Sci-Fi)
INSERT INTO posts (id, user_id, title, body, image_url, created_at, updated_at) VALUES ('4c310189-951d-48e5-9477-c85d59290358', '1230ae30-dc4f-4752-bd84-092956f5c633', 'Meteor shower tonight!', 'Did anyone else catch the Perseids meteor shower last night? I was out with my binoculars and saw at least a dozen shooting stars.', 'https://picsum.photos/500/700', now(), now());
INSERT INTO posts (id, user_id, title, body, image_url, created_at, updated_at) VALUES ('07a9fc97-e7f9-49da-a761-2dbfcd05b0f1', '1230ae30-dc4f-4752-bd84-092956f5c633', 'Need 2-player board game recommendations', 'My usual gaming group is out of town this weekend. What are your favorite board games specifically designed for two players?', 'https://picsum.photos/500/700', now(), now());
INSERT INTO posts (id, user_id, title, body, image_url, created_at, updated_at) VALUES ('a49a1cb6-d2ab-4e83-b789-99e70334a8a7', '1230ae30-dc4f-4752-bd84-092956f5c633', 'Asimov''s Foundation series is a masterpiece', 'Just finished re-reading the original trilogy. The concept of psychohistory—using math and sociology to predict the future—blows my mind every time.', 'https://picsum.photos/500/700', now(), now());
INSERT INTO posts (id, user_id, title, body, image_url, created_at, updated_at) VALUES ('f500eabc-7451-4327-b4f3-afdc2a442c73', '1230ae30-dc4f-4752-bd84-092956f5c633', 'James Webb Telescope''s latest images', 'The new deep field images from JWST are mind-blowing. Looking at those galaxies is literally looking back in time billions of years.', 'https://picsum.photos/600/400', now(), now());
INSERT INTO posts (id, user_id, title, body, image_url, created_at, updated_at) VALUES ('0bc5925c-c089-45b3-bf98-5e7f8654ba46', '1230ae30-dc4f-4752-bd84-092956f5c633', 'Twilight Imperium took us 8 hours...', 'We finally managed to get a 6-player game of Twilight Imperium going. It took an entire Sunday, but negotiating galactic trade was worth it.', 'https://picsum.photos/400/600', now(), now());

-- Diana's Posts (Baking, Board Games, Fantasy)
INSERT INTO posts (id, user_id, title, body, image_url, created_at, updated_at) VALUES ('06bb35a0-db3a-4a9f-aed6-c4578d6b3526', '034485be-cfd2-48a7-b80d-f54773eab18c', 'First attempt at sourdough bread!', 'After feeding my starter for two weeks, I finally baked my first loaf. The crust is super crispy, and the crumb is perfect!', 'https://picsum.photos/500/700', now(), now());
INSERT INTO posts (id, user_id, title, body, image_url, created_at, updated_at) VALUES ('d914b0bb-0826-468e-8c32-66296f4bc421', '034485be-cfd2-48a7-b80d-f54773eab18c', 'Brandon Sanderson''s latest book', 'Just finished The Way of Kings. The world-building on Roshar is so unique, and the magic system feels like its own branch of physics.', 'https://picsum.photos/400/600', now(), now());
INSERT INTO posts (id, user_id, title, body, image_url, created_at, updated_at) VALUES ('71fa80e3-0bd2-4471-8c57-42be69ff5b5e', '034485be-cfd2-48a7-b80d-f54773eab18c', 'Just bought Settlers of Catan 3D edition', 'I couldn''t resist! The painted terrain hexes look absolutely gorgeous. Who wants to come over and trade sheep for wood?', 'https://picsum.photos/200/300', now(), now());
INSERT INTO posts (id, user_id, title, body, image_url, created_at, updated_at) VALUES ('f3a0ad0c-5445-4bf1-99e2-213b4f6d34f4', '034485be-cfd2-48a7-b80d-f54773eab18c', 'The secret to perfect chocolate chip cookies', 'I’ve finally perfected my recipe. The trick? Brown the butter beforehand and let the dough rest in the fridge for a full 24 hours.', 'https://picsum.photos/300/300', now(), now());
INSERT INTO posts (id, user_id, title, body, image_url, created_at, updated_at) VALUES ('a7385d69-8331-406e-a25a-9f206414ebc5', '034485be-cfd2-48a7-b80d-f54773eab18c', 'Made Lembas bread from Lord of the Rings!', 'Decided to combine my love for baking and fantasy today. I even wrapped them in large green leaves for the full elven aesthetic!', 'https://picsum.photos/400/600', now(), now());

-- Charlie's Posts (Fitness, Tech, Baking)
INSERT INTO posts (id, user_id, title, body, image_url, created_at, updated_at) VALUES ('9d0d05bd-1f97-4a0a-bd73-5e2b3b901fd9', '57ca1e6a-fc89-4d28-ad45-a1f351862cfc', 'Just finished my first half-marathon!', '13.1 miles in the bag! My legs are completely dead, but the runner''s high is real. Ready to eat my weight in carbs.', 'https://picsum.photos/500/700', now(), now());
INSERT INTO posts (id, user_id, title, body, image_url, created_at, updated_at) VALUES ('2dc9c4bb-cdf3-47ef-a899-e9aa1a153bd9', '57ca1e6a-fc89-4d28-ad45-a1f351862cfc', 'Why Rust is my new favorite language', 'I''ve been porting some old backend services to Rust. Memory safety without garbage collection is just beautiful engineering.', 'https://picsum.photos/300/300', now(), now());
INSERT INTO posts (id, user_id, title, body, image_url, created_at, updated_at) VALUES ('d779557a-aaf7-4dcc-af4c-193b87860dbe', '57ca1e6a-fc89-4d28-ad45-a1f351862cfc', 'Trying out Diana''s cookie recipe', 'After my 10k run this morning, I decided I earned a treat. Trying out that browned butter chocolate chip recipe!', 'https://picsum.photos/200/300', now(), now());
INSERT INTO posts (id, user_id, title, body, image_url, created_at, updated_at) VALUES ('21eec5bc-a204-4b9b-b181-8d45d5b57fc0', '57ca1e6a-fc89-4d28-ad45-a1f351862cfc', 'Building a custom fitness tracker app', 'None of the running apps on the market do exactly what I want, so I’m coding my own using React Native. It tracks splits perfectly.', 'https://picsum.photos/300/300', now(), now());
INSERT INTO posts (id, user_id, title, body, image_url, created_at, updated_at) VALUES ('b91c6e54-4bc0-48fe-83fc-a706ca430977', '57ca1e6a-fc89-4d28-ad45-a1f351862cfc', 'Best running shoes for flat feet?', 'My current pair is giving me terrible blisters on my arches. Any runners out there have recommendations for good stability shoes?', 'https://picsum.photos/300/300', now(), now());

-- Gustav's Posts (Astronomy, Coffee, Fitness)
INSERT INTO posts (id, user_id, title, body, image_url, created_at, updated_at) VALUES ('e7c71e61-c8fd-4961-bdf8-0ff323f6063c', 'bff2018c-b130-4de4-b645-3246b6e4dbb6', 'Mars rover latest findings', 'The geological data coming back from the Perseverance rover is incredible. Finding ancient river deltas proves Mars had liquid water.', 'https://picsum.photos/300/300', now(), now());
INSERT INTO posts (id, user_id, title, body, image_url, created_at, updated_at) VALUES ('f8f2373f-eef8-4f71-89c2-f3df7cb9eb7d', 'bff2018c-b130-4de4-b645-3246b6e4dbb6', 'Pour-over vs. French Press debate', 'I''m firmly on team pour-over. It takes more patience in the morning, but you get a much cleaner cup of coffee without the muddy sediment.', 'https://picsum.photos/600/400', now(), now());
INSERT INTO posts (id, user_id, title, body, image_url, created_at, updated_at) VALUES ('6c732eca-e0ab-4e93-874d-89ed175a3066', 'bff2018c-b130-4de4-b645-3246b6e4dbb6', 'Workout recovery is crucial', 'Reminder to all my fellow runners: rest days are just as important as workout days. Don''t skip your stretching and foam rolling!', 'https://picsum.photos/300/300', now(), now());
INSERT INTO posts (id, user_id, title, body, image_url, created_at, updated_at) VALUES ('e3799d20-411d-4469-bcaf-cb191abd7a95', 'bff2018c-b130-4de4-b645-3246b6e4dbb6', 'Stargazing with a warm thermos', 'Up at 4 AM to catch Jupiter in the clear sky. Brought out my telescope and a fresh thermos of Ethiopian blend coffee. Perfect morning.', 'https://picsum.photos/300/300', now(), now());
INSERT INTO posts (id, user_id, title, body, image_url, created_at, updated_at) VALUES ('4dba0c8b-33ce-43c2-802f-5942ee37c668', 'bff2018c-b130-4de4-b645-3246b6e4dbb6', 'Interval training routines for beginners', 'If you want to run faster, you have to do speed work. Try doing 1 minute of hard sprinting followed by 2 minutes of jogging to start.', 'https://picsum.photos/400/600', now(), now());


-- Insert comments (Updated to reflect crossing interests)
-- Comments on Alice's pA1 (Tech/React)
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('aff9f4b4-20c1-40b1-bb26-8295a8e42058', 'b36cbf8c-b16c-41a2-92eb-e25a09229c48', '034485be-cfd2-48a7-b80d-f54773eab18c', 'Sounds like magic to me! I''m just here trying to bake bread.', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('30557031-46fe-4b3a-9719-71c4e7fde19b', 'b36cbf8c-b16c-41a2-92eb-e25a09229c48', '57ca1e6a-fc89-4d28-ad45-a1f351862cfc', 'Hooks completely changed how I build apps. Clean and concise!', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('352f85c3-08bd-42ee-94a9-c692dda06522', 'b36cbf8c-b16c-41a2-92eb-e25a09229c48', 'bff2018c-b130-4de4-b645-3246b6e4dbb6', 'Is that a web app? Sounds complicated, I''ll stick to running.', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('f7533b9c-03bc-48b6-9119-4e9b665eee7f', 'b36cbf8c-b16c-41a2-92eb-e25a09229c48', '4b1193cc-7ba1-462c-99c5-2e3ea4ab6d14', 'Charlie, right?! I can never go back to class components.', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('db348ebf-329f-459c-b4db-a41c59231e4e', 'b36cbf8c-b16c-41a2-92eb-e25a09229c48', 'bff2018c-b130-4de4-b645-3246b6e4dbb6', 'If you ever build a running app with it, let me know.', now(), now());

-- Comments on Alice's pA2 (Coffee)
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('ab3f2f87-9175-441a-a3a5-590a0873ed93', '53f1d881-bb94-4dad-bffb-01fcc561537c', '4b1193cc-7ba1-462c-99c5-2e3ea4ab6d14', 'I generally prefer a light roast with fruity notes.', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('0fb74ce2-220f-429e-8b49-1f7078352f9c', '53f1d881-bb94-4dad-bffb-01fcc561537c', 'bff2018c-b130-4de4-b645-3246b6e4dbb6', 'You have to try the Yirgacheffe from the local roaster downtown. Life changing.', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('187ef2bd-07fa-4fbc-8d19-8dc0fb3c34fd', '53f1d881-bb94-4dad-bffb-01fcc561537c', '4b1193cc-7ba1-462c-99c5-2e3ea4ab6d14', 'Gustav, thanks! I will definitely grab a bag this weekend.', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('4b16d146-f222-45ae-acd3-5ebaa9bb78cd', '53f1d881-bb94-4dad-bffb-01fcc561537c', '4b1193cc-7ba1-462c-99c5-2e3ea4ab6d14', 'Actually, scratch that, I''m going today.', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('97cab74c-0f3a-48e2-9720-b42db5a7a0ea', '53f1d881-bb94-4dad-bffb-01fcc561537c', '57ca1e6a-fc89-4d28-ad45-a1f351862cfc', 'I just drink instant coffee before my morning runs. Don''t judge me.', now(), now());

-- Comments on Alice's pA3 (Dune)
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('32864d9c-d186-4e13-b064-6c213c0b701d', '9dadf7cd-59ed-4d2d-817c-d9dca835823d', '1230ae30-dc4f-4752-bd84-092956f5c633', 'The visuals were stunning, but the book handles the political nuance much better.', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('0c1b8835-4fe2-4c41-9772-ff3b9b487bf2', '9dadf7cd-59ed-4d2d-817c-d9dca835823d', '4b1193cc-7ba1-462c-99c5-2e3ea4ab6d14', 'Bob, I agree, but Villeneuve really nailed the atmosphere perfectly.', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('50380414-aacd-4329-a51f-518f4074b25a', '9dadf7cd-59ed-4d2d-817c-d9dca835823d', '034485be-cfd2-48a7-b80d-f54773eab18c', 'I''m more of a fantasy reader, but the world-building looks incredible!', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('5d29ceef-7a31-4f32-b915-a5a32f76eb4e', '9dadf7cd-59ed-4d2d-817c-d9dca835823d', 'bff2018c-b130-4de4-b645-3246b6e4dbb6', 'The desert planet scenes reminded me of some of those high-res Mars surface photos.', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('0eb2d55b-ef95-4a65-8dd9-afbdb8c1115b', '9dadf7cd-59ed-4d2d-817c-d9dca835823d', 'bff2018c-b130-4de4-b645-3246b6e4dbb6', 'Also, Hans Zimmer''s score is absolutely top tier.', now(), now());

-- Comments on Alice's pA4 (AI in web dev)
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('0d50983f-0ced-4b47-a3dc-5035411076c3', 'c6e5ea19-cd7e-43ec-9619-739cf587f211', '1230ae30-dc4f-4752-bd84-092956f5c633', 'As long as it doesn''t become Skynet, I think we''re good.', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('a9b6c01c-6c7f-41ee-a30e-5b9b3581b111', 'c6e5ea19-cd7e-43ec-9619-739cf587f211', '57ca1e6a-fc89-4d28-ad45-a1f351862cfc', 'It''s a great tool for boilerplate, but it won''t replace good software architecture.', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('3edd8842-b6e6-45c2-9dcc-f52a2d3c651d', 'c6e5ea19-cd7e-43ec-9619-739cf587f211', 'bff2018c-b130-4de4-b645-3246b6e4dbb6', 'I asked an AI to write me a training plan once. It wanted me to run 100 miles on day 1.', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('a098859b-e715-43ff-9879-644b407f220d', 'c6e5ea19-cd7e-43ec-9619-739cf587f211', '57ca1e6a-fc89-4d28-ad45-a1f351862cfc', 'Haha, Gustav, that''s hilarious. AI is definitely hallucinating there.', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('63f2e104-0172-47bf-9bf7-2233d118134c', 'c6e5ea19-cd7e-43ec-9619-739cf587f211', '1230ae30-dc4f-4752-bd84-092956f5c633', 'Maybe it thought you were a cyborg.', now(), now());

-- Comments on Alice's pA5 (Coding & Espresso)
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('db6624d9-92e5-4e09-8ff1-83ce68637937', '59624e96-6167-411a-9846-06e5bddd17fe', 'bff2018c-b130-4de4-b645-3246b6e4dbb6', 'Careful with that much caffeine, your heart rate must be through the roof!', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('614756c8-393e-4409-ae78-ec4d3a4bb109', '59624e96-6167-411a-9846-06e5bddd17fe', '4b1193cc-7ba1-462c-99c5-2e3ea4ab6d14', 'It''s the only way I can debug this CSS issue, Gustav.', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('be2f86ca-981d-47d2-879f-b460c18e3ba0', '59624e96-6167-411a-9846-06e5bddd17fe', 'bff2018c-b130-4de4-b645-3246b6e4dbb6', 'Fair enough, just remember to hydrate!', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('d9c877b4-694d-4397-a5b1-09718034c02a', '59624e96-6167-411a-9846-06e5bddd17fe', '57ca1e6a-fc89-4d28-ad45-a1f351862cfc', 'I code standing up, helps burn off that espresso energy.', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('daab4405-53a6-47e4-b161-840c027bbf9f', '59624e96-6167-411a-9846-06e5bddd17fe', 'bff2018c-b130-4de4-b645-3246b6e4dbb6', 'Standing desks are basically a light workout. I approve.', now(), now());

-- Comments on Bob's pB1 (Meteor shower)
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('766f461c-5bb0-43da-b51b-f3e365679fb8', '4c310189-951d-48e5-9477-c85d59290358', 'bff2018c-b130-4de4-b645-3246b6e4dbb6', 'I saw it! Had my telescope out until 2 AM.', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('717bde79-86cd-4823-a34d-9063589458f7', '4c310189-951d-48e5-9477-c85d59290358', '1230ae30-dc4f-4752-bd84-092956f5c633', 'Gustav, nice! I was just using binoculars but still caught a few good ones.', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('dec9fa44-e817-4fe0-9303-085b910a2420', '4c310189-951d-48e5-9477-c85d59290358', '034485be-cfd2-48a7-b80d-f54773eab18c', 'I missed it entirely, I was too busy reading a new fantasy novel.', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('e78c4e96-378b-4810-bf62-4bd914b4b91d', '4c310189-951d-48e5-9477-c85d59290358', '57ca1e6a-fc89-4d28-ad45-a1f351862cfc', 'I was up early for a run and caught the tail end of it!', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('4ea55b21-91be-4fb6-8d3d-107c611fc05a', '4c310189-951d-48e5-9477-c85d59290358', '034485be-cfd2-48a7-b80d-f54773eab18c', 'Maybe I''ll catch the next one if it''s not too cloudy.', now(), now());

-- Comments on Bob's pB2 (2-player board games)
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('895b67dc-f795-407a-97ec-e7565d1bc692', '07a9fc97-e7f9-49da-a761-2dbfcd05b0f1', '4b1193cc-7ba1-462c-99c5-2e3ea4ab6d14', 'Have you tried 7 Wonders Duel? It''s amazing.', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('97f1af53-5004-4c38-971c-df973ecf104a', '07a9fc97-e7f9-49da-a761-2dbfcd05b0f1', 'bff2018c-b130-4de4-b645-3246b6e4dbb6', 'Not really into board games, but I play chess sometimes.', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('0e217b71-cc65-4757-8091-f96a9f0640f6', '07a9fc97-e7f9-49da-a761-2dbfcd05b0f1', '57ca1e6a-fc89-4d28-ad45-a1f351862cfc', 'Patchwork is great! My partner and I play it all the time.', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('1c523a55-74ea-42d5-8719-f6931b78f0f2', '07a9fc97-e7f9-49da-a761-2dbfcd05b0f1', '57ca1e6a-fc89-4d28-ad45-a1f351862cfc', 'Targi is also a solid choice if you like worker placement.', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('693b6a2b-13be-4f7e-bfcb-6f7d2f22241a', '07a9fc97-e7f9-49da-a761-2dbfcd05b0f1', '4b1193cc-7ba1-462c-99c5-2e3ea4ab6d14', 'I second Patchwork. Super relaxing.', now(), now());

-- Comments on Bob's pB3 (Asimov)
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('b2c63bac-b7db-4370-9792-6d29aacba06f', 'a49a1cb6-d2ab-4e83-b789-99e70334a8a7', '1230ae30-dc4f-4752-bd84-092956f5c633', 'Psychohistory is such a fascinating concept.', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('52f9226f-155d-4d4f-a5d8-05abd7d04309', 'a49a1cb6-d2ab-4e83-b789-99e70334a8a7', 'bff2018c-b130-4de4-b645-3246b6e4dbb6', 'I haven''t read it, but I love the idea of using math to predict the future.', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('f1ef651b-c3a9-4622-aec6-63d592ecfd5b', 'a49a1cb6-d2ab-4e83-b789-99e70334a8a7', '4b1193cc-7ba1-462c-99c5-2e3ea4ab6d14', 'One of my absolute favorites. The scale of the empire is just epic.', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('b1b21f91-5847-4011-bce3-fd96c4892038', 'a49a1cb6-d2ab-4e83-b789-99e70334a8a7', 'bff2018c-b130-4de4-b645-3246b6e4dbb6', 'Is the TV show adaptation any good?', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('3dc19779-ef6d-4fa5-a439-152bc280d72f', 'a49a1cb6-d2ab-4e83-b789-99e70334a8a7', 'bff2018c-b130-4de4-b645-3246b6e4dbb6', 'I might just start with the books.', now(), now());

-- Comments on Bob's pB4 (James Webb)
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('376d31f4-de8e-40b6-8007-2a921a9bf81e', 'f500eabc-7451-4327-b4f3-afdc2a442c73', '1230ae30-dc4f-4752-bd84-092956f5c633', 'The detail in the Carina Nebula image is just breathtaking.', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('814a3250-ec16-48cc-a529-2fabda108087', 'f500eabc-7451-4327-b4f3-afdc2a442c73', '034485be-cfd2-48a7-b80d-f54773eab18c', 'It almost looks like a painting. Reality is stranger than fiction.', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('04f6fa31-d0fa-4a06-8e93-1c5fe23521f7', 'f500eabc-7451-4327-b4f3-afdc2a442c73', '4b1193cc-7ba1-462c-99c5-2e3ea4ab6d14', 'I have it set as my desktop background right now. Simply stunning.', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('d50a4e51-ebb9-48d9-aae3-c29572ca6ac3', 'f500eabc-7451-4327-b4f3-afdc2a442c73', 'bff2018c-b130-4de4-b645-3246b6e4dbb6', 'It really puts our little blue dot into perspective, doesn''t it?', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('3d0e27bb-bca4-4c8f-b756-195e00453739', 'f500eabc-7451-4327-b4f3-afdc2a442c73', 'bff2018c-b130-4de4-b645-3246b6e4dbb6', 'Can''t wait to see what they find in the TRAPPIST-1 system.', now(), now());

-- Comments on Bob's pB5 (Twilight Imperium)
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('171eb160-c740-4706-91fa-d56aa0a999f1', '0bc5925c-c089-45b3-bf98-5e7f8654ba46', '4b1193cc-7ba1-462c-99c5-2e3ea4ab6d14', '8 hours?! You have more patience than I do when debugging.', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('de705178-aa1a-44ae-9b48-6ea893597b3b', '0bc5925c-c089-45b3-bf98-5e7f8654ba46', '57ca1e6a-fc89-4d28-ad45-a1f351862cfc', 'Sounds like an endurance sport. Did you at least have snacks?', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('bc1e1d45-6db4-46cb-8bf9-dbea683e8166', '0bc5925c-c089-45b3-bf98-5e7f8654ba46', 'bff2018c-b130-4de4-b645-3246b6e4dbb6', 'That''s basically a full workday of sitting. You need to stretch!', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('10758c75-fe2f-4558-b2f0-2532416c6c06', '0bc5925c-c089-45b3-bf98-5e7f8654ba46', '57ca1e6a-fc89-4d28-ad45-a1f351862cfc', 'I hope you won after investing that much time.', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('2d8241c9-4437-4a52-bc9c-7aa26c94b817', '0bc5925c-c089-45b3-bf98-5e7f8654ba46', '034485be-cfd2-48a7-b80d-f54773eab18c', 'Epic! I love long games, but even that might be too much for me.', now(), now());

-- Comments on Diana's pD1 (Sourdough)
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('61ece0c1-11fc-4b7c-b736-f38e32cd6f0b', '06bb35a0-db3a-4a9f-aed6-c4578d6b3526', '57ca1e6a-fc89-4d28-ad45-a1f351862cfc', 'Looks delicious! Carbs are essential for long runs.', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('7d0aa8c3-602b-4f0f-99d5-9a76027997d2', '06bb35a0-db3a-4a9f-aed6-c4578d6b3526', '4b1193cc-7ba1-462c-99c5-2e3ea4ab6d14', 'Send some my way! I''d love to pair that with my morning coffee.', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('56a11b1e-0ea0-4e22-a975-1bb94ee660b6', '06bb35a0-db3a-4a9f-aed6-c4578d6b3526', '034485be-cfd2-48a7-b80d-f54773eab18c', 'Charlie, I''ll definitely save you a loaf for your next race day!', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('167c1d88-3d5e-4807-834a-686784cc0e45', '06bb35a0-db3a-4a9f-aed6-c4578d6b3526', '57ca1e6a-fc89-4d28-ad45-a1f351862cfc', 'Awesome, I''ll trade you for some tech support.', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('8f77e82d-74dd-456e-9142-360e7d9ced70', '06bb35a0-db3a-4a9f-aed6-c4578d6b3526', '1230ae30-dc4f-4752-bd84-092956f5c633', 'Sourdough is essentially a very slow, edible science experiment.', now(), now());

-- Comments on Diana's pD2 (Brandon Sanderson)
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('a0855c8f-4862-4f71-8614-557fb30925d2', 'd914b0bb-0826-468e-8c32-66296f4bc421', '57ca1e6a-fc89-4d28-ad45-a1f351862cfc', 'Are his books good? I''ve been looking for something new for my rest days.', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('caa22c47-47e8-446f-b294-76b93d88b4ee', 'd914b0bb-0826-468e-8c32-66296f4bc421', '1230ae30-dc4f-4752-bd84-092956f5c633', 'His magic systems are incredibly logical, almost like physics. Highly recommend.', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('3a81a949-d4b9-4899-a1f8-715feec2e198', 'd914b0bb-0826-468e-8c32-66296f4bc421', '4b1193cc-7ba1-462c-99c5-2e3ea4ab6d14', 'I''m more of a sci-fi fan, but I appreciate his world-building.', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('60aba216-b382-4973-bee1-3122ef264469', 'd914b0bb-0826-468e-8c32-66296f4bc421', 'bff2018c-b130-4de4-b645-3246b6e4dbb6', 'They are huge books! Good upper body workout just holding them.', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('431d7dde-6bed-447e-bf74-ad99e38bb93e', 'd914b0bb-0826-468e-8c32-66296f4bc421', '57ca1e6a-fc89-4d28-ad45-a1f351862cfc', 'Haha, noted Gustav. I''ll get the e-book.', now(), now());

-- Comments on Diana's pD3 (Catan 3D)
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('0c62a82d-dbfa-4c41-a197-7ddb53fac1ed', '71fa80e3-0bd2-4471-8c57-42be69ff5b5e', '034485be-cfd2-48a7-b80d-f54773eab18c', 'The painted tiles are gorgeous. Really immerses you in the game.', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('9b40788e-9ffe-4e4c-9cb1-5ef05edeabf2', '71fa80e3-0bd2-4471-8c57-42be69ff5b5e', '1230ae30-dc4f-4752-bd84-092956f5c633', 'I''m jealous! We need to schedule a game night soon.', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('afce5574-c736-4ff4-bf76-e5d7e7d5e3de', '71fa80e3-0bd2-4471-8c57-42be69ff5b5e', '4b1193cc-7ba1-462c-99c5-2e3ea4ab6d14', 'I''ll bring the coffee if you supply the game!', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('ff7e5d11-d20a-46c3-af33-4925ddbc719e', '71fa80e3-0bd2-4471-8c57-42be69ff5b5e', 'bff2018c-b130-4de4-b645-3246b6e4dbb6', 'I''ll pass on Catan, but I''ll come hang out for the snacks.', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('7a7c8033-2244-4621-8b8e-1dedb08dad09', '71fa80e3-0bd2-4471-8c57-42be69ff5b5e', '034485be-cfd2-48a7-b80d-f54773eab18c', 'Deal! Game night at my place this weekend.', now(), now());

-- Comments on Diana's pD4 (Cookie secret)
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('fd0dc2e5-357d-4c12-91fd-88dbb1d0ba7a', 'f3a0ad0c-5445-4bf1-99e2-213b4f6d34f4', '4b1193cc-7ba1-462c-99c5-2e3ea4ab6d14', 'Is the secret brown butter? It''s always brown butter.', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('499fea81-f0d1-4974-9fc8-3967bdb87bee', 'f3a0ad0c-5445-4bf1-99e2-213b4f6d34f4', '034485be-cfd2-48a7-b80d-f54773eab18c', 'Alice, yes! And letting the dough rest in the fridge for 24 hours.', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('4b3ec27c-d468-4c00-b2ec-f62108e207a7', 'f3a0ad0c-5445-4bf1-99e2-213b4f6d34f4', 'bff2018c-b130-4de4-b645-3246b6e4dbb6', 'Sugar is the enemy of my diet, but I might make an exception.', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('e5b70975-00d7-4130-b829-85159ace48b3', 'f3a0ad0c-5445-4bf1-99e2-213b4f6d34f4', '034485be-cfd2-48a7-b80d-f54773eab18c', 'Treat yourself, Gustav! Everything in moderation.', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('b938d4e7-1ff6-43e8-89a6-6ebfbdec550a', 'f3a0ad0c-5445-4bf1-99e2-213b4f6d34f4', '57ca1e6a-fc89-4d28-ad45-a1f351862cfc', 'I''m definitely baking these for my post-run cheat meal.', now(), now());

-- Comments on Diana's pD5 (Lembas bread)
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('86b1cf3f-8eb7-415e-b3aa-51e827acaea1', 'a7385d69-8331-406e-a25a-9f206414ebc5', '4b1193cc-7ba1-462c-99c5-2e3ea4ab6d14', 'One bite is enough to fill the stomach of a grown man?', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('81ec2bb3-31cc-427a-8639-a85e96b537ba', 'a7385d69-8331-406e-a25a-9f206414ebc5', '1230ae30-dc4f-4752-bd84-092956f5c633', 'Perfect for long journeys... or long board game sessions.', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('58c6b3ea-75cf-4ff6-9b68-da42dd42b702', 'a7385d69-8331-406e-a25a-9f206414ebc5', '034485be-cfd2-48a7-b80d-f54773eab18c', 'Exactly Bob! I wrapped them in mallorn leaves (okay, banana leaves).', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('dada012a-a60f-4740-b685-f2a3d6d3ecc9', 'a7385d69-8331-406e-a25a-9f206414ebc5', '1230ae30-dc4f-4752-bd84-092956f5c633', 'That''s incredible dedication to the theme.', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('85abc7e8-37af-4b35-bd07-5ab96f36365c', 'a7385d69-8331-406e-a25a-9f206414ebc5', '57ca1e6a-fc89-4d28-ad45-a1f351862cfc', 'Sounds like the perfect dense carb block for marathon fueling.', now(), now());

-- Comments on Charlie's pC1 (Half-marathon)
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('bba78cdf-63a7-4565-96a9-5983839da1f7', '9d0d05bd-1f97-4a0a-bd73-5e2b3b901fd9', '4b1193cc-7ba1-462c-99c5-2e3ea4ab6d14', 'Congrats Charlie! That''s a huge achievement.', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('ec923e84-9c66-4632-aa76-769d5b788431', '9d0d05bd-1f97-4a0a-bd73-5e2b3b901fd9', 'bff2018c-b130-4de4-b645-3246b6e4dbb6', 'Amazing pace too! How are your legs feeling today?', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('81ffa076-b032-408f-bc40-a5a8043aa596', '9d0d05bd-1f97-4a0a-bd73-5e2b3b901fd9', '1230ae30-dc4f-4752-bd84-092956f5c633', 'I get tired just driving 13 miles. Well done!', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('e8e85223-238c-4f4d-a603-c4fc479a0c03', '9d0d05bd-1f97-4a0a-bd73-5e2b3b901fd9', '4b1193cc-7ba1-462c-99c5-2e3ea4ab6d14', 'I think you need a massive coffee to celebrate.', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('ec03adde-1b00-497c-84b5-d824612ff2c1', '9d0d05bd-1f97-4a0a-bd73-5e2b3b901fd9', '57ca1e6a-fc89-4d28-ad45-a1f351862cfc', 'Thanks everyone! Gustav, my legs are like jelly right now.', now(), now());

-- Comments on Charlie's pC2 (Rust)
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('54b734b0-ee8f-4dd3-881d-a0c744a1ca78', '2dc9c4bb-cdf3-47ef-a899-e9aa1a153bd9', '4b1193cc-7ba1-462c-99c5-2e3ea4ab6d14', 'Memory safety without garbage collection. It''s beautiful.', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('fb9f63ff-98e5-4481-9772-d1eceeb875af', '2dc9c4bb-cdf3-47ef-a899-e9aa1a153bd9', '034485be-cfd2-48a7-b80d-f54773eab18c', 'I have no idea what that means, but I''m happy you''re enjoying it!', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('1464854d-87f2-444e-9d40-971031a24684', '2dc9c4bb-cdf3-47ef-a899-e9aa1a153bd9', '57ca1e6a-fc89-4d28-ad45-a1f351862cfc', 'Alice, exactly! No more null pointer dereferences.', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('99741614-6e57-44ce-a655-d4185c837a6e', '2dc9c4bb-cdf3-47ef-a899-e9aa1a153bd9', '57ca1e6a-fc89-4d28-ad45-a1f351862cfc', 'Diana, haha thank you! It''s just a way to talk to computers safely.', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('523f2950-044b-4706-94e4-baf371e23f96', '2dc9c4bb-cdf3-47ef-a899-e9aa1a153bd9', '1230ae30-dc4f-4752-bd84-092956f5c633', 'Sounds like it has a steep learning curve though.', now(), now());

-- Comments on Charlie's pC3 (Diana's cookie recipe)
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('75121388-79b7-4764-8061-a048fcf3460f', 'd779557a-aaf7-4dcc-af4c-193b87860dbe', '57ca1e6a-fc89-4d28-ad45-a1f351862cfc', 'Update: they turned out amazing. The brown butter really is the secret.', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('43045729-fd64-49a1-b8b3-397d214689f3', 'd779557a-aaf7-4dcc-af4c-193b87860dbe', '57ca1e6a-fc89-4d28-ad45-a1f351862cfc', 'I ate three of them already.', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('3b5b92bb-df6a-4188-85df-cd6c181eb740', 'd779557a-aaf7-4dcc-af4c-193b87860dbe', '1230ae30-dc4f-4752-bd84-092956f5c633', 'Bring the rest to our next board game night!', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('210f5ef2-1e36-4c88-b7a5-68b5cca1f4f1', 'd779557a-aaf7-4dcc-af4c-193b87860dbe', '034485be-cfd2-48a7-b80d-f54773eab18c', 'So glad they turned out well! Baking is all about precise measurements.', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('b36df1f5-c9e3-4998-b234-26c08a2906e0', 'd779557a-aaf7-4dcc-af4c-193b87860dbe', '1230ae30-dc4f-4752-bd84-092956f5c633', 'Indeed, baking is chemistry for hungry people.', now(), now());

-- Comments on Charlie's pC4 (Custom fitness app)
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('ab96f474-c832-4691-b683-b5db9496fc02', '21eec5bc-a204-4b9b-b181-8d45d5b57fc0', '1230ae30-dc4f-4752-bd84-092956f5c633', 'Are you building it in Rust?', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('e85cfad8-a5fd-4210-950f-98e6ea1e2990', '21eec5bc-a204-4b9b-b181-8d45d5b57fc0', '4b1193cc-7ba1-462c-99c5-2e3ea4ab6d14', 'Need any help with the front-end? I can whip up a React interface.', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('0665245f-6b4b-4831-af55-dd911945e876', '21eec5bc-a204-4b9b-b181-8d45d5b57fc0', '1230ae30-dc4f-4752-bd84-092956f5c633', 'If you add a gamification element, I might actually use it.', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('fe903729-9ec5-48ee-b0dc-ac2b9dda6949', '21eec5bc-a204-4b9b-b181-8d45d5b57fc0', 'bff2018c-b130-4de4-b645-3246b6e4dbb6', 'I''d love to beta test it! I have a lot of thoughts on UI for runners.', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('f72fac20-08e6-43a9-b4fc-0466c1e6146d', '21eec5bc-a204-4b9b-b181-8d45d5b57fc0', '034485be-cfd2-48a7-b80d-f54773eab18c', 'Maybe you can add a feature that rewards you with baked goods.', now(), now());

-- Comments on Charlie's pC5 (Running shoes)
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('388ba467-4e9f-4c66-bc87-a685eb4c1919', 'b91c6e54-4bc0-48fe-83fc-a706ca430977', '57ca1e6a-fc89-4d28-ad45-a1f351862cfc', 'My current ones are giving me terrible blisters.', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('38a47f52-6a0b-48ad-9d1f-bc4428bb796a', 'b91c6e54-4bc0-48fe-83fc-a706ca430977', 'bff2018c-b130-4de4-b645-3246b6e4dbb6', 'Try the Brooks Adrenaline GTS. Great for flat feet and stability.', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('3632001e-68bc-41bc-8c68-12df96b6f2bf', 'b91c6e54-4bc0-48fe-83fc-a706ca430977', '1230ae30-dc4f-4752-bd84-092956f5c633', 'I just wear whatever is on sale. Probably why my knees hurt.', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('5557dfbb-89d7-4255-9084-164f314719a4', 'b91c6e54-4bc0-48fe-83fc-a706ca430977', 'bff2018c-b130-4de4-b645-3246b6e4dbb6', 'Bob, don''t skimp on footwear! Your knees will thank you.', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('9c04068d-6f45-4e89-b2d6-0a0b291a1645', 'b91c6e54-4bc0-48fe-83fc-a706ca430977', '034485be-cfd2-48a7-b80d-f54773eab18c', 'I just buy the ones that come in the prettiest colors.', now(), now());

-- Comments on Gustav's pG1 (Mars rover)
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('b9281da7-0ca4-48c8-96e5-0cddd2b0cd0b', 'e7c71e61-c8fd-4961-bdf8-0ff323f6063c', '1230ae30-dc4f-4752-bd84-092956f5c633', 'The geological data they are pulling from the crater is fascinating.', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('bdefe8be-c9de-4439-9887-9a0d5480aecc', 'e7c71e61-c8fd-4961-bdf8-0ff323f6063c', '4b1193cc-7ba1-462c-99c5-2e3ea4ab6d14', 'It''s amazing what we can accomplish with code running millions of miles away.', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('bc492ce5-a46b-42c1-a1b3-0dd47f79b519', 'e7c71e61-c8fd-4961-bdf8-0ff323f6063c', '1230ae30-dc4f-4752-bd84-092956f5c633', 'True, the latency must be a nightmare to deal with.', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('ab70b2ec-924c-44af-8560-b7cc8384e93d', 'e7c71e61-c8fd-4961-bdf8-0ff323f6063c', '57ca1e6a-fc89-4d28-ad45-a1f351862cfc', 'I wonder what the gravity there does to your running form.', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('1cb03c2f-9d27-4f23-9048-2675c2718385', 'e7c71e61-c8fd-4961-bdf8-0ff323f6063c', '034485be-cfd2-48a7-b80d-f54773eab18c', 'Do you think we''ll ever see humans colonize it in our lifetime?', now(), now());

-- Comments on Gustav's pG2 (Pour-over vs French Press)
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('2b39d906-8187-41f4-bafe-599072fa95c5', 'f8f2373f-eef8-4f71-89c2-f3df7cb9eb7d', '57ca1e6a-fc89-4d28-ad45-a1f351862cfc', 'Aeropress is the only correct answer here.', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('6c3d591c-0708-4e03-a983-7aa29f9177c4', 'f8f2373f-eef8-4f71-89c2-f3df7cb9eb7d', 'bff2018c-b130-4de4-b645-3246b6e4dbb6', 'I respect the Aeropress, but Pour-over gives you a cleaner cup.', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('3af34d82-bc80-438d-9503-26ca02dbc05c', 'f8f2373f-eef8-4f71-89c2-f3df7cb9eb7d', 'bff2018c-b130-4de4-b645-3246b6e4dbb6', 'French press is just too muddy for me.', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('97aadfc8-d8d1-4f12-bf0a-8114291044db', 'f8f2373f-eef8-4f71-89c2-f3df7cb9eb7d', '57ca1e6a-fc89-4d28-ad45-a1f351862cfc', 'Fair point. I just like how fast the Aeropress is.', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('5e9d660d-e1b4-4c09-9f98-9d5729a2ebb4', 'f8f2373f-eef8-4f71-89c2-f3df7cb9eb7d', '1230ae30-dc4f-4752-bd84-092956f5c633', 'I just use a drip machine. It''s utilitarian.', now(), now());

-- Comments on Gustav's pG3 (Workout recovery)
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('e91d19d8-8210-47af-8a1c-2698144364e0', '6c732eca-e0ab-4e93-874d-89ed175a3066', '034485be-cfd2-48a7-b80d-f54773eab18c', 'Does eating cookies count as recovery?', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('0b6db0bf-3d43-4d5e-9ea1-07d8e75bf221', '6c732eca-e0ab-4e93-874d-89ed175a3066', '1230ae30-dc4f-4752-bd84-092956f5c633', 'My entire life is a rest day.', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('97321ff4-0f93-4468-b173-b107f956c838', '6c732eca-e0ab-4e93-874d-89ed175a3066', '4b1193cc-7ba1-462c-99c5-2e3ea4ab6d14', 'I should probably stretch after sitting at my desk for 10 hours.', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('eca36f44-8ab7-4f0b-9451-59b361088982', '6c732eca-e0ab-4e93-874d-89ed175a3066', 'bff2018c-b130-4de4-b645-3246b6e4dbb6', 'Alice, yes! Just 10 minutes of yoga can fix your posture.', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('226e818f-831f-4f8c-90db-ee3575be746b', '6c732eca-e0ab-4e93-874d-89ed175a3066', 'bff2018c-b130-4de4-b645-3246b6e4dbb6', 'Diana, mentally? Yes. Physically? Maybe stick to protein.', now(), now());

-- Comments on Gustav's pG4 (Stargazing + Coffee)
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('28fc3e2e-87db-4592-9381-092bf1e52764', 'e3799d20-411d-4469-bcaf-cb191abd7a95', '57ca1e6a-fc89-4d28-ad45-a1f351862cfc', 'Sounds like a peaceful morning.', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('6ebfcdde-098e-45e7-81a9-4b3f0fc1cd38', 'e3799d20-411d-4469-bcaf-cb191abd7a95', '4b1193cc-7ba1-462c-99c5-2e3ea4ab6d14', 'Ethiopian blends have such great berry notes. Perfect for the cold.', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('058dd8c9-d589-4c30-b74f-1820838dfec6', 'e3799d20-411d-4469-bcaf-cb191abd7a95', '57ca1e6a-fc89-4d28-ad45-a1f351862cfc', 'I should try getting up earlier just to enjoy the quiet.', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('ee4e0279-31d4-4439-85c6-fa88b16d8132', 'e3799d20-411d-4469-bcaf-cb191abd7a95', '1230ae30-dc4f-4752-bd84-092956f5c633', 'Did you spot Jupiter? It''s been very bright lately.', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('0066a7b1-d38c-4027-8682-6e366d2c81e7', 'e3799d20-411d-4469-bcaf-cb191abd7a95', 'bff2018c-b130-4de4-b645-3246b6e4dbb6', 'Bob, I did! And Saturn''s rings were just barely visible.', now(), now());

-- Comments on Gustav's pG5 (Interval training)
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('70418eda-7ef7-4365-bee0-eef6e3b3ced3', '4dba0c8b-33ce-43c2-802f-5942ee37c668', 'bff2018c-b130-4de4-b645-3246b6e4dbb6', 'Start with 1 minute hard, 2 minutes easy. Don''t overdo it!', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('82271520-f7b9-442a-b327-fc88eb824ecd', '4dba0c8b-33ce-43c2-802f-5942ee37c668', 'bff2018c-b130-4de4-b645-3246b6e4dbb6', 'Consistency is more important than intensity when you start.', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('0fc6c172-e602-4523-bd9c-0421a77dcfda', '4dba0c8b-33ce-43c2-802f-5942ee37c668', '1230ae30-dc4f-4752-bd84-092956f5c633', 'My idea of interval training is walking to the fridge and back.', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('7f2db5e0-f158-4718-a57d-6757f2786c42', '4dba0c8b-33ce-43c2-802f-5942ee37c668', '034485be-cfd2-48a7-b80d-f54773eab18c', 'I''ll interval train by kneading dough, that''s a workout right?', now(), now());
INSERT INTO comments (id, post_id, user_id, body, created_at, updated_at) VALUES ('b71147f9-737b-4ac4-a71c-6e52e2f3e429', '4dba0c8b-33ce-43c2-802f-5942ee37c668', '1230ae30-dc4f-4752-bd84-092956f5c633', 'Diana, definitely. Sourdough requires some serious muscle.', now(), now());


-- Insert follows (Keeping original follows)
INSERT INTO follows (follower_id, followee_id, created_at, updated_at) VALUES ('4b1193cc-7ba1-462c-99c5-2e3ea4ab6d14', '034485be-cfd2-48a7-b80d-f54773eab18c', now(), now());
INSERT INTO follows (follower_id, followee_id, created_at, updated_at) VALUES ('4b1193cc-7ba1-462c-99c5-2e3ea4ab6d14', '1230ae30-dc4f-4752-bd84-092956f5c633', now(), now());
INSERT INTO follows (follower_id, followee_id, created_at, updated_at) VALUES ('4b1193cc-7ba1-462c-99c5-2e3ea4ab6d14', 'bff2018c-b130-4de4-b645-3246b6e4dbb6', now(), now());
INSERT INTO follows (follower_id, followee_id, created_at, updated_at) VALUES ('1230ae30-dc4f-4752-bd84-092956f5c633', 'bff2018c-b130-4de4-b645-3246b6e4dbb6', now(), now());
INSERT INTO follows (follower_id, followee_id, created_at, updated_at) VALUES ('1230ae30-dc4f-4752-bd84-092956f5c633', '4b1193cc-7ba1-462c-99c5-2e3ea4ab6d14', now(), now());
INSERT INTO follows (follower_id, followee_id, created_at, updated_at) VALUES ('1230ae30-dc4f-4752-bd84-092956f5c633', '57ca1e6a-fc89-4d28-ad45-a1f351862cfc', now(), now());
INSERT INTO follows (follower_id, followee_id, created_at, updated_at) VALUES ('034485be-cfd2-48a7-b80d-f54773eab18c', '4b1193cc-7ba1-462c-99c5-2e3ea4ab6d14', now(), now());
INSERT INTO follows (follower_id, followee_id, created_at, updated_at) VALUES ('034485be-cfd2-48a7-b80d-f54773eab18c', 'bff2018c-b130-4de4-b645-3246b6e4dbb6', now(), now());
INSERT INTO follows (follower_id, followee_id, created_at, updated_at) VALUES ('034485be-cfd2-48a7-b80d-f54773eab18c', '1230ae30-dc4f-4752-bd84-092956f5c633', now(), now());
INSERT INTO follows (follower_id, followee_id, created_at, updated_at) VALUES ('57ca1e6a-fc89-4d28-ad45-a1f351862cfc', '034485be-cfd2-48a7-b80d-f54773eab18c', now(), now());
INSERT INTO follows (follower_id, followee_id, created_at, updated_at) VALUES ('57ca1e6a-fc89-4d28-ad45-a1f351862cfc', '4b1193cc-7ba1-462c-99c5-2e3ea4ab6d14', now(), now());
INSERT INTO follows (follower_id, followee_id, created_at, updated_at) VALUES ('57ca1e6a-fc89-4d28-ad45-a1f351862cfc', 'bff2018c-b130-4de4-b645-3246b6e4dbb6', now(), now());
INSERT INTO follows (follower_id, followee_id, created_at, updated_at) VALUES ('bff2018c-b130-4de4-b645-3246b6e4dbb6', '034485be-cfd2-48a7-b80d-f54773eab18c', now(), now());
INSERT INTO follows (follower_id, followee_id, created_at, updated_at) VALUES ('bff2018c-b130-4de4-b645-3246b6e4dbb6', '1230ae30-dc4f-4752-bd84-092956f5c633', now(), now());
INSERT INTO follows (follower_id, followee_id, created_at, updated_at) VALUES ('bff2018c-b130-4de4-b645-3246b6e4dbb6', '4b1193cc-7ba1-462c-99c5-2e3ea4ab6d14', now(), now());