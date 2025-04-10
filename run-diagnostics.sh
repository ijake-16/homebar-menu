#!/bin/bash

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}==============================================${NC}"
echo -e "${BLUE}        MongoDB & API Diagnostic Tool        ${NC}"
echo -e "${BLUE}==============================================${NC}"
echo

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed. Please install Node.js to run the diagnostic tests.${NC}"
    exit 1
fi

# Check if MongoDB connection string is provided
if [ -z "$MONGODB_URI" ]; then
    echo -e "${YELLOW}Warning: MONGODB_URI environment variable is not set.${NC}"
    echo -e "Please set your MongoDB connection string with:"
    echo -e "${BLUE}export MONGODB_URI='mongodb+srv://username:password@cluster.mongodb.net/database'${NC}"
    echo
    read -p "Do you want to enter your MongoDB connection string now? (y/n): " SET_MONGO
    if [[ $SET_MONGO == "y" || $SET_MONGO == "Y" ]]; then
        read -p "Enter your MongoDB connection string: " MONGODB_URI
        export MONGODB_URI
    fi
    echo
fi

# Check if API_URL is provided
if [ -z "$API_URL" ]; then
    echo -e "${YELLOW}Warning: API_URL environment variable is not set. Using default (http://localhost:8000).${NC}"
    echo -e "If your API is at a different location, please set with:"
    echo -e "${BLUE}export API_URL='http://your-api-url'${NC}"
    echo
    read -p "Do you want to enter your API URL now? (y/n): " SET_API
    if [[ $SET_API == "y" || $SET_API == "Y" ]]; then
        read -p "Enter your API URL (including http:// or https://): " API_URL
        export API_URL
    else
        export API_URL="http://localhost:8000"
    fi
    echo
fi

# System info
echo -e "${BLUE}System Information:${NC}"
echo -e "OS: $(uname -a)"
echo -e "Node.js: $(node -v)"
echo -e "npm: $(npm -v)"
echo

# Network tests
echo -e "${BLUE}Basic Network Tests:${NC}"

# Check internet connectivity
echo -n "Internet connectivity: "
if ping -c 1 8.8.8.8 &> /dev/null; then
    echo -e "${GREEN}OK${NC}"
else
    echo -e "${RED}FAILED${NC} - Cannot reach internet"
fi

# Check DNS
echo -n "DNS resolution: "
if nslookup google.com &> /dev/null; then
    echo -e "${GREEN}OK${NC}"
else
    echo -e "${RED}FAILED${NC} - DNS issues detected"
fi

# Extract MongoDB hostname for ping test
if [ ! -z "$MONGODB_URI" ]; then
    MONGO_HOST=$(echo $MONGODB_URI | sed -n 's/.*@\([^\/]*\)\/.*/\1/p')
    
    if [ ! -z "$MONGO_HOST" ]; then
        echo -n "MongoDB host ping: "
        if ping -c 1 $MONGO_HOST &> /dev/null; then
            echo -e "${GREEN}OK${NC} - Can reach MongoDB host"
        else
            echo -e "${YELLOW}WARNING${NC} - Cannot ping MongoDB host (may be blocked)"
        fi
    fi
fi

# Extract API hostname for ping test
if [ ! -z "$API_URL" ]; then
    API_HOST=$(echo $API_URL | sed -n 's/https\?:\/\/\([^\/]*\).*/\1/p')
    
    if [ ! -z "$API_HOST" ]; then
        echo -n "API host ping: "
        if ping -c 1 $API_HOST &> /dev/null; then
            echo -e "${GREEN}OK${NC} - Can reach API host"
        else
            echo -e "${YELLOW}WARNING${NC} - Cannot ping API host"
        fi
    fi
fi

echo

# Check if mongodb is installed
if ! npm list mongodb &> /dev/null; then
    echo "Installing mongodb package for testing..."
    npm install mongodb --no-save
fi

# Run MongoDB test
echo -e "${BLUE}Running MongoDB connection test...${NC}"
node mongo-connection-test.js
echo

# Run API test
echo -e "${BLUE}Running API connection test...${NC}"
node api-connection-test.js
echo

echo -e "${BLUE}==============================================${NC}"
echo -e "${BLUE}              Diagnosis Complete             ${NC}"
echo -e "${BLUE}==============================================${NC}"
echo
echo -e "If you're experiencing connection issues:"
echo -e "1. Check if MongoDB Atlas IP whitelist includes your server IP"
echo -e "2. Verify your API server is running and accessible"
echo -e "3. Check for any firewall rules blocking connections"
echo -e "4. Ensure your connection strings and credentials are correct"
echo
echo -e "For more help, check the MongoDB Atlas documentation:"
echo -e "${BLUE}https://docs.atlas.mongodb.com/troubleshoot-connection/${NC}" 