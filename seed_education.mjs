// Seed education content from scraped data
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { readFileSync } from "fs";
import dotenv from "dotenv";

dotenv.config({ path: "/home/ubuntu/dinsmore-homestead/.env" });

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const conn = await mysql.createConnection(DATABASE_URL);
const db = drizzle(conn);

// Education content from scraped data
const EDUCATION_CONTENT = [
  {
    title: "Children's Lives 180 Years Ago",
    slug: "childrens-lives-180-years-ago",
    category: "lesson_plan",
    gradeLevel: "1st–3rd Grade",
    description: "Designed for students in First through Third Grades, this program allows children to imagine what it might have been like growing up in the Nineteenth Century. Less emphasis on the Dinsmore family itself and more emphasis on comparisons between yesterday and today.",
    content: `Designed for students in First through Third Grades, this program allows children to imagine what it might have been like growing up in the Nineteenth Century. For this reason, there is less of an emphasis on the Dinsmore family itself and more of an emphasis on comparisons between yesterday and today.

Activities included in this program are:
• Tour of the house focusing on artifacts & how they were used
• Hands-on chores that children would have done in the past
• Hands-on games, both indoor & outdoor, from the past
• Learn about children's clothing of the past

This lesson plan is designed to help students understand how children lived 180 years ago at the Dinsmore Homestead. Students will view videos about the house and its artifacts, then work individually or in groups to answer questions about particular artifacts. After viewing an additional video on the graveyard, students will compose a short explanatory essay on which artifact they think is the most important in their lives today, using examples from the videos and their own experience.

Learning Objectives:
- Compare and contrast daily life in the 1840s with life today
- Identify and describe artifacts from the 19th century
- Understand how technology has changed daily life
- Develop critical thinking skills through primary source analysis`,
    isPublished: true,
  },
  {
    title: "The Economy of Antebellum Kentucky Agriculture",
    slug: "economy-antebellum-kentucky-agriculture",
    category: "lesson_plan",
    gradeLevel: "4th–5th Grade",
    description: "Students will view an introductory video on Antebellum Kentucky Agriculture and create an organizer of the various groups that lived and worked on the Dinsmore farm. They will study primary sources to understand the lives of tenants, enslaved people, and farm owners.",
    content: `This lesson plan is designed for students in 4th and 5th grades. Students will view an introductory video, "Antebellum Kentucky Agriculture, Introduction," and create an organizer of the various groups that lived & worked on the Dinsmore farm.

They will then study the primary sources, "Identities," "Tenant & Day Laborer Accounts," "Enslaved People's Accounts" and "Martha Dinsmore's journal," to inform themselves on what primary sources can tell us about the lives of tenants, enslaved people, and farm owners and how they interacted.

Using a Graphic Organizer, students will analyze these primary sources and draw conclusions about the economic relationships between different groups on the farm.

Learning Objectives:
- Understand the economic structure of antebellum Kentucky agriculture
- Analyze primary source documents including account books and journals
- Compare the economic experiences of farm owners, tenants, day laborers, and enslaved people
- Develop skills in historical thinking and source analysis

Primary Sources Used:
- Dinsmore family account books (1842–1865)
- Martha Dinsmore's journal
- Tenant and day laborer account records
- Enslaved people's accounts from the Dinsmore records

Kentucky Academic Standards Alignment:
- Social Studies: SS-05-2.1.1, SS-05-2.1.2
- Reading: RI.5.1, RI.5.3, RI.5.6
- Writing: W.5.1, W.5.9`,
    isPublished: true,
  },
  {
    title: "The People Involved in Antebellum Kentucky Agriculture",
    slug: "people-antebellum-kentucky-agriculture",
    category: "lesson_plan",
    gradeLevel: "4th–5th Grade",
    description: "Students will view an introductory video describing the various groups living and working on the Dinsmore farm and study the identities of various men, women, and children who actually lived and/or worked on the farm in the 1840s and 1850s.",
    content: `This lesson plan is designed for students in 4th and 5th grades.

Students will view an introductory video describing the various groups living and working on the Dinsmore farm — a farm that was typical of large Boone County farms in what it raised and the laborers that were employed.

They will then study the identities of various men, women, and children who actually lived and/or worked on the farm in the 1840s and 1850s. As they view the video, "Outbuildings," they will create a graphic organizer that identifies the different types of workers and their roles.

The People Who Lived and Worked on Antebellum Kentucky Farms:

Farm Owners: James and Martha Dinsmore were the farm owners. James considered himself a "scientific farmer" who read the latest agricultural journals and applied modern methods to his farm.

Enslaved People: The Dinsmore family enslaved between 12 and 16 people at various times. The 1850 census shows 16 enslaved people; the 1860 census shows 12. These individuals performed domestic work, farm labor, and skilled trades.

Tenant Farmers: White tenant farmers lived on portions of the Dinsmore land and farmed it in exchange for a share of the crops.

Day Laborers: Both white and free Black day laborers were hired for specific tasks, especially during planting and harvest seasons.

Learning Objectives:
- Identify the different groups of people who lived and worked on antebellum Kentucky farms
- Understand the social hierarchy of 19th-century farm life
- Analyze primary sources to learn about individual lives
- Develop empathy and historical perspective

Kentucky Academic Standards Alignment:
- Social Studies: SS-05-2.1.1, SS-05-4.1.1
- Reading: RI.5.1, RI.5.6, RI.5.9
- Writing: W.5.1, W.5.2`,
    isPublished: true,
  },
  {
    title: "School & Group Programs",
    slug: "school-group-programs",
    category: "program",
    gradeLevel: "K–12",
    description: "Bring history to life at the Dinsmore Farm! A visit to our indoor/outdoor museum will allow your students to experience how men, women, and children lived in the 19th and early 20th centuries.",
    content: `Bring history to life at the Dinsmore Farm! A visit to our indoor/outdoor museum will allow your students to experience how men, women, and children lived in the 19th and early 20th centuries. Our museum is a unique site that encapsulates local, regional, and national history from the antebellum era to the early twentieth century.

We have several programs to choose from depending on the age of your students. However, you should not feel limited by these programs. We can alter an existing program to fit with your curriculum or we can visit your classroom.

Programs Available:

Children's Lives 180 Years Ago (Grades 1–3)
This program allows children to imagine what it might have been like growing up in the Nineteenth Century. Activities include a tour of the house focusing on artifacts, hands-on chores from the past, indoor and outdoor games from the past, and learning about children's clothing.

Antebellum Kentucky Agriculture (Grades 4–5)
Students explore the economic and social structure of 19th-century farm life, studying primary sources including account books, journals, and records of enslaved people.

The Civil War and Its Aftermath (Grades 6–8)
Students examine Kentucky's unique position during the Civil War as a border state, the experiences of enslaved people, and the transition to freedom after 1865.

The Progressive Era and Early 20th Century (Grades 9–12)
Advanced students explore the connections between the Dinsmore family and national figures including Theodore Roosevelt, Eleanor Roosevelt, and Isabella Greenway.

Scheduling Information:
- Programs run approximately 2 hours
- Maximum group size: 30 students
- Cost: Please contact us for current pricing
- Contact: (859) 586-6117 or ccollopy@dinsmorehomestead.org`,
    isPublished: true,
  },
  {
    title: "Scout Programs",
    slug: "scout-programs",
    category: "program",
    gradeLevel: "All Ages",
    description: "Because our site is both indoors and outdoors, we offer a range of activities for Boy Scouts and Girl Scouts of all ages.",
    content: `Over the years Dinsmore has been grateful to have benefited from the Eagle Scout Program. Because our site is both indoors and outdoors, we offer a range of activities for Boy Scouts and Girl Scouts of all ages.

Boy Scouts Badge Opportunities:
- American Cultures
- American Heritage
- Bird Study

Girl Scouts Badge Opportunities:
- Outdoor Art Maker
- Outdoor Art Apprentice
- Playing the Past

Eagle Scout Projects:
The Dinsmore Homestead has hosted numerous Eagle Scout projects over the years, including restoration of historic structures, trail building, and archival work. We welcome proposals for new Eagle Scout projects that support our preservation mission.

To schedule a scout program or discuss an Eagle Scout project, please contact the main office at (859) 586-6117 or email ccollopy@dinsmorehomestead.org.`,
    isPublished: true,
  },
  {
    title: "Summer Programs: Pioneer-to-the-Past Daycamp",
    slug: "summer-programs",
    category: "program",
    gradeLevel: "Ages 6–12",
    description: "Join us at the Dinsmore Homestead for an adventurous summer camp exploring great events from American History — no technology needed!",
    content: `Pioneer-to-the-Past Daycamp

Join us at the Dinsmore Homestead for an adventurous summer camp exploring great events from American History — no technology needed! Blaze a trail through the wilderness with Lewis and Clark, celebrate the 4th of July at a turn-of-the-century fair, and cool off at the local swimming hole! Don't miss this once-in-a-lifetime chance to participate in events from days gone by.

Camp Activities Include:
- Historical role-playing and living history demonstrations
- Hands-on crafts and skills from the 19th century
- Outdoor exploration of the 30-acre historic farm
- Games and activities from the past
- Stories and songs from American history

Camp Sessions:
Session One: June 16–20, 9:00 am to 1:00 pm
Session Two: July 14–18, 9:00 am to 1:00 pm

For registration information and current pricing, please contact us at (859) 586-6117.`,
    isPublished: true,
  },
  {
    title: "Dinsmore Dispatch Newsletters",
    slug: "dinsmore-dispatch-newsletters",
    category: "newsletter",
    gradeLevel: "All",
    description: "The Dinsmore Dispatch is our quarterly newsletter covering homestead news, historical research, upcoming events, and preservation updates.",
    content: `The Dinsmore Dispatch is the official newsletter of the Dinsmore Homestead Foundation. Published quarterly, it covers the latest news from the homestead, ongoing historical research, upcoming events, and preservation updates.

Available Issues:
- Dinsmore Dispatch, Spring 2020
- Dinsmore Dispatch, Summer 2020
- Dinsmore Dispatch, Fall 2020
- Dinsmore Dispatch, Winter 2020
- Dinsmore Dispatch, Spring 2017
- Dinsmore Dispatch, Nov-Dec 2016
- Dinsmore Dispatch, Sept-Oct 2016

To receive future issues of the Dinsmore Dispatch, please contact us at (859) 586-6117 or visit the homestead to sign up for our mailing list.`,
    isPublished: true,
  },
  {
    title: "Primary Sources: Dinsmore Family Letters & Journals",
    slug: "primary-sources-letters-journals",
    category: "research",
    gradeLevel: "6th Grade and Up",
    description: "The Dinsmore family left behind an extraordinary collection of letters, journals, and poetry spanning more than a century. These primary sources provide an unparalleled window into 19th-century American life.",
    content: `The Dinsmore family left behind an extraordinary collection of letters, journals, and poetry spanning more than a century. These primary sources provide an unparalleled window into 19th-century American life, from the perspective of a prosperous Kentucky farm family with connections to national figures.

Julia Stockton Dinsmore's Diaries:
Julia kept detailed diaries for much of her adult life, recording daily farm operations, weather, family news, and her observations on the wider world. Her diaries are a remarkable record of rural Kentucky life from the 1860s through the early 20th century.

The Dinsmore-Flandrau Correspondence:
The letters exchanged between the Dinsmore family and the Flandrau family in Minnesota provide a vivid picture of family life across two states in the 19th century.

Isabella Selmes Ferguson Greenway King Papers:
Isabella's papers include correspondence with Theodore Roosevelt, Eleanor Roosevelt, and other prominent figures of the early 20th century. Her letters document her remarkable career as a congresswoman, businesswoman, and humanitarian.

Account Books and Farm Records:
The Dinsmore family kept meticulous records of farm operations, including accounts of enslaved people, tenant farmers, and day laborers. These records are invaluable for understanding the economic and social history of antebellum Kentucky.

Using These Sources in the Classroom:
These primary sources are ideal for teaching historical thinking skills, including source analysis, contextualization, and corroboration. Contact us for guidance on incorporating these materials into your curriculum.`,
    isPublished: true,
  },
];

// Insert into database
try {
  for (const item of EDUCATION_CONTENT) {
    await conn.execute(
      `INSERT INTO education_content (title, slug, category, gradeLevel, description, content, isPublished, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
       ON DUPLICATE KEY UPDATE
       title = VALUES(title),
       description = VALUES(description),
       content = VALUES(content),
       isPublished = VALUES(isPublished),
       updatedAt = NOW()`,
      [item.title, item.slug, item.category, item.gradeLevel, item.description, item.content, item.isPublished ? 1 : 0]
    );
    console.log(`✓ Seeded: ${item.title}`);
  }
  console.log(`\nSeeded ${EDUCATION_CONTENT.length} education content items`);
} catch (err) {
  console.error("Error seeding:", err.message);
} finally {
  await conn.end();
}
