# FinNova — Smart Expense Tracker & Budget Planner

> A modern AI-assisted personal finance management application focused on budgeting, expense tracking, savings management, and financial awareness.

---

# Project Banner

![Project Banner](https://github.com/basaaria123/FinNova/blob/main/FinNova%20exceptional%20.png?raw=true)

---

# Product Overview

FinNova is a smart expense tracking and budgeting application designed to help users monitor spending habits, manage budgets, and improve financial awareness through a clean and intuitive mobile interface.

The application simplifies personal finance management by enabling users to:
- Track daily expenses
- Set and monitor monthly budgets
- Analyze spending trends
- Create savings goals
- View smart financial insights

FinNova was developed using **Lovable**, an AI-assisted development platform that accelerated rapid prototyping, modular system development, and responsive UI implementation.

---

# UN SDG Global Impact Alignment

## SDG 1 — No Poverty
FinNova promotes responsible financial management and budgeting discipline, helping users reduce unnecessary spending and improve financial stability.

## SDG 4 — Quality Education
The application increases financial literacy by helping users understand spending behavior and budgeting practices through analytics and insights.

## SDG 8 — Decent Work & Economic Growth
By encouraging organized financial planning and savings habits, FinNova contributes toward improved economic productivity and personal financial well-being.

---

# Problem Statement

Many students and young professionals struggle to:
- Monitor daily expenses
- Maintain savings discipline
- Understand spending patterns
- Use overly complicated budgeting applications

Traditional finance applications often contain unnecessary complexity and poor usability for beginner users.

FinNova addresses these issues through:
- Simple expense management
- Budget monitoring
- Savings goal management
- Financial analytics dashboards

---

# Key Features

## 1. Smart Expense Tracking
Users can:
- Add and manage daily expenses
- Categorize transactions
- Track financial history
- Add optional expense notes

### Supported Categories
- Food
- Transport
- Shopping
- Entertainment
- Bills
- Health
- Education
- Other

---

## 2. Budget Management
Features include:
- Monthly budget setup
- Budget usage monitoring
- Remaining balance tracking
- Category-wise spending analysis

---

## 3. Savings Goals
Users can:
- Create savings targets
- Monitor progress
- Track milestone completion

### Example Goals
- Vacation Fund
- Emergency Savings
- Education Fund

---

## 4. Insights & Analytics
The analytics system provides:
- Spending trend visualization
- Financial behavior insights
- Category spending analysis
- 14-day spending trend charts

---

## 5. User Profile & Settings
Users can manage:
- Profile information
- Currency preferences
- Theme settings
- Notification settings
- Savings targets

---

# Technology Stack

| Technology | Purpose |
|---|---|
| Lovable | AI-assisted application development |
| Responsive UI Components | Modern interface design |
| Modular Architecture | Maintainability & scalability |
| Data Visualization Components | Financial insights & analytics |

---

# Software Development Life Cycle (SDLC) Journey

## 1. Planning Phase
- Identified financial management challenges
- Defined target users
- Planned project scope and features

---

## 2. Requirement Analysis
Defined:
- Functional requirements
- Non-functional requirements
- User expectations
- Budget tracking workflows

---

## 3. System Design
Designed:
- UI/UX layouts
- Navigation structure
- Analytics dashboards
- Modular architecture

---

## 4. Development & Implementation
Implemented:
- Expense tracking modules
- Savings systems
- Budget management features
- Insights dashboards

---

## 5. Testing & Resilience
Tested:
- Input validation
- Error handling
- Edge case handling
- Navigation stability
- Responsive layouts

---

## 6. Refactoring & Optimization
Improved:
- Code modularity
- UI responsiveness
- Performance optimization
- Reusable component structure

---

## 7. Deployment Preparation
Finalized:
- UI consistency
- Responsiveness verification
- Code cleanup
- Future scalability planning

---

# Installation Guide

## Prerequisites

Ensure the following tools are installed:
- Git
- Node.js
- npm or yarn

---

## Clone Repository

```bash
git clone https://github.com/basaaria123/FinNova.git
```

---

## Navigate Into Project Folder

```bash
cd FinNova
```

---

## Install Dependencies

```bash
npm install
```

or

```bash
yarn install
```

---

## Run Development Server

```bash
npm run dev
```

or

```bash
yarn dev
```

---

# Visual Architecture

## FinNova System Architecture

```text
                          ┌─────────────────────────┐
                          │        User Layer       │
                          │ Students / Professionals│
                          └────────────┬────────────┘
                                       │
                                       ▼
┌──────────────────────────────────────────────────────────────┐
│                    FinNova Mobile Interface                 │
│-------------------------------------------------------------│
│  • Home Dashboard                                           │
│  • Budget Overview                                          │
│  • Add Expense Screen                                       │
│  • Insights & Analytics                                     │
│  • Profile & Settings                                       │
└───────────────────────────┬──────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────┐
│                   Application Logic Layer                   │
│-------------------------------------------------------------│
│  • Expense Management Engine                                │
│  • Budget Calculation System                                │
│  • Savings Goal Manager                                     │
│  • Analytics & Insights Processor                           │
│  • Validation & Error Handling                              │
└───────────────────────────┬──────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────┐
│                     Data Management Layer                   │
│-------------------------------------------------------------│
│  • Transaction Records                                      │
│  • Budget Data                                              │
│  • Savings Goals                                            │
│  • User Preferences                                         │
│  • Settings & Notifications                                 │
└───────────────────────────┬──────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────┐
│                     Visualization Layer                     │
│-------------------------------------------------------------│
│  • Spending Trend Charts                                    │
│  • Category Breakdown Graphs                                │
│  • Budget Progress Indicators                               │
│  • Smart Financial Insights                                 │
└──────────────────────────────────────────────────────────────┘
```

---

# Navigation Architecture

## FinNova Application Navigation Flow

```text
                           ┌──────────────┐
                           │ Splash Screen│
                           └──────┬───────┘
                                  │
                                  ▼
                        ┌──────────────────┐
                        │ Home Dashboard   │
                        │------------------│
                        │ • Monthly Spend  │
                        │ • Weekly Spend   │
                        │ • Budget Status  │
                        │ • Transactions   │
                        └───┬──────┬───────┘
                            │      │
        ┌───────────────────┘      └───────────────────┐
        ▼                                              ▼

┌─────────────────┐                         ┌─────────────────┐
│ Budget Overview │                         │ Add Expense     │
│-----------------│                         │-----------------│
│ • Monthly Budget│                         │ • Enter Amount  │
│ • Spending Bars │                         │ • Select Category│
│ • Category Data │                         │ • Pick Date     │
└────────┬────────┘                         │ • Add Notes     │
         │                                  └────────┬────────┘
         │                                           │
         ▼                                           ▼

┌─────────────────────────────────────────────────────────────┐
│                    Expense Database                        │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼

┌─────────────────┐                         ┌─────────────────┐
│ Insights Screen │                         │ Profile Screen  │
│-----------------│                         │-----------------│
│ • Smart Insights│                         │ • User Details  │
│ • Trend Graphs  │                         │ • Savings Goals │
│ • Pie Charts    │                         │ • Settings      │
│ • Analytics     │                         │ • Notifications │
└─────────────────┘                         └─────────────────┘
```

---

# Screen Flow Mapping

```text
Home Dashboard
     │
     ├── Budget Overview
     │       ├── Monthly Budget
     │       └── Category Spending
     │
     ├── Add Expense
     │       ├── Amount Entry
     │       ├── Category Selection
     │       ├── Date Picker
     │       └── Notes Input
     │
     ├── Insights & Analytics
     │       ├── Smart Insights
     │       ├── Spending Trend Graph
     │       └── Category Breakdown
     │
     └── Profile & Settings
             ├── Savings Goals
             ├── Notifications
             ├── Currency Settings
             └── Theme Preferences
```

---

# User Interaction Workflow

```text
User Opens App
        │
        ▼
View Dashboard Summary
        │
        ▼
Add Expense Transaction
        │
        ▼
Expense Saved to Database
        │
        ▼
Budget Automatically Updated
        │
        ▼
Analytics & Charts Generated
        │
        ▼
User Monitors Insights & Savings Goals
```

---

# Testing & Resilience Engineering

## Validation Features
- Empty input prevention
- Numeric validation
- Negative amount restriction
- Required field checks

---

## Error Handling
- Null safety checks
- Graceful fallback handling
- Protected navigation routing
- Controlled state management

---

## Edge Case Testing

| Test Scenario | Expected Result | Outcome |
|---|---|---|
| Empty expense field | Validation warning displayed | Passed |
| Negative amount entered | Input rejected | Passed |
| Invalid profile information | Error message shown | Passed |
| Missing stored data | Default values loaded | Passed |
| Rapid repeated actions | Stable navigation maintained | Passed |

---

# Final Gallery

## Main Application Screens
- Home Dashboard
- Budget Overview
- Add Expense Screen
- Insights & Analytics
- Savings Goals
- Profile & Settings

---

# UI Preview

### Splash Screen
![Splash Screen](https://github.com/basaaria123/FinNova/blob/main/Splash%20Screen.jpeg?raw=true)

### Dashboard Interface
![Dashboard](https://github.com/basaaria123/FinNova/blob/main/Dashboard.jpeg?raw=true)

### Budget Overview
![Budget Overview](https://github.com/basaaria123/FinNova/blob/main/Budget%20Overview.jpeg?raw=true)

### Add Expenses 
![Add Expenses](https://github.com/basaaria123/FinNova/blob/main/Add%20Expense.jpeg?raw=true)

### Analytics Dashboard
![Insights](https://github.com/basaaria123/FinNova/blob/main/Smart%20Insights.jpeg?raw=true)

### Profile Screen
![Profile](https://github.com/basaaria123/FinNova/blob/main/Profile.jpeg?raw=true)

---

# Refactoring & Optimization

Throughout development, the following improvements were implemented:
- Modularized UI components
- Improved navigation flow
- Removed redundant code
- Centralized validation logic
- Optimized responsive layouts
- Enhanced maintainability

---

# Future Improvements

Planned future enhancements include:
- Cloud synchronization
- Scanning the input from receipts
- Advanced analytics dashboards
- PDF/CSV export support
- Real-time notifications
- Multi-device synchronization
- Secure authentication integration

---

# Version

```bash
Current Version: 3.0.0
```

---

# License

This project is intended for educational and development purposes.

---

# Team Members

- Basaaria Imroz - CSE:AIML(A)
- Mehraj Valliya - CSE:AIML(A)

---

# Conclusion

FinNova demonstrates the successful implementation of a modern smart expense tracking system developed through a structured Software Development Life Cycle (SDLC) process.

The project combines:
- AI-assisted development
- Clean UI/UX principles
- Financial awareness tools
- Responsive design
- Modular architecture

to deliver a scalable and user-friendly budgeting application focused on improving personal financial management.
