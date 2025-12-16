# Troubleshooting Guide

Common issues and their solutions for the South Sudan Immigration Portal.

## Installation Issues

### Issue: npm install fails

**Symptoms:**
```
npm ERR! code ENOENT
npm ERR! syscall open
```

**Solutions:**
1. Ensure Node.js v18+ is installed: `node --version`
2. Clear npm cache: `npm cache clean --force`
3. Delete `node_modules` and `package-lock.json`, then reinstall
4. Check internet connection
5. Try using `npm install --legacy-peer-deps`

### Issue: TypeScript compilation errors

**Symptoms:**
```
error TS2307: Cannot find module
```

**Solutions:**
1. Install TypeScript globally: `npm install -g typescript`
2. Ensure all dependencies are installed: `npm install`
3. Check `tsconfig.json` is present
4. Run `npm run build` to see detailed errors

## Database Issues

### Issue: Cannot connect to MongoDB

**Symptoms:**
```
MongooseServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017
```

**Solutions:**
1. **Check if MongoDB is running:**
   ```bash
   # Windows
   net start MongoDB
   
   # Mac/Linux
   sudo systemctl start mongod
   # or
   brew services start mongodb-community
   ```

2. **Verify connection string in `.env`:**
   ```env
   MONGODB_URI=mongodb://localhost:27017/south_sudan_immigration
   ```

3. **For MongoDB Atlas:**
   - Check IP whitelist
   - Verify username/password
   - Ensure connection string is correct

4. **Test connection:**
   ```bash
   mongosh "mongodb://localhost:27017"
   ```

### Issue: Database authentication failed

**Symptoms:**
```
MongoServerError: Authentication failed
```

**Solutions:**
1. Check MongoDB username and password
2. Verify database name in connection string
3. Ensure user has proper permissions
4. For Atlas, regenerate password and update `.env`

## Server Issues

### Issue: Port already in use

**Symptoms:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solutions:**
1. **Find and kill the process:**
   ```bash
   # Windows
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   
   # Mac/Linux
   lsof -ti:5000 | xargs kill -9
   ```

2. **Change port in `.env`:**
   ```env
   PORT=5001
   ```

### Issue: CORS errors

**Symptoms:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solutions:**
1. Ensure backend CORS is configured for frontend URL
2. Check `CLIENT_URL` in server `.env`
3. Verify frontend is running on correct port
4. Clear browser cache

### Issue: JWT token invalid

**Symptoms:**
```
401 Unauthorized: Not authorized, token failed
```

**Solutions:**
1. Clear browser localStorage
2. Login again to get new token
3. Check `JWT_SECRET` is set in `.env`
4. Verify token hasn't expired (default 7 days)

## File Upload Issues

### Issue: File upload fails

**Symptoms:**
```
Error: File too large
Error: Invalid file type
```

**Solutions:**
1. **Check file size** (max 5MB by default):
   ```env
   MAX_FILE_SIZE=5242880
   ```

2. **Verify file type** (jpg, png, pdf only)

3. **Check upload directory exists:**
   ```bash
   mkdir -p server/uploads
   ```

4. **Verify permissions:**
   ```bash
   chmod 755 server/uploads
   ```

### Issue: Cannot view uploaded files

**Symptoms:**
- Images don't load
- 404 errors for file paths

**Solutions:**
1. Check static file serving in `server/src/index.ts`
2. Verify file paths in database
3. Ensure files exist in `uploads/` directory
4. Check file permissions

## Email Issues

### Issue: Emails not sending

**Symptoms:**
```
Error: Invalid login
Error: Connection timeout
```

**Solutions:**
1. **For Gmail:**
   - Enable 2-Factor Authentication
   - Generate App Password (not regular password)
   - Use App Password in `.env`

