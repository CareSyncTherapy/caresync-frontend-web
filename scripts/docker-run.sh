#!/bin/bash

# CareSync Docker Runner Script
# This script helps run the CareSync application in Docker

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker and try again."
    exit 1
fi

# Function to run production build
run_production() {
    print_status "Building and running CareSync in production mode..."
    docker-compose up --build -d
    print_status "CareSync is running on http://localhost"
    print_status "Backend API is available on http://localhost:5000"
}

# Function to run development build
run_development() {
    print_status "Building and running CareSync in development mode..."
    docker-compose -f docker-compose.dev.yml up --build
}

# Function to stop containers
stop_containers() {
    print_status "Stopping CareSync containers..."
    docker-compose down
    docker-compose -f docker-compose.dev.yml down
    print_status "Containers stopped."
}

# Function to view logs
view_logs() {
    print_status "Showing logs..."
    docker-compose logs -f
}

# Function to clean up
cleanup() {
    print_status "Cleaning up Docker resources..."
    docker-compose down -v
    docker-compose -f docker-compose.dev.yml down -v
    docker system prune -f
    print_status "Cleanup complete."
}

# Main script logic
case "${1:-help}" in
    "prod"|"production")
        run_production
        ;;
    "dev"|"development")
        run_development
        ;;
    "stop")
        stop_containers
        ;;
    "logs")
        view_logs
        ;;
    "cleanup")
        cleanup
        ;;
    "help"|*)
        echo "CareSync Docker Runner"
        echo ""
        echo "Usage: $0 [command]"
        echo ""
        echo "Commands:"
        echo "  prod|production  - Run in production mode (port 80)"
        echo "  dev|development  - Run in development mode (port 3000)"
        echo "  stop            - Stop all containers"
        echo "  logs            - View container logs"
        echo "  cleanup         - Clean up Docker resources"
        echo "  help            - Show this help message"
        echo ""
        echo "Examples:"
        echo "  $0 prod         # Run production build"
        echo "  $0 dev          # Run development build"
        echo "  $0 stop         # Stop containers"
        ;;
esac 