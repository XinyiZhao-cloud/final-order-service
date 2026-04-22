# Order Service
# CST8915: Cloud-Native App for Best Buy

**Student Name**: Xinyi Zhao    
**Student ID**: 040953633    
**Course**: CST8915 Full-stack Cloud-native Development  
**Semester**: Winter 2026   

## Overview
The Order Service handles customer order creation, retrieval, and status updates for the Best Buy cloud-native application.

## Responsibilities
- Create new orders during checkout
- Retrieve all orders for the admin dashboard
- Update order status
- Delete or reset orders for testing and demo purposes

## Tech Stack
- Node.js
- Express.js
- Docker
- Azure Kubernetes Service (AKS)

## API Endpoints
- `GET /` — Health check
- `GET /orders` — Retrieve all orders
- `POST /orders` — Create a new order
- `PUT /orders/:id` — Update order status
- `DELETE /orders/:id` — Delete an order
- `POST /reset-orders` — Reset all orders

## Deployment
This service is containerized using Docker and deployed to AKS.

## CI/CD
A GitHub Actions workflow is used to:
- Build the Docker image
- Push the image to Docker Hub
- Restart the Kubernetes deployment automatically

## Notes
This service currently uses in-memory storage, so order data is reset when the pod restarts.
