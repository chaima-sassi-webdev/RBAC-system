# MERN Stack RBAC System - DevOps Project

## Overview

This project is a full-stack MERN (MongoDB, Express.js, React.js, Node.js) application implementing a Role-Based Access Control (RBAC) system.

The application is containerized with Docker and integrated into a DevOps workflow including:

- Continuous Integration (CI/CD)
- Container orchestration
- Monitoring
- Alerting
---

## Architecture

The project contains:

- Frontend: React.js
- Backend: Node.js + Express.js
- Database: MongoDB
- Containerization: Docker & Docker Compose
- CI/CD: GitHub Actions
- Monitoring:
  - Prometheus
  - Grafana
  - Node Exporter
  - cAdvisor
  - AlertManager

Architecture:

                   Grafana
                       |
                       |
                  Prometheus
                       |
        --------------------------------
        |              |               |
        |              |               |
 Node Exporter      cAdvisor      AlertManager
        |              |
        |              |
   Linux Host    Docker Containers
                       |
                       |
                MERN Application
                       |
          React → Express → MongoDB

### DevOps

- Dockerized frontend, backend, and database
- Multi-container deployment using Docker Compose
- Automated Docker image building
- CI pipeline with GitHub Actions
- Docker image publishing
- Monitoring dashboards
- Resource usage alerts

---

## Technologies

### Development

- React.js
- Node.js
- Express.js
- MongoDB
- JWT Authentication

### DevOps

- Linux
- Docker
- Docker Compose
- GitHub Actions
- Docker Hub

### Monitoring

- Prometheus
- Grafana
- Node Exporter
- cAdvisor
- AlertManager

---

## Installation & Running

### Clone Repository

```bash
git clone <repository-url>
cd RBAC-system
```

### Start Application

```bash
docker compose up -d
```

### Check Running Containers

```bash
docker ps
```

---

## Services

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5000 |
| Prometheus | http://localhost:9090 |
| Grafana | http://localhost:3001 |

---

## Monitoring

Prometheus collects metrics from:

- Linux host using Node Exporter
- Docker containers using cAdvisor


Grafana dashboards display:

- CPU usage
- Memory usage
- Disk usage
- Network traffic
- Container resources


AlertManager handles alerts for:

- High CPU usage
- High memory usage
- Low disk space
- Container failures

---

## CI/CD Pipeline

Workflow:

```text
Developer
    |
    v
GitHub Repository
    |
    v
GitHub Actions
    |
    v
Build & Test
    |
    v
Build Docker Images
    |
    v
Push Images to Docker Hub
    |
    v
Deployment
```

---

## Useful Docker Commands

### View containers

```bash
docker ps
```

### View logs

```bash
docker logs <container_name>
```

### Restart services

```bash
docker compose restart
```

### Stop application

```bash
docker compose down
```

---

## Project Objective

The objective of this project is to demonstrate the implementation of a production-like MERN application using modern DevOps practices:

- Containerization
- CI/CD automation
- Monitoring
- Alerting
- Deployment workflow