2. **Check email configuration:**
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_app_password
   ```

3. **Test email service:**
   - Try sending test email
   - Check spam folder
   - Verify SMTP settings

4. **Common SMTP settings:**
   - Gmail: `smtp.gmail.com:587`
   - Outlook: `smtp.office365.com:587`
   - Yahoo: `smtp.mail.yahoo.com:587`

### Issue: PDF not attached to email

**Symptoms:**
- Email received but no PDF
- PDF generation error

**Solutions:**
1. Check `uploads/pdfs/` directory exists
2. Verify PDFKit is installed
3. Check server logs for PDF generation errors
4. Ensure file permissions allow writing

## Frontend Issues

### Issue: Blank page after build

**Symptoms:**
- Production build shows blank page
- Console errors about modules

**Solutions:**
1. Check browser console for errors
2. Verify API URL in production
3. Clear browser cache
4. Rebuild: `npm run build`

### Issue: API calls failing

**Symptoms:**
```
Network Error
Request failed with status code 404
```

**Solutions:**
1. **Check API URL:**
   ```typescript
   // client/src/lib/api.ts
   baseURL: '/api'  // for same domain
   // or
   baseURL: 'http://localhost:5000/api'  // for different domain
   ```

2. **Verify backend is running**

3. **Check proxy configuration in `vite.config.ts`:**
   ```typescript
   server: {
     proxy: {
       '/api': 'http://localhost:5000'
     }
   }
   ```

### Issue: Form validation not working

**Symptoms:**
- Can submit empty forms
- No error messages

**Solutions:**
1. Check React Hook Form is installed
2. Verify `register` is used on inputs
3. Check `errors` object is displayed
4. Ensure validation rules are set

## Admin Issues

### Issue: Cannot access admin dashboard

**Symptoms:**
```
403 Forbidden
Redirected to /dashboard
```

**Solutions:**
1. **Verify user role in database:**
   ```javascript
   db.users.findOne({ email: "your@email.com" })
   ```

2. **Update role to admin:**
   ```javascript
   db.users.updateOne(
     { email: "your@email.com" },
     { $set: { role: "admin" } }
   )
   ```

3. **Use create-admin script:**
   ```bash
   cd scripts
   npm install
   node create-admin.js
   ```

4. **Clear browser cache and login again**

### Issue: Cannot approve applications

**Symptoms:**
- Approve button disabled
- Error: "Payment not completed"

**Solutions:**
1. Check `paymentStatus` field in application
2. Manually update in database if needed:
   ```javascript
   db.applications.updateOne(
     { _id: ObjectId("application_id") },
     { $set: { paymentStatus: "completed" } }
   )
   ```

## Performance Issues

### Issue: Slow application loading

**Solutions:**
1. Check database indexes
2. Implement pagination (already included)
3. Optimize image sizes
4. Use CDN for static assets
5. Enable caching

### Issue: High memory usage

**Solutions:**
1. Limit file upload sizes
2. Implement file cleanup for old uploads
3. Use streaming for large files
4. Monitor with `node --inspect`

## Development Issues

### Issue: Hot reload not working

**Solutions:**
1. Restart development server
2. Check file watchers limit (Linux):
   ```bash
   echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
   sudo sysctl -p
   ```
3. Verify Vite/nodemon configuration

### Issue: TypeScript errors in IDE

**Solutions:**
1. Restart TypeScript server in IDE
2. Check `tsconfig.json` is correct
3. Install type definitions: `npm install --save-dev @types/node`
4. Reload IDE window

## Production Issues

### Issue: Environment variables not loading

**Solutions:**
1. Ensure `.env` file exists in production
2. Use environment variable management (PM2, Docker)
3. Check file permissions
4. Verify variable names match code

### Issue: SSL/HTTPS errors

**Solutions:**
1. Verify SSL certificate is valid
2. Check certificate paths
3. Ensure HTTPS redirect is configured
4. Test with SSL checker tools

## Getting Help

If you're still experiencing issues:

1. **Check logs:**
   - Server logs: `server/` directory
   - Browser console: F12 → Console
   - MongoDB logs: Check MongoDB log files

2. **Enable debug mode:**
   ```env
   NODE_ENV=development
   DEBUG=*
   ```

3. **Search existing issues:**
   - Check GitHub issues
   - Search error messages online

4. **Create an issue:**
   - Include error messages
   - Provide steps to reproduce
   - Share relevant code snippets
   - Mention your environment (OS, Node version, etc.)

5. **Contact support:**
   - Email: info@immigration.gov.ss
   - Include system information
   - Attach relevant logs

## Useful Commands

```bash
# Check versions
node --version
npm --version
mongod --version

# Clear caches
npm cache clean --force
rm -rf node_modules package-lock.json

# Restart services
# MongoDB
sudo systemctl restart mongod

# Check ports
netstat -ano | findstr :5000  # Windows
lsof -i :5000                 # Mac/Linux

# View logs
tail -f server/logs/error.log
tail -f /var/log/mongodb/mongod.log

# Database operations
mongosh
use south_sudan_immigration
db.users.find()
db.applications.find()
```

## Prevention Tips

1. **Regular backups** - Backup database daily
2. **Monitor logs** - Check logs regularly
3. **Update dependencies** - Keep packages updated
4. **Test changes** - Test in development first
5. **Document changes** - Keep documentation updated
6. **Use version control** - Commit changes regularly
7. **Monitor performance** - Use monitoring tools
8. **Security updates** - Apply security patches promptly

---

**Still need help?** Open an issue on GitHub or contact support.
