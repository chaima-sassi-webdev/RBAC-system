<img width="1164" height="1122" alt="Backend API" src="https://github.com/user-attachments/assets/3d9ddd30-a0a6-4ac2-b557-1d1b52e5cb84" />
<img width="1854" height="1082" alt="Interface Frontend React" src="https://github.com/user-attachments/assets/22b8efc3-9d09-4a11-a7a2-8435971110bf" />
<img width="1414" height="191" alt="Containers actifs" src="https://github.com/user-attachments/assets/af772195-d7f2-4ff8-9f98-1839ab224f03" />
<img width="1165" height="423" alt="Images publiées" src="https://github.com/user-attachments/assets/6915af62-ef40-428b-b4e0-5c6610aa9673" />
<img width="1165" height="1008" alt="Pipeline réussi" src="https://github.com/user-attachments/assets/e77152b7-2db4-47fb-acba-9d0534ba75d9" />
<img width="1165" height="679" alt="Targets Prometheus" src="https://github.com/user-attachments/assets/f4f17ead-1c3a-4614-ab9a-4982a812885f" />
<img width="1849" height="1063" alt="dashboard système" src="https://github.com/user-attachments/assets/0c41a0be-7e31-413d-b5ca-5db471e278ce" />
<img width="1849" height="1063" alt="Dashboard Docker" src="https://github.com/user-attachments/assets/d475f632-c329-448a-9006-956a7ab540ab" />
<img width="922" height="421" alt="alert manager" src="https://github.com/user-attachments/assets/5bc2c1a5-e188-44dc-acd5-1c89f7a35d4b" />
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
