## Overview

The habits app is a mobile app designed for users to track habits. It is meant to reinforce good habits and identify bad ones. It is designed for ios and android with a sleek, clean and modern ui.

## Experience

Each day, the user can fill out a set of fields. That will save for the user locally. They will be ablle to look back on past days to see trends. They can also see weekly and monthly breakdowns. The user can set goals (daily, weekly monthly) of things they want to accomplish. Then they can see how they do with meeting them. The user will get a daily reminder to fill it out.

## Daily Fields

Here are the core things to track. Leave room to add more.

- "To I felt" - A field with some defaults like "good", "GReat", "ok", "bad", "terrible". But allow the user to add a custom one as well. They should be able to reuse custom tags later. They should be able to pick more than one for the day. Tags should have different colors.
- "I went to bed at" simple time field
- "I woke up at" simple time field
- "Today I ate" calorie number field and a text field where they can write foods
- "Today I read for" number field for number of minutes
- "I prayed today" checkbox
- "I read the Bible today" checkbox

## user settings

The user should be able to:

- See and adjust tags for how they felt (both text and color)
- Set a time for when they get their reminder.
- Choose what things will be available in the fields. Anything they dont will will not be show and just count as null for that day. If they change the settings the fields will switch the next time they fill it out.
- A set of "Today I" options that they can customize. They will show up as checkboxes in the daily report. They can write in custom things they want to track if they did or not.
- Set goals. Based on all default daily fields and custom checkbox options they have added, they can set goals. This will be a simple number showing how many times they did that thing per week or month.

## Previous days

They should be able to see their current week, and see the current month in a calendar view. These will just be broad overviews, showing colors of the 'today I felt' tags. If they click on a day, they can see an overview of the days stats. They can also see monthly and weekly running totals + averages, and see how often they met their goals.

## Reports

They should see a report at the start of each week and month, showing how they are doing. It is meant to be positive, highlighting goals and trends.

## Stack

- Vue3 (composition api)
- Ideally vite (but I have not made a mobile app so if vite doesn't work use something else. Prefer vite)
- tailwind

This app should build for ios and android, but should be able to run dev locally on a mac.
