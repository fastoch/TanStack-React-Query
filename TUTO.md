src = https://www.youtube.com/watch?v=e74rB-14-m8  

date = January 2025

# Intro

In this comprehensive tutorial, we dive into the core features of React Query (now known as TanStack React Query),
and demonstrate how it simplifies **data fetching** and **state management** in your React applications.  

We'll delve into advanced topics like **caching**, **data invalidation**, and working with **mutations** to create and update data.  

# Why do we need TanStack Query?

- Because "**state management**" in a React app can be very complex.  
- Because constant "**refetching**" kills our app's performance

"TanStack React Query is the ultimate tool for effortless data fetching, caching, and real-time updates."  

# Project setup

- open a new folder in VSCodium
- run `npm create vite@latest`
- project name = `.` (cureent folder)
- framework = React
- variant = TypeScript
- run `npm i`
- install TanStack via `npm i @tanstack/react-query`

Once TanStack has been installed, open the **entry point** of your app, most likely `/src/main.tsx`.  
There, we need to define the **query client**.  
We have to do that at the highest level of our application, so the entire project has access to React Query.  

