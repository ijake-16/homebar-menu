# MongoDB & API Connection Diagnostic Tools

This folder contains diagnostic tools to help troubleshoot MongoDB Atlas and API connection issues on your cloud VM.

## Files

- `mongo-connection-test.js` - Tests connection to MongoDB Atlas
- `api-connection-test.js` - Tests connection to your API endpoints
- `run-diagnostics.sh` - Shell script that runs both tests with additional system diagnostics

## How to Use

1. Upload these files to your cloud VM
2. Make the shell script executable:
   ```
   chmod +x run-diagnostics.sh
   ```
3. Run the diagnostics script:
   ```
   ./run-diagnostics.sh
   ```

The script will prompt you for your MongoDB connection string and API URL if they're not already set as environment variables.

## Setting Environment Variables

For better security, set your MongoDB connection string as an environment variable:

```
export MONGODB_URI="mongodb+srv://your-username:your-password@your-cluster.mongodb.net/your-database?retryWrites=true&w=majority"
```

And set your API URL:

```
export API_URL="http://your-api-url"
```

## Common Issues

1. **IP Whitelist**: Make sure your cloud VM's IP address is added to MongoDB Atlas Network Access list
2. **Firewall Issues**: Check if your VM's firewall is blocking outgoing connections to MongoDB or your API
3. **MongoDB Credentials**: Verify your username and password are correct
4. **Network Configuration**: Some cloud providers restrict outgoing connections by default

## Interpreting Results

The tests will show:
- Basic network connectivity
- DNS resolution capability
- MongoDB connection status
- API endpoint response
- Detailed error messages if any test fails

## For Production Use

When deploying to production:

1. Ensure your backend has proper error handling for MongoDB connection issues
2. Set up monitoring to alert you of database connectivity problems
3. Consider using environment-specific configuration files for different deployment environments
4. Add retry logic for transient connection issues 