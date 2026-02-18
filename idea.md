# Social Media Content Sharing Platform

## Problem Statement
Developing a robust metadata-driven backend architecture for a social media platform requires careful consideration of scalability, data integrity, and maintainability. Many student projects focus heavily on UI, neglecting the crucial architectural patterns and data handling strategies that make real-world applications successful. This project addresses the need for a clean, layered backend design capable of handling core social media interactions efficiently while applying strong Software Engineering principles.

## Project Scope
This project focuses on the backend architecture and system design of a simplified social media content sharing platform. The scope is strictly limited to essential features to allow for depth in architectural implementation (Clean Code, OOP, SOLID) rather than breadth of features.

**Scope Boundary:** Backend API design, Database Schema, and System Architecture documentation only. Frontend implementation is out of scope for this milestone.

## Key Features
1.  **User Management**: Registration, Login, and Authentication.
2.  **Content Creation**: Users can create posts with image URLs and captions.
3.  **Feed Generation**: Simplified personalized feed of posts from followed users.
4.  **Social Graph**: Follow and Unfollow functionality.
5.  **Engagement**: Like and Unlike posts.
6.  **Discussions**: Comment on posts.

## Non-goals (Out of Scope)
*   Direct Messaging (DM) / Chat
*   Stories or Ephemeral Content
*   Video Processing / Storage
*   Advanced Search / Explore Algorithms
*   Push Notifications
*   Mobile App / Frontend Implementation

## Target Users
*   **Content Creators**: Users sharing photos and updates.
*   **Social Consumers**: Users viewing feeds and interacting with content.
*   **System Administrators**: (Implicit) Managing platform health.

## High-level Architecture Overview
The system follows a strict **Layered Architecture** (Controller-Service-Repository) to ensure Separation of Concerns and maintainability.

*   **Presentation Layer (Controllers)**: Handles HTTP requests, input validation, and sends responses.
*   **Business Logic Layer (Services)**: Contains core business rules, transaction management, and complex operations.
*   **Data Access Layer (Repositories)**: Abstracts database interactions, providing a clean interface for data CRUD operations.
*   **Data Layer (Database)**: Relational database storing persistent data.
*   **Models/Entities**: Represents data structures and domain objects.

## Technology Stack (Generic)
*   **Backend Framework**: RESTful API Framework (e.g., Express.js, Spring Boot, Django)
*   **Database**: Relational Database Management System (e.g., PostgreSQL, MySQL)
*   **Diagraming**: Mermaid.js for design documentation
*   **Authentication**: JWT (JSON Web Tokens) or Session-based auth

## Why this design demonstrates good Software Engineering
1.  **Separation of Concerns**: Each layer has a distinct responsibility, preventing "God Classes" and spaghetti code.
2.  **Scalability**: The layered approach allows independent scaling of components (e.g., caching service layer).
3.  **Maintainability**: Changes in the database schema (Repository layer) do not affect the Controller layer directly.
4.  **Testability**: Business logic (Service layer) can be unit tested in isolation by mocking Repositories.
5.  **OOP Principles**: Utilizes Encapsulation (Services hiding logic), Inheritance (Base classes for Models), and Polymorphism (Interface-based Repositories where applicable).
