# MERN Stack RBAC System - DevOps Project

## Description

This project is a MERN Stack application (MongoDB, Express.js, React.js, Node.js) implementing a Role-Based Access Control (RBAC) system.

The application is containerized using Docker and integrated with a DevOps workflow including CI/CD, monitoring, and alerting.

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
        -------------------------------------
        |                  |                |
        |                  |                |
 Node Exporter          cAdvisor       AlertManager
        |                  |
        |                  |
   Linux Host       Docker Containers
                            |
                            |
                    MERN Application
                            |
              React → Express → MongoDB



---

# Features

## Application

- User authentication
- Role-Based Access Control (RBAC)
- Protected routes
- CRUD operations
- REST API

## DevOps

- Dockerized frontend, backend, and database
- Docker Compose orchestration
- Automated Docker image building
- CI pipeline with GitHub Actions
- Monitoring dashboards
- Resource usage alerts

---

# Technologies

## Development

- React.js
- Node.js
- Express.js
- MongoDB
- JWT Authentication

## DevOps

- Linux
- Docker
- Docker Compose
- GitHub Actions
- Docker Hub

## Monitoring

- Prometheus
- Grafana
- Node Exporter
- cAdvisor
- AlertManager

---

# Run the Project

## Clone repository

```bash
git clone <repository-url>
cd RBAC-system

## Start application with Docker Compose
docker compose up -d

### Check running containers
docker ps

## Access services

Frontend: http://localhost:3000

Backend: http://localhost:5000

Prometheus: http://localhost:9090

Grafana: http://localhost:3001

Monitoring

Prometheus collects metrics from:

Linux host using Node Exporter
Docker containers using cAdvisor

Grafana provides dashboards for:

CPU usage
Memory usage
Disk usage
Network traffic
Container resources

AlertManager manages alerts for:

High CPU usage
High memory usage
Low disk space
Container failures


CI/CD Pipeline
Workflow:

Developer
    |
    v
GitHub Repository
    |
    v
GitHub Actions
    |
    v
Build Docker Images
    |
    v
Push Images to Docker Hub
    |
    v
Deployment

